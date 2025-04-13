import { Router } from 'express';
import { register, login, googleAuth, verifyOTP, generateOTP } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/generate-otp', generateOTP);
router.post('/verify-otp', verifyOTP);

export default router;