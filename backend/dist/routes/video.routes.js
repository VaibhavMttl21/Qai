"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const video_controller_1 = require("../controllers/video.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.auth, video_controller_1.getVideos);
router.post('/:videoId/progress', auth_1.auth, video_controller_1.updateProgress);
exports.default = router;
