"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const news_controller_1 = require("../controllers/news.controller");
const express_1 = require("express");
const router = (0, express_1.Router)();
// Change this:
router.get('/news', news_controller_1.getNews);
// To this - to match the full path expected by frontend:
// router.get('/api/news', getNews);
exports.default = router;
