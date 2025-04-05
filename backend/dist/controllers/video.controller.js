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
exports.updateProgress = exports.getVideos = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const videos = yield prisma.video.findMany({
            orderBy: { order: 'asc' },
        });
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isPaid)) {
            // Return only first video for unpaid users
            return res.json(videos.slice(0, 1));
        }
        res.json(videos);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getVideos = getVideos;
const updateProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { videoId } = req.params;
        const { completed } = req.body;
        const progress = yield prisma.progress.upsert({
            where: {
                userId_videoId: {
                    userId: req.user.id,
                    videoId,
                },
            },
            update: { completed },
            create: {
                userId: req.user.id,
                videoId,
                completed,
            },
        });
        res.json(progress);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateProgress = updateProgress;
