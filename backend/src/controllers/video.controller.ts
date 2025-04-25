import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getVideos = async (req: AuthRequest, res: Response) => {
  try {
    const videos = await prisma.video.findMany({
      where:
      {
        encoded: true,
      },
      orderBy: { order: 'asc' },
      include: {
        pdfs: true, // Include associated PDFs
      }
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
    console.log("request in updateProgress", req.user);
    const { videoId } = req.params;
    console.log("videoId", videoId);
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
          orderBy: { order: 'asc' },
          include: { pdfs: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // If user is not paid, limit videos in each module
    if (!req.user?.isPaid) {
      const limitedModules = modules.map(module => ({
        ...module,
        videos: module.videos.slice(0, 1)
      }));
      return res.json(limitedModules);
    }

    res.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all videos (for admin dropdown)
// export const getAllVideos = async (req: AuthRequest, res: Response) => {
//   try {
//     const videos = await prisma.video.findMany({
//       orderBy: { order: 'asc' }
//     });
    
//     res.json(videos);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// Add endpoint to get all PDFs for the logged-in user
// export const getUserPdfs = async (req: AuthRequest, res: Response) => {
//   try {
//     const pdfs = await prisma.pDF.findMany({
//       where: {
//         userId: req.user!.id,
//       },
//       orderBy: {
//         createdAt: 'desc'
//       }
//     });
    
//     res.json(pdfs);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get PDFs not associated with any video
// export const getOrphanedPdfs = async (req: AuthRequest, res: Response) => {
//   try {
//     const pdfs = await prisma.pDF.findMany({
//       where: {
//         userId: req.user!.id,
//         videoId: null,
//       },
//       orderBy: {
//         createdAt: 'desc'
//       }
//     });
    
//     res.json(pdfs);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

