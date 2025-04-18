import express from 'express';
import { getNews } from '../controllers/news.controller.js';
import { validate } from '../middleware/validate.js';
import { getNewsSchema } from '../schemas/news.schema.js';

const router = express.Router();

router.get('/', validate(getNewsSchema), getNews);

export default router;
