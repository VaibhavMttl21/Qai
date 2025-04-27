import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../../types';
import csv from 'csv-parser';
import * as xlsx from 'xlsx';
import multer from 'multer';
import { Readable } from 'stream';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Validation functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
};

const isValidDate = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

// Use memory storage instead of disk storage
export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    // Accept only csv and excel files
    if (
      file.mimetype === 'text/csv' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and Excel files are allowed'));
    }
  }
});

export const uploadFile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { name } = req.body;
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    
    let parsedData: any[] = [];

    // Process CSV file directly from buffer
    if (fileExtension === '.csv') {
      const results: any[] = [];
      
      await new Promise<void>((resolve, reject) => {
        const readableStream = new Readable();
        readableStream.push(fileBuffer);
        readableStream.push(null); // Signal the end of the stream
        
        readableStream
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => {
            parsedData = results;
            resolve();
          })
          .on('error', (error) => reject(error));
      });
    } 
    // Process Excel file directly from buffer
    else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
      const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      parsedData = xlsx.utils.sheet_to_json(worksheet);
    }

    // console.log('Parsed Data:', parsedData);
    
    // Normalize keys to uppercase for all rows
    const normalizedData = parsedData.map(row => {
      const normalizedRow: any = {};
      for (const key in row) {
        if (row.hasOwnProperty(key)) {
          normalizedRow[key.toUpperCase()] = row[key];
        }
      }
      return normalizedRow;
    });

    // Check if any required columns are entirely missing
    if (normalizedData.length > 0) {
      const firstRow = normalizedData[0];
      const requiredColumns = ['NAME', 'DOB', 'MAIL'];
      const missingColumns = requiredColumns.filter(col => 
        !Object.keys(firstRow).includes(col)
      );
      
      if (missingColumns.length > 0) {
        return res.status(400).json({
          message: `Required column(s) missing: ${missingColumns.join(', ')}`,
          missingColumns
        });
      }
    }

    // Save data to database
    let extractedDataPromises: Promise<any>[] = [];
    let skippedRows: any[] = [];

    if (Array.isArray(normalizedData) && normalizedData.length > 0) {
      extractedDataPromises = normalizedData.map(async (row: any) => {
        // Check if the row has the required fields
        if (!row.NAME || !row.DOB || !row.MAIL) {
          skippedRows.push({ row, reason: 'Missing required fields (NAME, DOB, or MAIL)' });
          return null;
        }

        // Validate email format
        if (!isValidEmail(row.MAIL)) {
          skippedRows.push({ row, reason: 'Invalid email format' });
          return null;
        }

        // Validate DOB format
        if (!isValidDate(row.DOB)) {
          skippedRows.push({ row, reason: 'Invalid date of birth format' });
          return null;
        }
        
        try {
          const hashedPassword = await bcrypt.hash(String(row.DOB), 10);
          // Create a record in User with school as its type
          const schooluser = await prisma.user.create({
            data: {
              name: row.NAME,
              email: row.MAIL,
              password: hashedPassword,
              isPaid: true,
              userType: 'SCHOOL',
            }
          });
          return schooluser;
        } catch (error) {
          console.error('Error processing row:', row, error);
          skippedRows.push({ row, reason: 'Database error' });
          return null;
        }
      });
    }

    const insertedUsers = await Promise.all(extractedDataPromises);

    res.status(201).json({
      message: 'File processed successfully',
      data: normalizedData,
      insertedCount: insertedUsers.filter(Boolean).length,
      users: insertedUsers.filter(Boolean),
      skippedRows: skippedRows,
    });
  } catch (error) {
    console.error('File processing error:', error);
    res.status(500).json({ message: 'Error processing file' });
  }
};
