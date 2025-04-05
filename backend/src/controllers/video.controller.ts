import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getVideos = async (req: AuthRequest, res: Response) => {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { order: 'asc' },
    });

    if (!req.user?.isPaid) {
      // Return only first video for unpaid users
      return res.json(videos.slice(0, 1));
    }

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { videoId } = req.params;
    const { completed } = req.body;

    const progress = await prisma.progress.upsert({
      where: {
        userId_videoId: {
          userId: req.user!.id,
          videoId,
        },
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
    res.status(500).json({ message: 'Server error' });
  }
};