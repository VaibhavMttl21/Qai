"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPosts = exports.deleteAdminReply = exports.deleteAdminPost = exports.updateAdminReply = exports.updateAdminPost = exports.deleteReply = exports.deletePost = exports.updateReply = exports.updatePost = exports.createAdminReply = exports.createAdminPost = exports.createReply = exports.createPost = exports.getPosts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get regular posts
        const regularPosts = yield prisma.post.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                replies: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        // Get admin posts
        const adminPosts = yield prisma.adminPost.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                replies: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                userType: true, // Add this to get the user type
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        // Convert admin posts to regular post format and add admin flags
        const formattedAdminPosts = adminPosts.map(adminPost => ({
            id: adminPost.id,
            content: adminPost.content,
            imageUrl: adminPost.imageUrl,
            user: adminPost.user,
            replies: adminPost.replies.map(reply => ({
                id: reply.id,
                content: reply.content,
                imageUrl: reply.imageUrl,
                user: reply.user,
                createdAt: reply.createdAt.toISOString(),
                // Only mark the reply as admin if the user who posted it is an admin
                isAdmin: reply.user.userType === 'ADMIN'
            })),
            createdAt: adminPost.createdAt.toISOString(),
            isAdmin: true
        }));
        const allPosts = [
            ...formattedAdminPosts,
            ...regularPosts.map(post => (Object.assign(Object.assign({}, post), { isAdmin: false, replies: post.replies.map(reply => (Object.assign(Object.assign({}, reply), { isAdmin: false, createdAt: reply.createdAt.toISOString() }))), createdAt: post.createdAt.toISOString() }))),
        ];
        // Sort by admin status first, then by createdAt
        allPosts.sort((a, b) => {
            // First sort by admin status (admin posts first)
            if (a.isAdmin && !b.isAdmin)
                return -1;
            if (!a.isAdmin && b.isAdmin)
                return 1;
            // Then sort by date (newest first)
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        res.json(allPosts);
    }
    catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getPosts = getPosts;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("request reached");
        const { content, imageUrl } = req.body;
        console.log('Creating post:', content, imageUrl);
        const post = yield prisma.post.create({
            data: {
                content,
                imageUrl,
                userId: req.user.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                replies: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        // Emit socket event for real-time updates
        console.log('Emitting new post event:', post);
        req.app.get('io').emit('newPost', post);
        res.status(201).json(post);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createPost = createPost;
const createReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const { content, imageUrl } = req.body;
        const adminPost = yield prisma.adminPost.findUnique({
            where: { id: postId },
        });
        if (adminPost) {
            // If it's an admin post, create a reply in the admin replies table
            const adminReply = yield prisma.adminReply.create({
                data: {
                    content,
                    imageUrl,
                    userId: req.user.id,
                    adminPostId: postId,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
            // Emit socket event for real-time updates
            req.app.get('io').emit('newAdminReply', { postId, reply: adminReply });
            return res.status(201).json(adminReply);
        }
        const reply = yield prisma.reply.create({
            data: {
                content,
                imageUrl,
                userId: req.user.id,
                postId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        // Emit socket event for real-time updates
        req.app.get('io').emit('newReply', { postId, reply });
        res.status(201).json(reply);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createReply = createReply;
const createAdminPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, imageUrl } = req.body;
        const adminPost = yield prisma.adminPost.create({
            data: {
                content,
                imageUrl,
                userId: req.user.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                replies: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        // Format the admin post to match regular post format with admin flag
        const formattedPost = {
            id: adminPost.id,
            content: adminPost.content,
            imageUrl: adminPost.imageUrl,
            user: adminPost.user,
            replies: adminPost.replies.map(reply => ({
                id: reply.id,
                content: reply.content,
                imageUrl: reply.imageUrl,
                user: reply.user,
                createdAt: reply.createdAt.toISOString(),
                isAdmin: true
            })),
            createdAt: adminPost.createdAt.toISOString(),
            isAdmin: true
        };
        // Emit socket event for real-time updates
        req.app.get('io').emit('newAdminPost', formattedPost);
        res.status(201).json(formattedPost);
    }
    catch (error) {
        console.error('Error creating admin post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createAdminPost = createAdminPost;
const createAdminReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const { content, imageUrl } = req.body;
        const adminReply = yield prisma.adminReply.create({
            data: {
                content,
                imageUrl,
                userId: req.user.id,
                adminPostId: postId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        // Format the admin reply to match regular reply format with admin flag
        const formattedReply = {
            id: adminReply.id,
            content: adminReply.content,
            imageUrl: adminReply.imageUrl,
            user: adminReply.user,
            createdAt: adminReply.createdAt.toISOString(),
            isAdmin: true
        };
        // Emit socket event for real-time updates
        req.app.get('io').emit('newAdminReply', { postId, reply: formattedReply });
        res.status(201).json(formattedReply);
    }
    catch (error) {
        console.error('Error creating admin reply:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createAdminReply = createAdminReply;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { content } = req.body;
        // Check if user owns the post or is admin
        const post = yield prisma.post.findUnique({
            where: { id },
            include: { user: true }
        });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        // Verify ownership
        if (post.userId !== req.user.id && req.user.userType !== 'ADMIN') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        // Update the post
        const updatedPost = yield prisma.post.update({
            where: { id },
            data: { content },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                replies: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        // Format the response
        const formattedPost = Object.assign(Object.assign({}, updatedPost), { isAdmin: false, replies: updatedPost.replies.map(reply => (Object.assign(Object.assign({}, reply), { isAdmin: false, createdAt: reply.createdAt.toISOString() }))), createdAt: updatedPost.createdAt.toISOString() });
        // Emit socket event for real-time updates
        req.app.get('io').emit('updatePost', formattedPost);
        res.json(formattedPost);
    }
    catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updatePost = updatePost;
const updateReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, replyId } = req.params;
        const { content } = req.body;
        // Check if reply exists and belongs to user or user is admin
        const reply = yield prisma.reply.findUnique({
            where: { id: replyId },
            include: { user: true }
        });
        if (!reply) {
            return res.status(404).json({ message: 'Reply not found' });
        }
        if (reply.userId !== req.user.id && req.user.userType !== 'ADMIN') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        // Update the reply
        const updatedReply = yield prisma.reply.update({
            where: { id: replyId },
            data: { content },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        // Format the response with isAdmin flag (which is false for regular replies)
        const formattedReply = Object.assign(Object.assign({}, updatedReply), { isAdmin: false, createdAt: updatedReply.createdAt.toISOString() });
        // Emit socket event for real-time updates
        req.app.get('io').emit('updateReply', { postId, reply: formattedReply });
        res.json(formattedReply);
    }
    catch (error) {
        console.error('Error updating reply:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateReply = updateReply;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if post exists and belongs to user or user is admin
        const post = yield prisma.post.findUnique({
            where: { id },
            include: { user: true }
        });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.userId !== req.user.id && req.user.userType !== 'ADMIN') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        // Delete all replies first (database constraint)
        yield prisma.reply.deleteMany({
            where: { postId: id }
        });
        // Delete the post
        yield prisma.post.delete({
            where: { id }
        });
        // Emit socket event for real-time updates
        req.app.get('io').emit('deletePost', { id });
        res.json({ message: 'Post deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deletePost = deletePost;
const deleteReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, replyId } = req.params;
        // Check if reply exists and belongs to user or user is admin
        const reply = yield prisma.reply.findUnique({
            where: { id: replyId },
            include: { user: true }
        });
        if (!reply) {
            return res.status(404).json({ message: 'Reply not found' });
        }
        if (reply.userId !== req.user.id && req.user.userType !== 'ADMIN') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        // Delete the reply
        yield prisma.reply.delete({
            where: { id: replyId }
        });
        // Emit socket event for real-time updates
        req.app.get('io').emit('deleteReply', { postId, replyId });
        res.json({ message: 'Reply deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting reply:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteReply = deleteReply;
const updateAdminPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { content } = req.body;
        // Verify user is admin
        if (req.user.userType !== 'ADMIN') {
            return res.status(403).json({ message: 'Unauthorized: Admin access required' });
        }
        // Check if post exists
        const adminPost = yield prisma.adminPost.findUnique({
            where: { id }
        });
        if (!adminPost) {
            return res.status(404).json({ message: 'Admin post not found' });
        }
        // Update the admin post
        const updatedAdminPost = yield prisma.adminPost.update({
            where: { id },
            data: { content },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                replies: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        // Format the response
        const formattedPost = {
            id: updatedAdminPost.id,
            content: updatedAdminPost.content,
            imageUrl: updatedAdminPost.imageUrl,
            user: updatedAdminPost.user,
            replies: updatedAdminPost.replies.map(reply => ({
                id: reply.id,
                content: reply.content,
                imageUrl: reply.imageUrl,
                user: reply.user,
                createdAt: reply.createdAt.toISOString(),
                isAdmin: true
            })),
            createdAt: updatedAdminPost.createdAt.toISOString(),
            isAdmin: true
        };
        // Emit socket event for real-time updates
        req.app.get('io').emit('updateAdminPost', formattedPost);
        res.json(formattedPost);
    }
    catch (error) {
        console.error('Error updating admin post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateAdminPost = updateAdminPost;
const updateAdminReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, replyId } = req.params;
        const { content } = req.body;
        // Verify user is admin
        if (req.user.userType !== 'ADMIN') {
            return res.status(403).json({ message: 'Unauthorized: Admin access required' });
        }
        // Check if admin reply exists
        const adminReply = yield prisma.adminReply.findUnique({
            where: { id: replyId }
        });
        if (!adminReply) {
            return res.status(404).json({ message: 'Admin reply not found' });
        }
        // Update the admin reply
        const updatedAdminReply = yield prisma.adminReply.update({
            where: { id: replyId },
            data: { content },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        // Format the response
        const formattedReply = {
            id: updatedAdminReply.id,
            content: updatedAdminReply.content,
            imageUrl: updatedAdminReply.imageUrl,
            user: updatedAdminReply.user,
            createdAt: updatedAdminReply.createdAt.toISOString(),
            isAdmin: true
        };
        // Emit socket event for real-time updates
        req.app.get('io').emit('updateAdminReply', { postId, reply: formattedReply });
        res.json(formattedReply);
    }
    catch (error) {
        console.error('Error updating admin reply:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateAdminReply = updateAdminReply;
const deleteAdminPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Verify user is admin
        if (req.user.userType !== 'ADMIN') {
            return res.status(403).json({ message: 'Unauthorized: Admin access required' });
        }
        // Check if admin post exists
        const adminPost = yield prisma.adminPost.findUnique({
            where: { id }
        });
        if (!adminPost) {
            return res.status(404).json({ message: 'Admin post not found' });
        }
        // Delete all admin replies first (database constraint)
        yield prisma.adminReply.deleteMany({
            where: { adminPostId: id }
        });
        // Delete the admin post
        yield prisma.adminPost.delete({
            where: { id }
        });
        // Emit socket event for real-time updates
        req.app.get('io').emit('deleteAdminPost', { id });
        res.json({ message: 'Admin post deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting admin post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteAdminPost = deleteAdminPost;
const deleteAdminReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, replyId } = req.params;
        // Verify user is admin
        if (req.user.userType !== 'ADMIN') {
            return res.status(403).json({ message: 'Unauthorized: Admin access required' });
        }
        // Check if admin reply exists
        const adminReply = yield prisma.adminReply.findUnique({
            where: { id: replyId }
        });
        if (!adminReply) {
            return res.status(404).json({ message: 'Admin reply not found' });
        }
        // Delete the admin reply
        yield prisma.adminReply.delete({
            where: { id: replyId }
        });
        // Emit socket event for real-time updates
        req.app.get('io').emit('deleteAdminReply', { postId, replyId });
        res.json({ message: 'Admin reply deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting admin reply:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteAdminReply = deleteAdminReply;
const getUserPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // Get regular posts by the user
        const regularPosts = yield prisma.post.findMany({
            where: {
                userId: userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                replies: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        // Get admin posts by the user
        const adminPosts = yield prisma.adminPost.findMany({
            where: {
                userId: userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                replies: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        // Format admin posts similar to regular posts
        const formattedAdminPosts = adminPosts.map(adminPost => ({
            id: adminPost.id,
            content: adminPost.content,
            imageUrl: adminPost.imageUrl,
            user: adminPost.user,
            replies: adminPost.replies.map(reply => ({
                id: reply.id,
                content: reply.content,
                imageUrl: reply.imageUrl,
                user: reply.user,
                createdAt: reply.createdAt.toISOString(),
                isAdmin: true
            })),
            createdAt: adminPost.createdAt.toISOString(),
            isAdmin: true
        }));
        // Format regular posts
        const formattedRegularPosts = regularPosts.map(post => (Object.assign(Object.assign({}, post), { isAdmin: false, replies: post.replies.map(reply => (Object.assign(Object.assign({}, reply), { isAdmin: false, createdAt: reply.createdAt.toISOString() }))), createdAt: post.createdAt.toISOString() })));
        // Combine and sort all posts chronologically
        const allUserPosts = [...formattedAdminPosts, ...formattedRegularPosts];
        allUserPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        res.json(allUserPosts);
    }
    catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getUserPosts = getUserPosts;
