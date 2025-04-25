import { Router } from 'express';
import { getVideos, updateProgress, getVideoPdfs, getAllVideos, getAllModules } from '../controllers/video.controller';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', auth, getVideos);
router.get('/all', auth, getAllVideos); 
router.get('/modules', auth, getAllModules); // Add new endpoint for modules
router.post('/:videoId/progress', auth, updateProgress);
router.get('/:videoId/pdfs', auth, getVideoPdfs);

export default router;