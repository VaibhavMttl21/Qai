import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'SCHOOL' | 'RANDOM' | 'ADMIN';
  isPaid: boolean;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  order: number;
}

export interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  userId: string;
  createdAt: Date;
}

export interface Reply {
  id: string;
  content: string;
  imageUrl?: string;
  userId: string;
  postId: string;
  createdAt: Date;
}

export interface CreateOrderRequest extends Request {
  body: {
    amount: number;
  };
}

export interface VerifyPaymentRequest extends Request {
  body: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  };
}

