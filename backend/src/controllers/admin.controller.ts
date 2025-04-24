import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';
import csv from 'csv-parser';
import * as xlsx from 'xlsx';
import multer from 'multer';
import { Readable } from 'stream';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Use memory storage instead of disk storage
export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    // Accept only csv and excel files
    if (
      file.mimetype === 'text/csv' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and Excel files are allowed'));
    }
  }
});

export const uploadFile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { name } = req.body;
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    
    let parsedData: any[] = [];

    // Process CSV file directly from buffer
    if (fileExtension === '.csv') {
      const results: any[] = [];
      
      await new Promise<void>((resolve, reject) => {
        const readableStream = new Readable();
        readableStream.push(fileBuffer);
        readableStream.push(null); // Signal the end of the stream
        
        readableStream
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => {
            parsedData = results;
            resolve();
          })
          .on('error', (error) => reject(error));
      });
    } 
    // Process Excel file directly from buffer
    else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
      const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      parsedData = xlsx.utils.sheet_to_json(worksheet);
    }

    console.log('Parsed Data:', parsedData);
    
    // Save data to database
    // const excelData = await prisma.excelData.create({
    //   data: {
    //     name: name || fileName,
    //     data: parsedData,
    //     userId: req.user!.id,
    //   }
    // });

    // Extract specific fields and save to ExcelExtractedData table
    let extractedDataPromises: Promise<any>[] = [];
    if (Array.isArray(parsedData) && parsedData.length > 0) {
      extractedDataPromises = parsedData.map(async (row: any) => {
        // Check if the row has the required fields
        if (row.NAME && row.DOB && row.MAIL) {
          try {
            const hashedPassword = await bcrypt.hash(String(row.DOB), 10);
            // Create a record in User with school as it's type
            const schooluser = await prisma.user.create({
              data: {
                name: row.NAME,
                email: row.MAIL,
                password: hashedPassword,
                isPaid: true,
                userType: 'SCHOOL', // Assuming 'STUDENT' is a valid user type
              }
            })
          } catch (error) {
            console.error('Error processing row:', row, error);
            return null;
          }
        }
        return null;
      });
    }

    const insertedUsers = await Promise.all(extractedDataPromises);

    res.status(201).json({ 
      message: 'File processed successfully',
      data: parsedData,
      insertedCount: insertedUsers.filter(Boolean).length,
      users: insertedUsers.filter(Boolean),
    });
  } catch (error) {
    console.error('File processing error:', error);
    res.status(500).json({ message: 'Error processing file' });
  }
};

import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { createReadStream } from 'fs';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '../utils/r2';
import { PubSub } from '@google-cloud/pubsub';

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

const pubsub = new PubSub();

export const addVideo = async (req: AuthRequest, res: Response) => {
  const { title, description, order , moduleId } = req.body;
  console.log('Received request to add video:', req.body);
  const file = req.file;
  
  if (!file) return res.status(400).json({ error: 'No file uploaded' });
  if (!title) return res.status(400).json({ message: 'Title and URL are required' });
  if (!moduleId) return res.status(400).json({ message: 'Module ID is required' });
  
  try {
    const id = uuidv4();
    const key = `raw/${id}.mp4`;
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
      url: `${process.env.R2_ENDPOINT!}/${key}`,
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

// Get all modules
export const getAllModules = async (req: AuthRequest, res: Response) => {
  try {
    const modules = await prisma.module.findMany({
      orderBy: {
        order: 'asc'
      }
    });
    
    res.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new module
export const createModule = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, order } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Module name is required' });
    }
    
    const module = await prisma.module.create({
      data: {
        name,
        description: description || null,
        order: order ? Number(order) : 0
      }
    });
    
    res.status(201).json(module);
  } catch (error) {
    console.error('Error creating module:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
