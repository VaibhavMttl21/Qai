import { Router } from 'express';
import { getVideos, updateProgress, getVideoPdfs, getAllVideos, getAllModules, getProgress } from '../controllers/video.controller';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', auth, getVideos);
router.get('/modules', auth, getAllModules);
router.get('/progress',auth,getProgress) // Add new endpoint for modules
router.post('/:videoId/progress', auth, updateProgress);
router.get('/:videoId/pdfs', auth, getVideoPdfs);

export default router;