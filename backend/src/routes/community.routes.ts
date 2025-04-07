import { Router } from 'express';
import { 
  getPosts, 
  createPost, 
  createReply, 
  createAdminPost, 
  createAdminReply
} from '../controllers/community.controller';
import { auth, isPaidUser, isAdmin } from '../middleware/auth';

const router = Router();

// Regular user routes
router.get('/posts', auth, getPosts);
router.post('/posts', auth, isPaidUser, createPost);
router.post('/posts/:postId/replies', auth, isPaidUser, createReply);

// Admin routes
router.post('/admin/posts', auth, isAdmin, createAdminPost);
router.post('/admin/posts/:postId/replies', auth, isAdmin, createAdminReply);

export default router;