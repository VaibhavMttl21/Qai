import express from 'express';
import {
  generateOTP,
  verifyOTP,
  login,
  resetPassword,
  register,
  googleAuth,
  forgotPassword,
} from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import {
  generateOTPSchema,
  verifyOTPSchema,
  loginSchema,
  resetPasswordSchema,
  // other schemas
} from '../schemas/auth.schema.js';

const router = express.Router();

router.post('/register', register);
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/generate-otp', validate(generateOTPSchema), generateOTP);
router.post('/verify-otp', validate(verifyOTPSchema), verifyOTP);
router.post('/login', validate(loginSchema), login);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

export default router;