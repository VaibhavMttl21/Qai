// src/controllers/paymentController.ts
import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { CreateOrderRequest, VerifyPaymentRequest } from '../types';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

export const createOrder = async (req: CreateOrderRequest, res: Response) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: Number(amount) * 100,
      currency: 'INR',
      receipt: crypto.randomBytes(10).toString('hex'),
    };

    razorpayInstance.orders.create(options, (error: any, order: any) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong!' });
        return;
      }
      res.status(200).json({ data: order });
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const verifyPayment = async (req: VerifyPaymentRequest, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET!)
      .update(sign)
      .digest('hex');

    if (expectedSign === razorpay_signature) {
      await prisma.payment.create({
        data: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        },
      });

      res.json({ message: 'Payment Successful' });
    } else {
      res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateUserPaymentStatus = async (req: Request, res: Response) => {
  try {
    // Extract userId from request body
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    console.log('Updating payment status for user:', userId);
    
    // Update the user's payment status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isPaid: true },
    });
    
    // Return success response
    res.status(200).json({ 
      message: 'Payment status updated successfully',
      isPaid: updatedUser.isPaid
    });
  } catch (error) {
    console.error('Error updating user payment status:', error);
    res.status(500).json({ message: 'Failed to update payment status' });
  }
};