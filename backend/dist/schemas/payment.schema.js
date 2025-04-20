"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPaymentSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
// Schema for creating orders
exports.createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number().min(1, { message: "Amount must be greater than 0" }),
        currency: zod_1.z.string().default("INR"),
        receipt: zod_1.z.string().optional(),
    }).strict(),
    query: zod_1.z.object({}).strict(),
    params: zod_1.z.object({}).strict(),
});
// Schema for verifying payments
exports.verifyPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        razorpay_order_id: zod_1.z.string().min(1, { message: "Order ID is required" }),
        razorpay_payment_id: zod_1.z.string().min(1, { message: "Payment ID is required" }),
        razorpay_signature: zod_1.z.string().min(1, { message: "Signature is required" }),
    }).strict(),
    query: zod_1.z.object({}).strict(),
    params: zod_1.z.object({}).strict(),
});
