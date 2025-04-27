import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';
import { getStorage } from 'firebase-admin/storage';
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
    // console.log("request reached");
    const { content, imageUrl } = req.body;
    // console.log('Creating post:', content, imageUrl);
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
    // console.log('Emitting new post event:', post);
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

export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Check if user owns the post or is admin
    const post = await prisma.post.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Verify ownership
    if (post.userId !== req.user!.id && req.user!.userType !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id },
      data: { content },
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

    // Format the response
    const formattedPost = {
      ...updatedPost,
      isAdmin: false,
      replies: updatedPost.replies.map(reply => ({
        ...reply,
        isAdmin: false,
        createdAt: reply.createdAt.toISOString(),
      })),
      createdAt: updatedPost.createdAt.toISOString(),
    };

    // Emit socket event for real-time updates
    req.app.get('io').emit('updatePost', formattedPost);

    res.json(formattedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateReply = async (req: AuthRequest, res: Response) => {
  try {
    const { postId, replyId } = req.params;
    const { content } = req.body;

    // Check if reply exists and belongs to user or user is admin
    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
      include: { user: true }
    });

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    if (reply.userId !== req.user!.id && req.user!.userType !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update the reply
    const updatedReply = await prisma.reply.update({
      where: { id: replyId },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Format the response with isAdmin flag (which is false for regular replies)
    const formattedReply = {
      ...updatedReply,
      isAdmin: false,
      createdAt: updatedReply.createdAt.toISOString(),
    };

    // Emit socket event for real-time updates
    req.app.get('io').emit('updateReply', { postId, reply: formattedReply });

    res.json(formattedReply);
  } catch (error) {
    console.error('Error updating reply:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if post exists and belongs to user or user is admin
    const post = await prisma.post.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.userId !== req.user!.id && req.user!.userType !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Delete image from Firebase if it exists
   // Inside the deletePost function in community.controller.ts
if (post.imageUrl) {
  try {
    // Extract file path from URL - handle both full URLs and path-only URLs
    let filePath;
    if (post.imageUrl.startsWith('http')) {
      // For full URLs (https://firebasestorage.googleapis.com/v0/b/bucket/o/file?token)
      const url = new URL(post.imageUrl);
      // Extract the path after /o/
      const pathMatch = url.pathname.match(/\/o\/(.+)$/);
      if (pathMatch && pathMatch[1]) {
        filePath = decodeURIComponent(pathMatch[1]);
      } else {
        throw new Error('Invalid Firebase Storage URL format');
      }
    } else {
      // For path-only URLs (v0/b/bucket/o/file)
      // Extract the path after /o/
      const pathMatch = post.imageUrl.match(/\/o\/(.+)$|^o\/(.+)$/);
      if (pathMatch) {
        filePath = decodeURIComponent(pathMatch[1] || pathMatch[2]);
      } else {
        // If no /o/ path found, use the whole path as is
        filePath = post.imageUrl;
      }
    }
    
    // console.log(`Attempting to delete file: ${filePath}`);
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
    await getStorage().bucket(bucketName).file(filePath).delete();
    // console.log(`Successfully deleted image from storage: ${filePath}`);
  } catch (error) {
    console.error('Error deleting image from storage:', error);
    // Continue with post deletion even if image deletion fails
  }
}
    // Delete the post
    await prisma.post.delete({
      where: { id }
    });

    // Emit socket event for real-time updates
    req.app.get('io').emit('deletePost', { id });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteReply = async (req: AuthRequest, res: Response) => {
  try {
    const { postId, replyId } = req.params;

    // Check if reply exists and belongs to user or user is admin
    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
      include: { user: true }
    });

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    if (reply.userId !== req.user!.id && req.user!.userType !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Delete the reply
    await prisma.reply.delete({
      where: { id: replyId }
    });

    // Emit socket event for real-time updates
    req.app.get('io').emit('deleteReply', { postId, replyId });

    res.json({ message: 'Reply deleted successfully' });
  } catch (error) {
    console.error('Error deleting reply:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAdminPost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Verify user is admin
    if (req.user!.userType !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }

    // Check if post exists
    const adminPost = await prisma.adminPost.findUnique({
      where: { id }
    });

    if (!adminPost) {
      return res.status(404).json({ message: 'Admin post not found' });
    }

    // Update the admin post
    const updatedAdminPost = await prisma.adminPost.update({
      where: { id },
      data: { content },
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

    // Format the response
    const formattedPost = {
      id: updatedAdminPost.id,
      content: updatedAdminPost.content,
      imageUrl: updatedAdminPost.imageUrl,
      user: updatedAdminPost.user,
      replies: updatedAdminPost.replies.map(reply => ({
        id: reply.id,
        content: reply.content,
        user: reply.user,
        createdAt: reply.createdAt.toISOString(),
        isAdmin: true
      })),
      createdAt: updatedAdminPost.createdAt.toISOString(),
      isAdmin: true
    };

    // Emit socket event for real-time updates
    req.app.get('io').emit('updateAdminPost', formattedPost);

    res.json(formattedPost);
  } catch (error) {
    console.error('Error updating admin post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAdminReply = async (req: AuthRequest, res: Response) => {
  try {
    const { postId, replyId } = req.params;
    const { content } = req.body;

    // Verify user is admin
    if (req.user!.userType !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }

    // Check if admin reply exists
    const adminReply = await prisma.adminReply.findUnique({
      where: { id: replyId }
    });

    if (!adminReply) {
      return res.status(404).json({ message: 'Admin reply not found' });
    }

    // Update the admin reply
    const updatedAdminReply = await prisma.adminReply.update({
      where: { id: replyId },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Format the response
    const formattedReply = {
      id: updatedAdminReply.id,
      content: updatedAdminReply.content,
      user: updatedAdminReply.user,
      createdAt: updatedAdminReply.createdAt.toISOString(),
      isAdmin: true
    };

    // Emit socket event for real-time updates
    req.app.get('io').emit('updateAdminReply', { postId, reply: formattedReply });

    res.json(formattedReply);
  } catch (error) {
    console.error('Error updating admin reply:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAdminPost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Verify user is admin
    if (req.user!.userType !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }

    // Check if admin post exists
    const adminPost = await prisma.adminPost.findUnique({
      where: { id }
    });

    

    if (!adminPost) {
      return res.status(404).json({ message: 'Admin post not found' });
    }
    if (adminPost.imageUrl) {
      try {
        // Extract file path from URL - handle both full URLs and path-only URLs
        let filePath;
        if (adminPost.imageUrl.startsWith('http')) {
          // For full URLs (https://firebasestorage.googleapis.com/v0/b/bucket/o/file?token)
          const url = new URL(adminPost.imageUrl);
          // Extract the path after /o/
          const pathMatch = url.pathname.match(/\/o\/(.+)$/);
          if (pathMatch && pathMatch[1]) {
            filePath = decodeURIComponent(pathMatch[1]);
          } else {
            throw new Error('Invalid Firebase Storage URL format');
          }
        } else {
          // For path-only URLs (v0/b/bucket/o/file)
          // Extract the path after /o/
          const pathMatch = adminPost.imageUrl.match(/\/o\/(.+)$|^o\/(.+)$/);
          if (pathMatch) {
            filePath = decodeURIComponent(pathMatch[1] || pathMatch[2]);
          } else {
            // If no /o/ path found, use the whole path as is
            filePath = adminPost.imageUrl;
          }
        }
        
        // console.log(`Attempting to delete file: ${filePath}`);
        const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
        await getStorage().bucket(bucketName).file(filePath).delete();
        // console.log(`Successfully deleted image from storage: ${filePath}`);
      } catch (error) {
        console.error('Error deleting image from storage:', error);
        // Continue with post deletion even if image deletion fails
      }
    }

    // Delete the admin post
    await prisma.adminPost.delete({
      where: { id }
    });

    // Emit socket event for real-time updates
    req.app.get('io').emit('deleteAdminPost', { id });

    res.json({ message: 'Admin post deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAdminReply = async (req: AuthRequest, res: Response) => {
  try {
    const { postId, replyId } = req.params;

    // Verify user is admin
    if (req.user!.userType !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }

    // Check if admin reply exists
    const adminReply = await prisma.adminReply.findUnique({
      where: { id: replyId }
    });

    if (!adminReply) {
      return res.status(404).json({ message: 'Admin reply not found' });
    }

    // Delete the admin reply
    await prisma.adminReply.delete({
      where: { id: replyId }
    });

    // Emit socket event for real-time updates
    req.app.get('io').emit('deleteAdminReply', { postId, replyId });

    res.json({ message: 'Admin reply deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin reply:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Get regular posts by the user
    const regularPosts = await prisma.post.findMany({
      where: {
        userId: userId
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
      orderBy: { createdAt: 'desc' },
    });
    
    // Get admin posts by the user
    const adminPosts = await prisma.adminPost.findMany({
      where: {
        userId: userId
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
      orderBy: { createdAt: 'desc' },
    });
    
    // Format admin posts similar to regular posts
    const formattedAdminPosts = adminPosts.map(adminPost => ({
      id: adminPost.id,
      content: adminPost.content,
      imageUrl: adminPost.imageUrl,
      user: adminPost.user,
      replies: adminPost.replies.map(reply => ({
        id: reply.id,
        content: reply.content,
        user: reply.user,
        createdAt: reply.createdAt.toISOString(),
        isAdmin: true
      })),
      createdAt: adminPost.createdAt.toISOString(),
      isAdmin: true
    }));
    
    // Format regular posts
    const formattedRegularPosts = regularPosts.map(post => ({
      ...post,
      isAdmin: false,
      replies: post.replies.map(reply => ({
        ...reply,
        isAdmin: false,
        createdAt: reply.createdAt.toISOString(),
      })),
      createdAt: post.createdAt.toISOString(),
    }));
    
    // Combine and sort all posts chronologically
    const allUserPosts = [...formattedAdminPosts, ...formattedRegularPosts];
    allUserPosts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    res.json(allUserPosts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};