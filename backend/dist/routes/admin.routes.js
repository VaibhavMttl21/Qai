"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Upload file endpoint
router.post('/upload', auth_1.auth, auth_1.isAdminUser, admin_controller_1.upload.single('file'), admin_controller_1.uploadFile);
// Add video endpoint
router.post('/videos', auth_1.auth, auth_1.isAdminUser, admin_controller_1.videoUpload.single('file'), admin_controller_1.addVideo);
// Create admin endpoint
// router.post('/create-admin', auth, isAdminUser);
exports.default = router;
