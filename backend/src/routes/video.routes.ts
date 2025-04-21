import { Router } from 'express';
import { getVideos, updateProgress, getVideoPdfs, getAllVideos } from '../controllers/video.controller';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', auth, getVideos);
router.get('/all', auth, getAllVideos); // Add this new endpoint for dropdown
router.post('/:videoId/progress', auth, updateProgress);
router.get('/:videoId/pdfs', auth, getVideoPdfs);

export default router;