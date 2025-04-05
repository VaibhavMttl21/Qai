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
exports.createReply = exports.createPost = exports.getPosts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield prisma.post.findMany({
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
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getPosts = getPosts;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, imageUrl } = req.body;
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
            },
        });
        // Emit socket event for real-time updates
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
