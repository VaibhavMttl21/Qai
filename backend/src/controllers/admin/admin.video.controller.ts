import e, { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../../types';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { createReadStream } from 'fs';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '../../utils/r2';
import { PubSub } from '@google-cloud/pubsub';

const prisma = new PrismaClient();
const pubsub = new PubSub();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/tmp');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

export const videoUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'thumbnail') {
      // Accept images for thumbnail
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(null, false);
        cb(new Error('Only image files are allowed for thumbnails'));
      }
    } else {
      // For video uploads
      if (file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(null, false);
        cb(new Error('Only video files are allowed'));
      }
    }
  },
  limits: { 
    fileSize: 5 * 1024 * 1024 * 1024 // 5GB limit as max for any file
  },
});

// For handling multiple file uploads (video and thumbnail)
export const multipleUpload = videoUpload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

export const addVideo = async (req: AuthRequest, res: Response) => {
  const { title, description, order, demo, moduleId } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  
  // Check if video file was uploaded
  const videoFile = files?.video?.[0];
  if (!videoFile) return res.status(400).json({ error: 'No video file uploaded' });
  if (!title) return res.status(400).json({ message: 'Title is required' });
  if (!moduleId) return res.status(400).json({ message: 'Module ID is required' });
  if(!demo) return res.status(400).json({ message: 'Demo category is required' });
  
  const booldemo = demo === 'true' ? true : false;
  
  try {
    const id = uuidv4();
    const videoKey = `${id}.mp4`;
    const videoStream = createReadStream(videoFile.path);
    
    // Upload video to R2
    await r2.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: videoKey,
      Body: videoStream,
      ContentType: videoFile.mimetype,
    }));
    
    fs.unlinkSync(videoFile.path);
    
    // Handle thumbnail if provided
    let thumbnailUrl = null;
    const thumbnailFile = files?.thumbnail?.[0];
    if (thumbnailFile) {
      const thumbnailKey = `thumbnails/${id}${path.extname(thumbnailFile.originalname)}`;
      const thumbnailStream = createReadStream(thumbnailFile.path);
      
      // Upload thumbnail to R2
      await r2.send(new PutObjectCommand({
        Bucket: process.env.R2_IMG_BUCKET!,
        Key: thumbnailKey,
        Body: thumbnailStream,
        ContentType: thumbnailFile.mimetype,
      }));
      
      fs.unlinkSync(thumbnailFile.path);
      
      // Set the CDN URL for the thumbnail
      thumbnailUrl = `${process.env.R2_IMG_DOMAIN!}/${thumbnailKey}`;
    }

    await prisma.video.create({
      data: {
        id,
        title,
        demo: booldemo,
        description,
        order: Number(order),
        moduleId: moduleId,
        thumbnail: thumbnailUrl,
      },
    });

    const topic = pubsub.topic("video-encoding");
    await topic.publishMessage({
      json: { videoId: id, rawKey: videoKey, demo: booldemo },
    });

    res.status(201).json({ 
      message: 'Video added successfully',
    });
  } catch (error) {
    console.error('Video add error:', error);
    res.status(500).json({ message: 'Error adding video' });
  }
};

// delete video
export const deleteVideo = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  try {
    const video = await prisma.video.findUnique({
      where: { id },
      include:{
        pdfs:true,
      }
    });
    
    if (!video) return res.status(404).json({ message: 'Video not found' });

    // Delete the video from R2
    const key = `${video.id}.mp4`;
    await r2.send(new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
    }));
    
    // console.log('Video deleted from R2:', key);
    const BUCKET = video.demo ? process.env.R2_ENCODED_BUCKET!: process.env.R2_ENCODED_BUCKET_DEMO!;
    if (video.encoded) {
        const encodedKey = `${video.id}`;
        const command = new DeleteObjectCommand({
          Bucket: BUCKET!,
          Key: encodedKey,
        });
        await r2.send(command);
    }
    
    for (const pdf of video.pdfs) {
      const pdfKey = pdf.url.split('/').pop();
      await r2.send(new DeleteObjectCommand({
        Bucket: process.env.R2_PDF_BUCKET!,
        Key: pdfKey,
      }));
      // console.log('PDF deleted from R2:', pdfKey);
    }

    // Delete the video from the database pdf are also deleted due to cascade delete
    await prisma.video.delete({
      where: { id },
    });

    // console.log('Video deleted from database:', id);

    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Video delete error:', error);
    res.status(500).json({ message: 'Error deleting video' });
  }
}

// update video
export const updateVideo = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, order } = req.body;
  const thumbnailFile = req.file;

  if (!id) return res.status(400).json({ message: 'Video ID is required' });
  if (!title) return res.status(400).json({ message: 'Title is required' });
  
  try {
    // Check if the video exists
    const video = await prisma.video.findUnique({
      where: { id }
    });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const updateData: any = {
      title,
      description,
      order: Number(order),
    };

    // Handle thumbnail update if a thumbnail file is provided
    if (thumbnailFile) {
      // Delete old thumbnail if exists
      if (video.thumbnail) {
        const oldThumbnailKey = video.thumbnail.split('/').pop();
        try {
          await r2.send(new DeleteObjectCommand({
            Bucket: process.env.R2_IMG_BUCKET!,
            Key: `thumbnails/${oldThumbnailKey}`,
          }));
        } catch (error) {
          console.error('Error deleting old thumbnail:', error);
          // Continue with upload even if deletion fails
        }
      }
      
      // Upload new thumbnail
      const thumbnailKey = `thumbnails/${id}${path.extname(thumbnailFile.originalname)}`;
      const thumbnailStream = createReadStream(thumbnailFile.path);
      
      await r2.send(new PutObjectCommand({
        Bucket: process.env.R2_IMG_BUCKET!,
        Key: thumbnailKey,
        Body: thumbnailStream,
        ContentType: thumbnailFile.mimetype,
      }));
      
      fs.unlinkSync(thumbnailFile.path);
      
      // Add thumbnail URL to update data
      updateData.thumbnail = `${process.env.R2_IMG_DOMAIN!}/${thumbnailKey}`; 
    }

    // Update video record in database with all changes
    const updatedVideo = await prisma.video.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({
      message: 'Video updated successfully',
      thumbnailUrl: updatedVideo.thumbnail
    });
  } catch (error) {
    console.error('Error updating video:\n', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllVideos = async (req: AuthRequest, res: Response) => {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { order: 'asc' },
    });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}