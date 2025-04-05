import { Router } from 'express';
import { upload, uploadFile } from '../controllers/admin.controller';
import { auth, isAdminUser } from '../middleware/auth';

const router = Router();

// Upload file endpoint
router.post('/upload', auth, upload.single('file'), uploadFile);

export default router;
