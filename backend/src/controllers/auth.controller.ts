import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import admin from 'firebase-admin';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Initialize Firebase Admin SDK (should be done in a separate initialization file)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
}

// Create a nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: process.env.EMAIL_SERVICE || 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com', // Hostinger SMTP server
  port: 465,                  // SSL port
  secure: true,               // Use SSL
  auth: {
    user: process.env.EMAIL_USER,     // Your full Hostinger email
    pass: process.env.EMAIL_PASS,     // Your Hostinger email password
  },
});

// Generate a random 6-digit OTP
const generateRandomOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to user's email
const sendOTPEmail = async (email: string, otp: string) => {
  const mailOptions = {
    // from: process.env.EMAIL_USER,
    from: `"QAI"<${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP for Account Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify Your Account</h2>
        <p>Thank you for registering. Please use the following OTP to verify your account:</p>
        <h1 style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const generateOTP = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Generate OTP
    const otp = generateRandomOTP();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Set expiration time (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Store OTP in database (create or update)
    await prisma.otp.upsert({
      where: { email },
      update: {
        otp,
        expiresAt,
        name,
        password: hashedPassword,
      },
      create: {
        email,
        otp,
        expiresAt,
        name,
        password: hashedPassword,
      },
    });

    // Send OTP to user's email
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('OTP generation error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    // Find OTP record
    const otpRecord = await prisma.otp.findUnique({
      where: { email },
    });

    // Check if OTP exists and is valid
    if (!otpRecord) {
      return res.status(400).json({ message: 'No OTP found for this email' });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if user exists - if yes, it's a forgot password flow
    const existingUser = await prisma.user.findUnique({ where: { email } });
    
    if (existingUser) {
      // This is a forgot password flow - generate a reset token
      const token = jwt.sign(
        { id: existingUser.id, email: existingUser.email },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' } // Token expires in 1 hour
      );
      
      // Delete OTP record
      await prisma.otp.delete({
        where: { email },
      });
      
      return res.status(200).json({ 
        token,
        isPasswordReset: true,
        message: 'OTP verified successfully' 
      });
    }
    
    // If we get here, it's a registration flow - create a new user
    const user = await prisma.user.create({
      data: {
        email,
        password: otpRecord.password,
        name: otpRecord.name,
        userType: 'RANDOM',
      },
    });

    // Delete OTP record
    await prisma.otp.delete({
      where: { email },
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, userType: user.userType, isPaid: user.isPaid, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' } // Expire in 7 days
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    // Redirect to generateOTP
    return await generateOTP(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, dob } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    let isValidCredential = false;
    
    // If it's a SCHOOL user
    if (user.userType === 'SCHOOL') {
      // If the user has a custom password, validate with that
      if (user.hasCustomPassword) {
        isValidCredential = await bcrypt.compare(password, user.password);
      } 
      // Otherwise, validate with DOB (the original behavior)
      else {
        isValidCredential = await bcrypt.compare(String(dob), user.password);
        // console.log('Comparing DOB:', dob, 'with hashed password:', user.password);
      }
    } else {
      // For regular users, validate with password
      isValidCredential = await bcrypt.compare(password, user.password);
    }

    if (!isValidCredential) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, userType: user.userType, isPaid: user.isPaid, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' } // Expire in 7 days
    );

    res.json({ token });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ message: 'ID token is required' });
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture, uid } = decodedToken;
    
    if (!email) {
      return res.status(400).json({ message: 'Email not found in token' });
    }

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      // Create new user if not exists
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0], // Use name from token or fallback to email username
          password: '', // Empty password for OAuth users
          userType: 'RANDOM',
          firebaseUid: uid,
          profilePicture: picture,
        },
      });
    } else {
      // Update existing user's Firebase UID and profile picture if needed
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          firebaseUid: uid,
          profilePicture: picture,
        },
      });
    }

    // Generate JWT token for our application
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        userType: user.userType, 
        isPaid: user.isPaid,
        name: user.name 
      },
      process.env.JWT_SECRET!
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = generateRandomOTP();
    
    // Set expiration time (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Store OTP in database (create or update)
    await prisma.otp.upsert({
      where: { email },
      update: {
        otp,
        expiresAt,
        // Keep the existing password hash for now
        password: user.password,
        name: user.name,
      },
      create: {
        email,
        otp,
        expiresAt,
        password: user.password,
        name: user.name,
      },
    });

    // Send OTP to user's email
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to process forgot password request' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, token, password } = req.body;
    // console.log('Reset password request:', { email, token, password });
    if (!email || !token || !password) {
      return res.status(400).json({ message: 'Email, token, and password are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Verify JWT token
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password and set hasCustomPassword to true if it's a SCHOOL user
    if (user.userType === 'SCHOOL') {
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          password: hashedPassword,
          hasCustomPassword: true 
        },
      });
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
    }

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
};
