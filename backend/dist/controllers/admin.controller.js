"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addVideo = exports.videoUpload = exports.uploadFile = exports.upload = void 0;
const client_1 = require("@prisma/client");
const csv_parser_1 = __importDefault(require("csv-parser"));
const xlsx = __importStar(require("xlsx"));
const multer_1 = __importDefault(require("multer"));
const stream_1 = require("stream");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
// Use memory storage instead of disk storage
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter: function (req, file, cb) {
        // Accept only csv and excel files
        if (file.mimetype === 'text/csv' ||
            file.mimetype === 'application/vnd.ms-excel' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            cb(null, true);
        }
        else {
            cb(new Error('Only CSV and Excel files are allowed'));
        }
    }
});
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const { name } = req.body;
        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname;
        const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
        let parsedData = [];
        // Process CSV file directly from buffer
        if (fileExtension === '.csv') {
            const results = [];
            yield new Promise((resolve, reject) => {
                const readableStream = new stream_1.Readable();
                readableStream.push(fileBuffer);
                readableStream.push(null); // Signal the end of the stream
                readableStream
                    .pipe((0, csv_parser_1.default)())
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
        let extractedDataPromises = [];
        if (Array.isArray(parsedData) && parsedData.length > 0) {
            extractedDataPromises = parsedData.map((row) => __awaiter(void 0, void 0, void 0, function* () {
                // Check if the row has the required fields
                if (row.NAME && row.DOB && row.MAIL) {
                    try {
                        const hashedPassword = yield bcryptjs_1.default.hash(String(row.DOB), 10);
                        // Create a record in User with school as it's type
                        const schooluser = yield prisma.user.create({
                            data: {
                                name: row.NAME,
                                email: row.MAIL,
                                password: hashedPassword,
                                isPaid: true,
                                userType: 'SCHOOL', // Assuming 'STUDENT' is a valid user type
                            }
                        });
                    }
                    catch (error) {
                        console.error('Error processing row:', row, error);
                        return null;
                    }
                }
                return null;
            }));
        }
        const insertedUsers = yield Promise.all(extractedDataPromises);
        res.status(201).json({
            message: 'File processed successfully',
            data: parsedData,
            insertedCount: insertedUsers.filter(Boolean).length,
            users: insertedUsers.filter(Boolean),
        });
    }
    catch (error) {
        console.error('File processing error:', error);
        res.status(500).json({ message: 'Error processing file' });
    }
});
exports.uploadFile = uploadFile;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const fs_2 = require("fs");
const client_s3_1 = require("@aws-sdk/client-s3");
const r2_1 = require("../utils/r2");
const pubsub_1 = require("@google-cloud/pubsub");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/tmp');
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    },
});
exports.videoUpload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        }
        else {
            cb(null, false);
            cb(new Error('Only video files are allowed'));
        }
    },
    limits: { fileSize: 8 * 1024 * 1024 * 1024 }, // 8GB max
});
const pubsub = new pubsub_1.PubSub();
const addVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, url, order } = req.body;
    const file = req.file;
    if (!file)
        return res.status(400).json({ error: 'No file uploaded' });
    if (!title || !url)
        return res.status(400).json({ message: 'Title and URL are required' });
    try {
        const id = (0, uuid_1.v4)();
        const key = `raw/${id}.mp4`;
        const stream = (0, fs_2.createReadStream)(file.path);
        yield r2_1.r2.send(new client_s3_1.PutObjectCommand({
            Bucket: process.env.R2_BUCKET,
            Key: key,
            Body: stream,
            ContentType: file.mimetype,
        }));
        fs_1.default.unlinkSync(file.path);
        const video = yield prisma.video.create({
            data: {
                id,
                title,
                description,
                url,
                order: Number(order),
            },
        });
        const topic = pubsub.topic(process.env.PUBSUB_TOPIC);
        yield topic.publishMessage({
            json: { videoId: id, rawKey: key },
        });
        res.status(201).json({
            message: 'Video added successfully',
            video
        });
    }
    catch (error) {
        console.error('Video add error:', error);
        res.status(500).json({ message: 'Error adding video' });
    }
});
exports.addVideo = addVideo;
