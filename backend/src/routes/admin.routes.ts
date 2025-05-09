import { Router } from 'express';

import { upload, uploadFile } from '../controllers/admin/admin.excel.controller';
import { addVideo, deleteVideo, getAllVideos, multipleUpload, updateVideo, videoUpload } from '../controllers/admin/admin.video.controller';
import { uploadPdf, pdfUpload, getAllPdfs, deletePdf, updatePdf } from '../controllers/admin/admin.pdfs.controller';
import { createModule, deleteModule, getAllModules, updateModule, moduleImageUpload } from '../controllers/admin/admin.modules.controller';
import { auth, isAdminUser } from '../middleware/auth';
import { createAdmin, deleteAdmin, getAdmins } from '../controllers/admin/admin.auth.controller';
// import { adminGuard } from '../middleware/admin';

const router = Router();

// Upload file endpoint
router.post('/upload', auth, isAdminUser, upload.single('file'), uploadFile);

// Add video endpoint
router.get('/videos', auth, isAdminUser, getAllVideos); 
router.post('/videos', auth, isAdminUser, multipleUpload, addVideo);
router.delete('/videos/:id', auth, isAdminUser, deleteVideo);
router.put('/videos/:id', auth, isAdminUser, videoUpload.single('thumbnail'), updateVideo); // Updated to handle thumbnail uploads

// Add PDF endpoint
router.post('/pdfs', auth, isAdminUser, pdfUpload.single('file'), uploadPdf);
router.get('/pdfs', auth, isAdminUser, getAllPdfs);
router.delete('/pdfs/:id', auth, isAdminUser, deletePdf);
router.put('/pdfs/:id', auth, isAdminUser, updatePdf);

// Module endpoints
router.delete('/module/:id', auth, isAdminUser, deleteModule);
router.post('/modules', auth, isAdminUser, moduleImageUpload.single('image'), createModule);
router.get('/modules', auth, isAdminUser, getAllModules);
router.put('/module/:id', auth, isAdminUser, updateModule);

// Create admin endpoint
router.post('/create', auth, isAdminUser,createAdmin);
router.get('/admins', auth, isAdminUser, getAdmins); // Assuming you want to fetch all admins
router.delete('/admins/:id', auth, isAdminUser, deleteAdmin); // Assuming you want to delete an admin by ID
export default router;
