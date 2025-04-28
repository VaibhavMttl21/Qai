import { Request, Response } from 'express';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { z } from 'zod';
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
const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  url: z.string().url(),
  image: z.string().url().optional(),
  publishedAt: z.string().datetime(),
  source: z.object({
    name: z.string()
  })
});

// Define the response schema
const newsResponseSchema = z.object({
  articles: z.array(articleSchema),
  cached: z.boolean().optional(),
  error: z.string().optional(),
  isMock: z.boolean().optional()
});

type NewsResponse = z.infer<typeof newsResponseSchema>;

// Ensure cache directory exists
async function ensureCacheDir() {
  try {
    await fs.access(CACHE_DIR);
  } catch {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  }
}

// Save news to disk
async function saveNewsCache(articles: any[], timestamp: Date) {
  await ensureCacheDir();
  const cacheData = {
    articles,
    timestamp: timestamp.toISOString()
  };
  await fs.writeFile(NEWS_CACHE_FILE, JSON.stringify(cacheData, null, 2));
}

// Read news from disk
async function readNewsCache() {
  try {
    await ensureCacheDir();
    const data = await fs.readFile(NEWS_CACHE_FILE, 'utf-8');
    const cache = JSON.parse(data);
    return {
      articles: cache.articles,
      timestamp: new Date(cache.timestamp)
    };
  } catch {
    return null;
  }
}

// Helper function to fetch with timeout
const fetchWithTimeout = async (url: string, options = {}, timeout = 10000) => {
  console.log(`Fetching URL: ${url}`);
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export const getNews = async (req: Request, res: Response) => {
  try {
    // console.log("Request received for news");
    const now = new Date();
    
    // Check for valid cache from today
    const cache = await readNewsCache();
    
    // If we have cache from today, use it
    if (cache) {
      const cacheDate = new Date(cache.timestamp);
      const isSameDay = 
        cacheDate.getDate() === now.getDate() &&
        cacheDate.getMonth() === now.getMonth() &&
        cacheDate.getFullYear() === now.getFullYear();
        
      if (isSameDay) {
        // console.log("Using today's cached news data");
        // Validate the cached data against our schema
        const validatedCache = newsResponseSchema.parse({ 
          articles: cache.articles, 
          cached: true 
        });
        return res.json(validatedCache);
      }
    }
    
    // If we got here, we need to fetch fresh news
    // console.log("No valid cache found for today, fetching fresh news");
    
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
    const topicQuery = req.query.topic as string | undefined;
    
    // Pick 3 random topics or use the provided topic
    const randomTopics = [];
    if (topicQuery) {
      randomTopics.push(topicQuery);
    } else {
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

    const response = await fetchWithTimeout(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&token=${apiKey}&max=10&lang=en&from=${fromDate}&sortby=${sortBy}`,
      {},
      10000
    );

    if (!response.ok) throw new Error(`Failed to fetch news: ${response.status}`);
    const data = await response.json();
    console.log("Fetched news data from API:", data);

    // If we got more than 5 articles, randomly select 5
    let articlesToUse = data.articles;
    if (articlesToUse.length > 5) {
      articlesToUse = shuffleArray(articlesToUse).slice(0, 5);
    }

    const mappedArticles = articlesToUse.map((article: any) => ({
      ...article,
      image: article.image || article.imageUrl || article.urlToImage
    }));

    // Save the fresh news to cache with the current timestamp
    await saveNewsCache(mappedArticles, now);
    // console.log("Fetched fresh news, saved to disk cache");

    // Validate the response data
    const validatedResponse = newsResponseSchema.parse({ articles: mappedArticles });
    res.json(validatedResponse);
  } catch (error: any) {
    console.error('News API error:', error);

    try {
      const cache = await readNewsCache();
      if (cache && cache.articles.length > 0) {
        // console.log("Returning old cache due to API error");
        // Validate the cached data
        const validatedCache = newsResponseSchema.parse({
          articles: cache.articles,
          cached: true,
          error: error.message
        });
        return res.json(validatedCache);
      }
    } catch (cacheError) {
      console.error("Failed to read cache:", cacheError);
    }

    // Validate mock data
    try {
      const validatedMockData = newsResponseSchema.parse({
        articles: MOCK_NEWS,
        isMock: true,
        error: error.message
      });
      res.status(200).json(validatedMockData);
    } catch (validationError) {
      // If even our mock data is invalid, this is a serious issue
      console.error("Mock data validation failed:", validationError);
      res.status(500).json({
        error: "Internal server error: Unable to provide valid news data"
      });
    }
  }
};

function shuffleArray(articlesToUse: any[]) {
  for (let i = articlesToUse.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [articlesToUse[i], articlesToUse[j]] = [articlesToUse[j], articlesToUse[i]];
  }
  return articlesToUse;
}

