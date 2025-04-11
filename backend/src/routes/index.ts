import { Router } from 'express';
import authRoutes from './auth.routes';
import videoRoutes from './video.routes';
import communityRoutes from './community.routes';
import paymentRoutes from './payment.routes';
import adminRoutes from './admin.routes';
import { getNews } from '../controllers/news.controller';
import dashboardRoutes from './dashboard.routes';


const router = Router();

router.use('/auth', authRoutes);
router.use('/videos', videoRoutes);
router.use('/community', communityRoutes);
router.use('/payment', paymentRoutes);
router.use('/admin', adminRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;