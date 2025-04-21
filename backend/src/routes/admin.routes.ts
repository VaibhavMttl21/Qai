import { Router } from 'express';
import { upload, uploadFile, addVideo, videoUpload, pdfUpload, uploadPdf, getAllPdfs } from '../controllers/admin.controller';
import { auth, isAdminUser } from '../middleware/auth';
// import { adminGuard } from '../middleware/admin';

const router = Router();

// Upload file endpoint
router.post('/upload', auth, isAdminUser, upload.single('file'), uploadFile);

// Add video endpoint
router.post('/videos', auth, isAdminUser, videoUpload.single('file'), addVideo);

// Add PDF endpoint
router.post('/pdfs', auth, isAdminUser, pdfUpload.single('file'), uploadPdf);
router.get('/pdfs', auth, isAdminUser, getAllPdfs);

// Create admin endpoint
// router.post('/create-admin', auth, isAdminUser);

export default router;
