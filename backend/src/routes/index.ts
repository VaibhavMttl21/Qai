import { Router } from 'express';
import authRoutes from './auth.routes';
import videoRoutes from './video.routes';
import communityRoutes from './community.routes';
import paymentRoutes from './payment.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/videos', videoRoutes);
router.use('/community', communityRoutes);
router.use('/payment', paymentRoutes);

export default router;