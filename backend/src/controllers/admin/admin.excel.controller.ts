import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../../types';
import csv from 'csv-parser';
import * as xlsx from 'xlsx';
import multer from 'multer';
import { Readable } from 'stream';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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

    console.log('Parsed Data:', parsedData);
    
    // Save data to database
    // const excelData = await prisma.excelData.create({
    //   data: {
    //     name: name || fileName,
    //     data: parsedData,
    //     userId: req.user!.id,
    //   }
    // });

    // Extract specific fields and save to ExcelExtractedData table
    let extractedDataPromises: Promise<any>[] = [];
    if (Array.isArray(parsedData) && parsedData.length > 0) {
      extractedDataPromises = parsedData.map(async (row: any) => {
        // Check if the row has the required fields
        if (row.NAME && row.DOB && row.MAIL) {
          try {
            const hashedPassword = await bcrypt.hash(String(row.DOB), 10);
            // Create a record in User with school as it's type
            const schooluser = await prisma.user.create({
              data: {
                name: row.NAME,
                email: row.MAIL,
                password: hashedPassword,
                isPaid: true,
                userType: 'SCHOOL', // Assuming 'STUDENT' is a valid user type
              }
            })
          } catch (error) {
            console.error('Error processing row:', row, error);
            return null;
          }
        }
        return null;
      });
    }

    const insertedUsers = await Promise.all(extractedDataPromises);

    res.status(201).json({ 
      message: 'File processed successfully',
      data: parsedData,
      insertedCount: insertedUsers.filter(Boolean).length,
      users: insertedUsers.filter(Boolean),
    });
  } catch (error) {
    console.error('File processing error:', error);
    res.status(500).json({ message: 'Error processing file' });
  }
};




