import express from 'express';
import { createOrder, updateUserPaymentStatus, verifyPayment } from '../controllers/payment.controller.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema, verifyPaymentSchema } from '../schemas/payment.schema.js';
// import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-order',validate(createOrderSchema), createOrder);
router.post('/verify-payment', validate(verifyPaymentSchema), verifyPayment);
router.post('/update-payment', updateUserPaymentStatus); // This route is for updating payment status
export default router;