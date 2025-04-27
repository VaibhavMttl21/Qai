import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../../types';
import multer from 'multer';
import path from 'path';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '../../utils/r2';

const prisma = new PrismaClient();

// Configure multer for module image uploads
export const moduleImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

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

    let imageUrl = null;
    
    // Handle file upload to R2 if file is present
    if (req.file) {
      const file = req.file;
      const fileName = `modules/${Date.now()}-${file.originalname}`;
      
      // Upload to R2
      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_IMG_BUCKET,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );
      
      // Generate the URL for the image
      imageUrl = `${process.env.R2_IMG_DOMAIN}/${fileName}`;
      console.log('Image URL:', imageUrl);
    }
    
    const module = await prisma.module.create({
      data: {
        name,
        description: description || null,
        imageUrl,
        order: order ? Number(order) : 0
      }
    });
    
    res.status(201).json(module);
  } catch (error) {
    console.error('Error creating module:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// delete a module
export const deleteModule = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'Module ID is required' });
    }

    const module = await prisma.module.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Module deleted successfully' });
  } catch (error) {
    console.error('Error deleting module:', error);
    res.status(500).json({ message: 'Module may have videos' });
  }
};

// Update a module
export const updateModule = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, description, order } = req.body;

  if (!id) return res.status(400).json({ message: 'Module ID is required' });
  if (!name) return res.status(400).json({ message: 'Name is required' });
  
  try {
    // Check if the module exists
    const module = await prisma.module.findUnique({
      where: { id }
    });

    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Update module record in database
    const updatedModule = await prisma.module.update({
      where: { id },
      data: {
        name,
        description,
        order
}
    });

    res.status(200).json(updatedModule);
  } catch (error) {
    console.error('Error updating module:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

