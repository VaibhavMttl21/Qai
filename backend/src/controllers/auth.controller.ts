import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import admin from 'firebase-admin';

const prisma = new PrismaClient();

// Initialize Firebase Admin SDK (should be done in a separate initialization file)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        userType: 'RANDOM',
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, userType: user.userType, isPaid: user.isPaid, name: user.name },
      process.env.JWT_SECRET!
    );

    res.status(201).json({ token });
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

    // If it's a SCHOOL user and DOB is provided, validate with DOB
    if (user.userType === 'SCHOOL') {
      // Since DOB is stored as a hashed password (from admin upload)
      isValidCredential = await bcrypt.compare(String(dob), user.password);
      console.log('Comparing DOB:', dob, 'with hashed password:', user.password);
    } else {
      // For regular users, validate with password
      isValidCredential = await bcrypt.compare(password, user.password);
    }

    if (!isValidCredential) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, userType: user.userType, isPaid: user.isPaid, name: user.name },
      process.env.JWT_SECRET!
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