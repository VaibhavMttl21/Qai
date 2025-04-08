import { Router } from 'express';
import { 
  getPosts, 
  createPost, 
  createReply, 
  createAdminPost, 
  createAdminReply,
  updatePost,
  deletePost,
  updateReply,
  deleteReply,
  updateAdminPost,
  deleteAdminPost,
  updateAdminReply,
  deleteAdminReply
} from '../controllers/community.controller';
import { auth, isPaidUser, isAdmin } from '../middleware/auth';

const router = Router();

// Regular user routes
router.get('/posts', auth, getPosts);
router.post('/posts', auth, isPaidUser, createPost);
router.post('/posts/:postId/replies', auth, isPaidUser, createReply);
router.put('/posts/:id', auth, updatePost);
router.delete('/posts/:id', auth, deletePost);
router.put('/posts/:postId/replies/:replyId', auth, updateReply);
router.delete('/posts/:postId/replies/:replyId', auth, deleteReply);

// Admin routes
router.post('/admin/posts', auth, isAdmin, createAdminPost);
router.post('/admin/posts/:postId/replies', auth, isAdmin, createAdminReply);
router.put('/admin/posts/:id', auth, updateAdminPost);
router.delete('/admin/posts/:id', auth, deleteAdminPost);
router.put('/admin/posts/:postId/replies/:replyId', auth, updateAdminReply);
router.delete('/admin/posts/:postId/replies/:replyId', auth, deleteAdminReply);

export default router;