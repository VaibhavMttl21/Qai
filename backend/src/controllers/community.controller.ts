import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const getPosts = async (req: Request, res: Response) => {
  try {
    // Get regular posts
    const regularPosts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true, 
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    // Get admin posts
    const adminPosts = await prisma.adminPost.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                userType: true, // Add this to get the user type
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    // Convert admin posts to regular post format and add admin flags
    const formattedAdminPosts = adminPosts.map(adminPost => ({
      id: adminPost.id,
      content: adminPost.content,
      imageUrl: adminPost.imageUrl,
      user: adminPost.user,
      replies: adminPost.replies.map(reply => ({
        id: reply.id,
        content: reply.content,
        imageUrl: reply.imageUrl,
        user: reply.user,
        createdAt: reply.createdAt.toISOString(),
        // Only mark the reply as admin if the user who posted it is an admin
        isAdmin: reply.user.userType === 'ADMIN'
      })),
      createdAt: adminPost.createdAt.toISOString(),
      isAdmin: true
    }));
    
    // Combine and sort all posts
    type PostWithAdminFlag = {
      id: string;
      content: string;
      imageUrl: string | null;
      user: { id: string; name: string };
      replies: {
        id: string;
        content: string;
        imageUrl: string | null;
        user: { id: string; name: string };
        createdAt: string;
        isAdmin: boolean;
      }[];
      createdAt: string;
      isAdmin: boolean;
    };

    const allPosts: PostWithAdminFlag[] = [
      ...formattedAdminPosts,
      ...regularPosts.map(post => ({
        ...post,
        isAdmin: false,
        replies: post.replies.map(reply => ({
          ...reply,
          isAdmin: false,
          createdAt: reply.createdAt.toISOString(),
        })),
        createdAt: post.createdAt.toISOString(),
      })),
    ];
    
    // Sort by admin status first, then by createdAt
    allPosts.sort((a, b) => {
      // First sort by admin status (admin posts first)
      if (a.isAdmin && !b.isAdmin) return -1;
      if (!a.isAdmin && b.isAdmin) return 1;
      
      // Then sort by date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    res.json(allPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { content, imageUrl } = req.body;
    console.log('Creating post:', content, imageUrl);
    const post = await prisma.post.create({
      data: {
        content,
        imageUrl,
        userId: req.user!.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Emit socket event for real-time updates
    console.log('Emitting new post event:', post);
    req.app.get('io').emit('newPost', post);

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createReply = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const { content, imageUrl } = req.body;

    const adminPost = await prisma.adminPost.findUnique({
      where: { id: postId },
    });

    if (adminPost) {
      // If it's an admin post, create a reply in the admin replies table
      const adminReply = await prisma.adminReply.create({
        data: {
          content,
          imageUrl,
          userId: req.user!.id,
          adminPostId: postId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Emit socket event for real-time updates
      req.app.get('io').emit('newAdminReply', { postId, reply: adminReply });

      return res.status(201).json(adminReply);
    }

    const reply = await prisma.reply.create({
      data: {
        content,
        imageUrl,
        userId: req.user!.id,
        postId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Emit socket event for real-time updates
    req.app.get('io').emit('newReply', { postId, reply });

    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createAdminPost = async (req: AuthRequest, res: Response) => {
  try {
    const { content, imageUrl } = req.body;

    const adminPost = await prisma.adminPost.create({
      data: {
        content,
        imageUrl,
        userId: req.user!.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Format the admin post to match regular post format with admin flag
    const formattedPost = {
      id: adminPost.id,
      content: adminPost.content,
      imageUrl: adminPost.imageUrl,
      user: adminPost.user,
      replies: adminPost.replies.map(reply => ({
        id: reply.id,
        content: reply.content,
        imageUrl: reply.imageUrl,
        user: reply.user,
        createdAt: reply.createdAt.toISOString(),
        isAdmin: true
      })),
      createdAt: adminPost.createdAt.toISOString(),
      isAdmin: true
    };

    // Emit socket event for real-time updates
    req.app.get('io').emit('newAdminPost', formattedPost);

    res.status(201).json(formattedPost);
  } catch (error) {
    console.error('Error creating admin post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createAdminReply = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const { content, imageUrl } = req.body;

    const adminReply = await prisma.adminReply.create({
      data: {
        content,
        imageUrl,
        userId: req.user!.id,
        adminPostId: postId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Format the admin reply to match regular reply format with admin flag
    const formattedReply = {
      id: adminReply.id,
      content: adminReply.content,
      imageUrl: adminReply.imageUrl,
      user: adminReply.user,
      createdAt: adminReply.createdAt.toISOString(),
      isAdmin: true
    };

    // Emit socket event for real-time updates
    req.app.get('io').emit('newAdminReply', { postId, reply: formattedReply });

    res.status(201).json(formattedReply);
  } catch (error) {
    console.error('Error creating admin reply:', error);
    res.status(500).json({ message: 'Server error' });
  }
};