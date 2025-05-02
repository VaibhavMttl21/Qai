import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { AuthRequest } from '../../types';
import { Response } from 'express';

const prisma = new PrismaClient();

export async function createAdmin(req: AuthRequest, res: Response) {
  try {
    const { email, password, name , userType } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    if(userType !== 'ADMIN' && userType !== 'SCHOOL') { 
      return res.status(400).json({ message: 'Invalid user type' });
    }
    // Create the admin user
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        userType: userType, // Make sure this matches your enum
        isPaid: true
      }
    });
    
    res.json({'message' : 'Admin user created successfully'})
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

export const getAdmins = async (req: AuthRequest, res: Response) => {
  try {
    const admins = await prisma.user.findMany({
      where: {
        userType: 'ADMIN',
      }
    });
    
    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Error fetching admins' });
  }
}

export const deleteAdmin = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  try {
    const admin = await prisma.user.findUnique({
      where: { id , userType: 'ADMIN' },
    });
    
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    
    await prisma.user.delete({
      where: { id },
    });
    
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ message: 'Error deleting admin' });
  } 
}