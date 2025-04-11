import { getNews } from "../controllers/news.controller";
import { Router } from 'express';

const router = Router();

// Change this:
router.get('/news', getNews);
// To this - to match the full path expected by frontend:
// router.get('/api/news', getNews);

export default router;