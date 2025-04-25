
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../../types';

const prisma = new PrismaClient();

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

