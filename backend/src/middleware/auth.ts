import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = (req.headers as any).authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const isPaidUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.isPaid) {
    return res.status(403).json({ message: 'Premium access required' });
  }
  next();
};

export const isAdminUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.userType !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};