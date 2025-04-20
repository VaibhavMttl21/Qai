"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.verifyOTPSchema = exports.generateOTPSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
// Schema for user registration
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Name is required" }),
        email: zod_1.z.string().email({ message: "Invalid email address" }),
        password: zod_1.z.string().min(8, { message: "Password must be at least 8 characters long" }),
    }).strict(),
    query: zod_1.z.object({}).strict(),
    params: zod_1.z.object({}).strict(),
});
// Schema for user login
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email({ message: "Invalid email address" }),
        password: zod_1.z.string().min(1, { message: "Password is required" }),
        dob: zod_1.z.string().optional(),
    }).strict(),
    query: zod_1.z.object({}).strict(),
    params: zod_1.z.object({}).strict(),
});
// Schema for OTP generation
exports.generateOTPSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email({ message: "Invalid email address" }),
        name: zod_1.z.string().min(1, { message: "Name is required" }),
        password: zod_1.z.string().min(8, { message: "Password must be at least 8 characters long" }),
    }).strict(),
    query: zod_1.z.object({}).strict(),
    params: zod_1.z.object({}).strict(),
});
// Schema for OTP verification
exports.verifyOTPSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email({ message: "Invalid email address" }),
        otp: zod_1.z.string().min(6).max(6),
    }).strict(),
    query: zod_1.z.object({}).strict(),
    params: zod_1.z.object({}).strict(),
});
// Schema for password reset
exports.resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email({ message: "Invalid email address" }),
        token: zod_1.z.string().min(1, { message: "Token is required" }),
        password: zod_1.z.string().min(8, { message: "Password must be at least 8 characters long" }),
    }).strict(),
    query: zod_1.z.object({}).strict(),
    params: zod_1.z.object({}).strict(),
});
