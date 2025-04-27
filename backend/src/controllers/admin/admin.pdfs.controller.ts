import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../../types';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { createReadStream } from 'fs';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '../../utils/r2';

const prisma = new PrismaClient();


export const pdfUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '/tmp');
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(null, false);
      cb(new Error('Only PDF files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

export const uploadPdf = async (req: AuthRequest, res: Response) => {
  const { title, description, videoId } = req.body;
  const file = req.file;
  
  if (!file) return res.status(400).json({ error: 'No file uploaded' });
  if (!title) return res.status(400).json({ message: 'Title is required' });
  if (!videoId) return res.status(400).json({ message: 'Video ID is required' });
  
  try {
    // Check if the video exists
    const video = await prisma.video.findUnique({
      where: { id: videoId }
    });
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Upload PDF to R2 storage
    const id = uuidv4();
    const key = `${id}.pdf`;
    const stream = createReadStream(file.path);

    await r2.send(new PutObjectCommand({
      Bucket: process.env.R2_PDF_BUCKET!,
      Key: key,
      Body: stream,
      ContentType: 'application/pdf',
    }));

    // Remove the temporary file
    fs.unlinkSync(file.path);

    // Create PDF record in database
    const pdfData = {
      id,
      title,
      description,
      url: `${process.env.R2_PDF_DOMAIN!}/${key}`,
      videoId: videoId, 
    };

    const pdf = await prisma.pDF.create({
      data: pdfData,
    });

    res.status(201).json({ 
      message: 'PDF uploaded successfully',
      pdf
    });
  } catch (error) {
    console.error('PDF upload error:', error);
    res.status(500).json({ message: 'Error uploading PDF' });
  }
};

// Add a new endpoint to get all PDFs (or filtered by user)
export const getAllPdfs = async (req: AuthRequest, res: Response) => {
  try {
    const pdfs = await prisma.pDF.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(pdfs);
  } catch (error) {
    console.error('Error fetching PDFs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// delete a pdf
export const deletePdf = async (req: AuthRequest, res: Response) => {
  try{
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'PDF ID is required' });
    }

    const pdf = await prisma.pDF.findUnique({
      where: { id }
    });

    // Delete the PDF from R2 storage
    if (pdf) {
      const key = pdf.url.split('/').pop();
      await r2.send(new DeleteObjectCommand({
        Bucket: process.env.R2_PDF_BUCKET!,
        Key: key,
      }));
    }
    
    res.status(200).json({ message: 'PDF deleted successfully' });
  }catch (error) {
    console.error('Error deleting PDF:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const updatePdf = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!id) return res.status(400).json({ message: 'PDF ID is required' });
  if (!title) return res.status(400).json({ message: 'Title is required' });
  
  try {
    // Check if the PDF exists
    const pdf = await prisma.pDF.findUnique({
      where: { id }
    });

    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    // Update PDF record in database
    const updatedPdf = await prisma.pDF.update({
      where: { id },
      data: {
        title,
        description,
      },
    });

    res.status(200).json({ 
      message: 'PDF updated successfully',
      pdf: updatedPdf
    });
  } catch (error) {
    console.error('PDF update error:', error);
    res.status(500).json({ message: 'Error updating PDF' });
  }
}