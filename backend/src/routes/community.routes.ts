import { Router } from 'express';
import { getPosts, createPost, createReply } from '../controllers/community.controller';
import { auth, isPaidUser } from '../middleware/auth';

const router = Router();

router.get('/posts', auth, getPosts);
router.post('/posts', auth, isPaidUser, createPost);
router.post('/posts/:postId/replies', auth, isPaidUser, createReply);

export default router;