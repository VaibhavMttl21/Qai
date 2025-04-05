import { Router } from 'express';
import { getVideos, updateProgress } from '../controllers/video.controller';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', auth, getVideos);
router.post('/:videoId/progress', auth, updateProgress);

export default router;