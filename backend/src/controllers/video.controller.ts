import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getEncodedVideos = async (req: AuthRequest, res: Response) => {
  try {
    // Only return videos that are encoded (HLS URLs guaranteed by worker)
    const videos = await prisma.video.findMany({
      where: {
        ...(req.user?.isPaid
          ? { encoded: true }
          : { encoded: true, demo: true })
      },
      orderBy: { order: 'asc' },
      include: {
        pdfs: true,
      }
    });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProgress = async (req: AuthRequest, res: Response) => {
  try {
    // console.log("request in updateProgress", req.user);
    const { videoId } = req.params;
    const { completed } = req.body;
    const progress = await prisma.progress.upsert({
      where: {
        userId_videoId: {
          userId: req.user!.id,
          videoId,
        }
      },
      update: { completed },
      create: {
        userId: req.user!.id,
        videoId,
        completed,
      },
    });

    res.json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//get progress for all videos
export const getProgress = async (req: AuthRequest, res: Response) => {
  try {
    const progress = await prisma.progress.findMany({
      where: {
        userId: req.user!.id,  
      }
    });
    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add endpoint to get PDFs for a specific video
export const getVideoPdfs = async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;
    
    const pdfs = await prisma.pDF.findMany({
      where: {
        videoId: videoId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add endpoint to get all modules with their videos
export const getAllModules = async (req: AuthRequest, res: Response) => {
  try {
    const modules = await prisma.module.findMany({
      include: {
        videos: {
          where: {
            ...(req.user?.isPaid
              ? { encoded: true }
              : { encoded: true, demo: true })
          },
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            thumbnail: true,
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    res.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


