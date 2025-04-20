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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNews = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const zod_1 = require("zod");
// const path = require('path');
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// // Cache directory setup
// const CACHE_DIR = path.join(__dirname, '../../cache');
// const NEWS_CACHE_FILE = path.join(CACHE_DIR, 'news-cache.json');
const CACHE_DIR = path.join(__dirname, '../../cache');
const NEWS_CACHE_FILE = path.join(CACHE_DIR, 'news-cache.json');
// Mock news data for when API is unreachable and no cache exists
const MOCK_NEWS = [
    {
        title: "Advances in AI Research Show Promise for Healthcare",
        description: "New research demonstrates how artificial intelligence can improve diagnostic accuracy in medical imaging.",
        url: "https://example.com/ai-healthcare",
        image: "https://example.com/images/ai-healthcare.jpg",
        publishedAt: new Date().toISOString(),
        source: { name: "Tech Journal" }
    },
    {
        title: "AI Ethics Panel Releases New Guidelines",
        description: "Leading experts have published comprehensive guidelines for responsible AI development and deployment.",
        url: "https://example.com/ai-ethics",
        image: "https://example.com/images/ai-ethics.jpg",
        publishedAt: new Date().toISOString(),
        source: { name: "AI Review" }
    },
    {
        title: "Machine Learning Models Becoming More Efficient",
        description: "Recent advancements have led to smaller, faster AI models that require less computing power.",
        url: "https://example.com/efficient-ml",
        image: "https://example.com/images/efficient-ml.jpg",
        publishedAt: new Date().toISOString(),
        source: { name: "Data Science Weekly" }
    }
];
// Define the article schema for validation and type safety
const articleSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    url: zod_1.z.string().url(),
    image: zod_1.z.string().url().optional(),
    publishedAt: zod_1.z.string().datetime(),
    source: zod_1.z.object({
        name: zod_1.z.string()
    })
});
// Define the response schema
const newsResponseSchema = zod_1.z.object({
    articles: zod_1.z.array(articleSchema),
    cached: zod_1.z.boolean().optional(),
    error: zod_1.z.string().optional(),
    isMock: zod_1.z.boolean().optional()
});
// Ensure cache directory exists
function ensureCacheDir() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs.access(CACHE_DIR);
        }
        catch (_a) {
            yield fs.mkdir(CACHE_DIR, { recursive: true });
        }
    });
}
// Save news to disk
function saveNewsCache(articles, timestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ensureCacheDir();
        const cacheData = {
            articles,
            timestamp: timestamp.toISOString()
        };
        yield fs.writeFile(NEWS_CACHE_FILE, JSON.stringify(cacheData, null, 2));
    });
}
// Read news from disk
function readNewsCache() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield ensureCacheDir();
            const data = yield fs.readFile(NEWS_CACHE_FILE, 'utf-8');
            const cache = JSON.parse(data);
            return {
                articles: cache.articles,
                timestamp: new Date(cache.timestamp)
            };
        }
        catch (_a) {
            return null;
        }
    });
}
// Helper function to fetch with timeout
const fetchWithTimeout = (url_1, ...args_1) => __awaiter(void 0, [url_1, ...args_1], void 0, function* (url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = yield fetch(url, Object.assign(Object.assign({}, options), { signal: controller.signal }));
        clearTimeout(id);
        return response;
    }
    catch (error) {
        clearTimeout(id);
        throw error;
    }
});
const getNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Request received for news");
        const now = new Date();
        // Check for valid cache from today
        const cache = yield readNewsCache();
        // If we have cache from today, use it
        if (cache) {
            const cacheDate = new Date(cache.timestamp);
            const isSameDay = cacheDate.getDate() === now.getDate() &&
                cacheDate.getMonth() === now.getMonth() &&
                cacheDate.getFullYear() === now.getFullYear();
            if (isSameDay) {
                console.log("Using today's cached news data");
                // Validate the cached data against our schema
                const validatedCache = newsResponseSchema.parse({
                    articles: cache.articles,
                    cached: true
                });
                return res.json(validatedCache);
            }
        }
        // If we got here, we need to fetch fresh news
        console.log("No valid cache found for today, fetching fresh news");
        const apiKey = process.env.NEWS_API_KEY;
        if (!apiKey) {
            throw new Error('NEWS_API_KEY environment variable is not set');
        }
        // Calculate yesterday's date for the "from" parameter
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const fromDate = yesterday.toISOString().split('T')[0];
        // Array of AI-related topics to randomly rotate through
        const topics = [
            'artificial intelligence',
            'machine learning',
            'AI applications',
            'generative AI',
            'neural networks',
            'deep learning',
            'AI technology'
        ];
        // Extract query params if they exist
        const topicQuery = req.query.topic;
        // Pick 3 random topics or use the provided topic
        const randomTopics = [];
        if (topicQuery) {
            randomTopics.push(topicQuery);
        }
        else {
            for (let i = 0; i < 3; i++) {
                const randomIndex = Math.floor(Math.random() * topics.length);
                randomTopics.push(topics[randomIndex]);
                topics.splice(randomIndex, 1); // Remove to avoid duplicates
            }
        }
        // Create a query with the random topics
        const query = randomTopics.join(' OR ');
        // Add a random sorting parameter (publishedAt or relevance)
        const sortBy = Math.random() > 0.5 ? 'publishedAt' : 'relevance';
        console.log(`Fetching fresh news data from API with query: ${query}`);
        console.log(`Using sort: ${sortBy}, from date: ${fromDate}`);
        const response = yield fetchWithTimeout(`https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&token=${apiKey}&max=10&lang=en&from=${fromDate}&sortby=${sortBy}`, {}, 10000);
        if (!response.ok)
            throw new Error(`Failed to fetch news: ${response.status}`);
        const data = yield response.json();
        // If we got more than 5 articles, randomly select 5
        let articlesToUse = data.articles;
        if (articlesToUse.length > 5) {
            articlesToUse = shuffleArray(articlesToUse).slice(0, 5);
        }
        const mappedArticles = articlesToUse.map((article) => (Object.assign(Object.assign({}, article), { image: article.image || article.imageUrl || article.urlToImage })));
        // Save the fresh news to cache with the current timestamp
        yield saveNewsCache(mappedArticles, now);
        console.log("Fetched fresh news, saved to disk cache");
        // Validate the response data
        const validatedResponse = newsResponseSchema.parse({ articles: mappedArticles });
        res.json(validatedResponse);
    }
    catch (error) {
        console.error('News API error:', error);
        try {
            const cache = yield readNewsCache();
            if (cache && cache.articles.length > 0) {
                console.log("Returning old cache due to API error");
                // Validate the cached data
                const validatedCache = newsResponseSchema.parse({
                    articles: cache.articles,
                    cached: true,
                    error: error.message
                });
                return res.json(validatedCache);
            }
        }
        catch (cacheError) {
            console.error("Failed to read cache:", cacheError);
        }
        // Validate mock data
        try {
            const validatedMockData = newsResponseSchema.parse({
                articles: MOCK_NEWS,
                isMock: true,
                error: error.message
            });
            res.status(500).json(validatedMockData);
        }
        catch (validationError) {
            // If even our mock data is invalid, this is a serious issue
            console.error("Mock data validation failed:", validationError);
            res.status(500).json({
                error: "Internal server error: Unable to provide valid news data"
            });
        }
    }
});
exports.getNews = getNews;
function shuffleArray(articlesToUse) {
    for (let i = articlesToUse.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [articlesToUse[i], articlesToUse[j]] = [articlesToUse[j], articlesToUse[i]];
    }
    return articlesToUse;
}
