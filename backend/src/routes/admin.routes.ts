import { Router } from 'express';

import { upload, uploadFile } from '../controllers/admin/admin.excel.controller';
import { addVideo, deleteVideo, videoUpload } from '../controllers/admin/admin.video.controller';
import { uploadPdf, pdfUpload, getAllPdfs, deletePdf } from '../controllers/admin/admin.pdfs.controller';
import { createModule, deleteModule } from '../controllers/admin/admin.modules.controller';
import { auth, isAdminUser } from '../middleware/auth';
// import { adminGuard } from '../middleware/admin';

const router = Router();

// Upload file endpoint
router.post('/upload', auth, isAdminUser, upload.single('file'), uploadFile);

// Add video endpoint
router.post('/videos', auth, isAdminUser, videoUpload.single('file'), addVideo);
router.delete('/videos/:id', auth, isAdminUser,deleteVideo);
// Add PDF endpoint
router.post('/pdfs', auth, isAdminUser, pdfUpload.single('file'), uploadPdf);
router.get('/pdfs', auth, isAdminUser, getAllPdfs);
router.delete('/pdfs/:id', auth, isAdminUser, deletePdf);
// Module endpoints
router.delete('/module/:id', auth, isAdminUser, deleteModule);
router.post('/modules', auth, isAdminUser, createModule);
router.delete('/module/:id', auth, isAdminUser, createModule);

// Create admin endpoint
// router.post('/create-admin', auth, isAdminUser);

export default router;
