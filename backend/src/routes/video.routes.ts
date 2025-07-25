import { Router } from 'express';
import { updateProgress, getVideoPdfs, getAllModules, getProgress, getEncodedVideos } from '../controllers/video.controller';
import { auth, isPaidUser } from '../middleware/auth';

const router = Router();

router.get('/', auth, getEncodedVideos);
router.get('/modules', auth, getAllModules);
router.get('/progress',auth,getProgress) // Add new endpoint for modules
router.post('/:videoId/progress', auth, updateProgress);
router.get('/:videoId/pdfs', auth,isPaidUser,getVideoPdfs);

export default router;