import { Request, Response } from 'express';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// const path = require('path');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cache directory setup
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
    console.log("Request received for news");
    const now = new Date();

    // Always fetch fresh news - don't use cache for content refreshing
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

    // Pick 3 random topics
    const randomTopics = [];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * topics.length);
      randomTopics.push(topics[randomIndex]);
      topics.splice(randomIndex, 1); // Remove to avoid duplicates
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
      5000
    );

    if (!response.ok) throw new Error(`Failed to fetch news: ${response.status}`);
    const data = await response.json();

    // If we got more than 5 articles, randomly select 5
    let articlesToUse = data.articles;
    if (articlesToUse.length > 5) {
      articlesToUse = shuffleArray(articlesToUse).slice(0, 5);
    }

    const mappedArticles = articlesToUse.map((article: any) => ({
      ...article,
      image: article.image || article.imageUrl || article.urlToImage
    }));

    // Still save to cache for fallback, but always fetch fresh first
    await saveNewsCache(mappedArticles, now);
    console.log("Fetched fresh news, saved to disk cache");

    res.json({ articles: mappedArticles });
  } catch (error: any) {
    console.error('News API error:', error);

    try {
      const cache = await readNewsCache();
      if (cache && cache.articles.length > 0) {
        console.log("Returning old cache due to API error");
        return res.json({
          articles: cache.articles,
          cached: true,
          error: error.message
        });
      }
    } catch (cacheError) {
      console.error("Failed to read cache:", cacheError);
    }

    res.status(500).json({
      error: error.message,
      articles: MOCK_NEWS,
      isMock: true
    });
  }
};

// Add this helper function to shuffle an array randomly
function shuffleArray(array: any[]) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
