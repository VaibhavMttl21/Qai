import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../../types';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { createReadStream } from 'fs';
import { PutObjectCommand,DeleteObjectCommand } from '@aws-sdk/client-s3';
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
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(null, false);
      cb(new Error('Only video files are allowed'));
    }
  },
  limits: { fileSize: 8 * 1024 * 1024 * 1024 }, // 8GB max
});


export const addVideo = async (req: AuthRequest, res: Response) => {
  const { title, description, order , moduleId } = req.body;
  console.log('Received request to add video:', req.body);
  const file = req.file;
  
  if (!file) return res.status(400).json({ error: 'No file uploaded' });
  if (!title) return res.status(400).json({ message: 'Title and URL are required' });
  if (!moduleId) return res.status(400).json({ message: 'Module ID is required' });
  
  try {
    const id = uuidv4();
    const key = `${id}.mp4`;
    const stream = createReadStream(file.path);
    console.log('Uploading video to R2:', key);
    await r2.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
      Body: stream,
      ContentType: file.mimetype,
    }));
    const url = `${process.env.R2_PUBLIC_URL}/${key}`;
    console.log('Video uploaded to R2:', key);
    fs.unlinkSync(file.path);

    const video = await prisma.video.create({
      data: {
        id,
        title,
        description,
        url,
        order: Number(order),
        moduleId: moduleId,
      },
    });
    console.log('Video created in database:', video);

    const topic = pubsub.topic(process.env.PUBSUB_TOPIC!);
    await topic.publishMessage({
      json: { videoId: id, rawKey: key },
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
    });
    
    if (!video) return res.status(404).json({ message: 'Video not found' });

    // Delete the video from R2
    const key = `${video.id}.mp4`;
    await r2.send(new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
    }));
    console.log('Video deleted from R2:', key);

    const encodedKey = `${video.id}`;
      const command = new DeleteObjectCommand({
        Bucket: process.env.R2_ENCODED_BUCKET!,
        Key: encodedKey,
      });
      await r2.send(command);

    // Delete the video from the database
    await prisma.video.delete({
      where: { id },
    });
    console.log('Video deleted from database:', id);

    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Video delete error:', error);
    res.status(500).json({ message: 'Error deleting video' });
  }
}