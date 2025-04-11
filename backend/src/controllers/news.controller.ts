import { Request, Response } from 'express';

let cachedNews = null;
let lastFetchTime = null;

export const getNews = async (req: Request, res: Response) => {
  try {
    console.log("request reached here")
    const now = new Date();
    
    // Improve the caching logic - check if cache is less than 15 minutes old
    const cacheAgeInMinutes = lastFetchTime ? 
      Math.floor((now.getTime() - lastFetchTime.getTime()) / (1000 * 60)) : 
      100; // Large value if no cache
    
    if (cachedNews && cacheAgeInMinutes < 15) {
      console.log("Using cached news, age:", cacheAgeInMinutes, "minutes");
      return res.json({ articles: cachedNews });
    }
    
    // Otherwise fetch new data
    const apiKey = `${process.env.NEWS_API_KEY}`; // Replace with your actual API key
    const response = await fetch(
      `https://gnews.io/api/v4/search?q=artificial intelligence OR machine learning OR generative AI OR AI technology&token=${apiKey}&max=5&lang=en`
    );
    
    if (!response.ok) throw new Error('Failed to fetch news');
    const data = await response.json();
    
    // Update cache
    cachedNews = data.articles;
    lastFetchTime = now;
    console.log("Fetched fresh news, caching now");
    res.json({ articles: data.articles });
  } catch (error) {
    console.error('News API error:', error);
    res.status(500).json({ 
      error: error.message,
      articles: [] 
    });
  }
};