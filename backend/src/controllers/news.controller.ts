import { Request, Response } from 'express';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Fix __dirname in ES modules
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
  } catch (error) {
    // Directory doesn't exist, create it
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
  } catch (error) {
    // File doesn't exist or is invalid
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
    
    // Try to read cache from disk
    const cache = await readNewsCache();
    
    // Check if cache exists and is from today
    if (cache) {
      const cacheDate = cache.timestamp;
      const isToday = cacheDate.getDate() === now.getDate() && 
                     cacheDate.getMonth() === now.getMonth() &&
                     cacheDate.getFullYear() === now.getFullYear();
      
      // Check if cache is from today AND was created after 9 AM
      if (isToday && cacheDate.getHours() >= 9) {
        console.log("Using cached news from disk, cached today after 9 AM");
        return res.json({ articles: cache.articles });
      }
      
      // If it's before 9 AM and we have yesterday's cache after 9 AM, still use it
      if (now.getHours() < 9 && cacheDate.getHours() >= 9) {
        console.log("Using cached news from disk, it's before 9 AM");
        return res.json({ articles: cache.articles });
      }
    }
    
    // If we reach here, we need to fetch new data
    const apiKey = process.env.NEWS_API_KEY; 
    if (!apiKey) {
      throw new Error('NEWS_API_KEY environment variable is not set');
    }
    
    console.log("Fetching fresh news data from API");
    const response = await fetchWithTimeout(
      `https://gnews.io/api/v4/search?q=artificial intelligence OR machine learning OR generative AI OR AI technology&token=${apiKey}&max=5&lang=en`,
      {},
      5000 // 5 second timeout
    );
    
    if (!response.ok) throw new Error(`Failed to fetch news: ${response.status}`);
    const data = await response.json();
    
    // Map the API response to include image property if it's imageUrl in the API
    const mappedArticles = data.articles.map((article: any) => ({
      ...article,
      image: article.image || article.imageUrl || article.urlToImage
    }));
    
    // Cache articles to disk
    await saveNewsCache(mappedArticles, now);
    console.log("Fetched fresh news, saved to disk cache");
    
    res.json({ articles: mappedArticles });
  } catch (error: any) {
    console.error('News API error:', error);
    
    // Try to return cached data as fallback, even if it's old
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
    
    // If all else fails, return mock data with error
    res.status(500).json({ 
      error: error.message,
      articles: MOCK_NEWS,
      isMock: true
    });
  }
};