import { Request, Response } from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const prisma = new PrismaClient();

export const createCheckoutSession = async (req: AuthRequest, res: Response) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Course Access',
              description: 'Full access to all course videos and community features',
            },
            unit_amount: 4900, // $49.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      customer_email: req.user?.email,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: 'Error creating checkout session' });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature']!;

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      await prisma.user.update({
        where: { email: session.customer_email! },
        data: { isPaid: true },
      });
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ message: 'Webhook error' });
  }
};