import { Router } from 'express';
import { upload, uploadFile, addVideo, videoUpload } from '../controllers/admin.controller';
import { auth, isAdminUser } from '../middleware/auth';

const router = Router();

// Upload file endpoint
router.post('/upload', auth, isAdminUser, upload.single('file'), uploadFile);

// Add video endpoint
router.post('/videos', auth, isAdminUser,videoUpload.single('file') ,addVideo);

// Create admin endpoint
// router.post('/create-admin', auth, isAdminUser);

export default router;
