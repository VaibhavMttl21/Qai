import { z } from 'zod';

// Schema for creating orders
export const createOrderSchema = z.object({
  body: z.object({
    amount: z.number().min(1, { message: "Amount must be greater than 0" }),
    currency: z.string().default("INR"),
    receipt: z.string().optional(),
  }).strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

// Schema for verifying payments
export const verifyPaymentSchema = z.object({
  body: z.object({
    razorpay_order_id: z.string().min(1, { message: "Order ID is required" }),
    razorpay_payment_id: z.string().min(1, { message: "Payment ID is required" }),
    razorpay_signature: z.string().min(1, { message: "Signature is required" }),
  }).strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});
