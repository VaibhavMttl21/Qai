import { Router } from 'express';
import { createCheckoutSession, handleWebhook } from '../controllers/payment.controller';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/create-checkout-session', auth, createCheckoutSession);
router.post('/webhook', handleWebhook);

export default router;