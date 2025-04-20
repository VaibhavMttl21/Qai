"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const community_controller_1 = require("../controllers/community.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Regular user routes
router.get('/posts', auth_1.auth, community_controller_1.getPosts);
router.get('/users/:userId/posts', auth_1.auth, community_controller_1.getUserPosts); // New endpoint for user posts
router.post('/posts', auth_1.auth, auth_1.isPaidUser, community_controller_1.createPost);
router.post('/posts/:postId/replies', auth_1.auth, auth_1.isPaidUser, community_controller_1.createReply);
router.put('/posts/:id', auth_1.auth, community_controller_1.updatePost);
router.delete('/posts/:id', auth_1.auth, community_controller_1.deletePost);
router.put('/posts/:postId/replies/:replyId', auth_1.auth, community_controller_1.updateReply);
router.delete('/posts/:postId/replies/:replyId', auth_1.auth, community_controller_1.deleteReply);
// Admin routes
router.post('/admin/posts', auth_1.auth, auth_1.isAdmin, community_controller_1.createAdminPost);
router.post('/admin/posts/:postId/replies', auth_1.auth, auth_1.isAdmin, community_controller_1.createAdminReply);
router.put('/admin/posts/:id', auth_1.auth, community_controller_1.updateAdminPost);
router.delete('/admin/posts/:id', auth_1.auth, community_controller_1.deleteAdminPost);
router.put('/admin/posts/:postId/replies/:replyId', auth_1.auth, community_controller_1.updateAdminReply);
router.delete('/admin/posts/:postId/replies/:replyId', auth_1.auth, community_controller_1.deleteAdminReply);
exports.default = router;
