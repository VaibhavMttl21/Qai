import { z } from 'zod';

// Schema for user registration
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  }).strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

// Schema for user login
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
    dob: z.string().optional(),
  }).strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

// Schema for OTP generation
export const generateOTPSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    name: z.string().min(1, { message: "Name is required" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  }).strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

// Schema for OTP verification
export const verifyOTPSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    otp: z.string().min(6).max(6),
  }).strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

// Schema for password reset
export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    token: z.string().min(1, { message: "Token is required" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  }).strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});
