import { create } from 'zustand';
import api from '../lib/api';
// Remove node-cron import

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  image?: string;  // Optional URL string matching backend schema
  source?: {
    name: string;
  };
  publishedAt?: string;
}

interface DashboardState {
  news: NewsArticle[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchNews: () => Promise<void>;
  initScheduler: () => void;
  stopScheduler: () => void;
  schedulerTimerId: number | null;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  news: [],
  isLoading: false,
  error: null,
  lastFetched: null,
  schedulerTimerId: null,
  
  fetchNews: async () => {
    // Check if we've already fetched today after 9 AM
    const now = new Date();
    const lastFetched = get().lastFetched !== null && typeof get().lastFetched === 'number' ? new Date(get().lastFetched as number) : null;
    const todayAt9AM = new Date(now);
    todayAt9AM.setHours(9, 0, 0, 0);
    
    // If we've fetched after 9 AM today, use cached data
    if (lastFetched && 
        lastFetched >= todayAt9AM && 
        now.getDate() === lastFetched.getDate() &&
        now.getMonth() === lastFetched.getMonth() &&
        now.getFullYear() === lastFetched.getFullYear()) {
      // Use cached data if already fetched today after 9 AM
      return;
    }
    
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/api/dashboard/news');
      
      // Parse the response data
      const data = response.data;
      set({ 
        news: data.articles || [], 
        lastFetched: now.getTime() 
      });
      
      // Save to localStorage for backup
      localStorage.setItem('aiNews', JSON.stringify(data.articles || []));
      localStorage.setItem('aiNewsFetchedAt', now.toISOString());
    } catch (err: unknown) {
      console.error('News fetch error:', err);
      set({ error: err instanceof Error ? err.message : 'An unknown error occurred' });
      
      // Try to use cached data as fallback
      const cachedNews = localStorage.getItem('aiNews');
      if (cachedNews) {
        set({ news: JSON.parse(cachedNews) });
      }
    } finally {
      set({ isLoading: false });
    }
  },
  
  initScheduler: () => {
    // Clear existing timer if any
    if (get().schedulerTimerId !== null) {
      const timerId = get().schedulerTimerId;
      if (timerId !== null) {
        window.clearTimeout(timerId);
      }
    }
    
    // Function to schedule the next run at 9 AM
    const scheduleNextRun = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      
      // Calculate ms until next 9 AM
      let timeUntilNext = tomorrow.getTime() - now.getTime();
      
      // If it's before 9 AM today, schedule for today at 9 AM instead
      if (now.getHours() < 9) {
        const todayAt9AM = new Date(now);
        todayAt9AM.setHours(9, 0, 0, 0);
        timeUntilNext = todayAt9AM.getTime() - now.getTime();
      }
      
      // Set timeout for next run
      const timerId = window.setTimeout(() => {
        // console.log('Running scheduled news fetch at 9 AM');
        get().fetchNews();
        // Schedule the next run
        scheduleNextRun();
      }, timeUntilNext);
      
      set({ schedulerTimerId: timerId });
    };
    
    // Start the scheduling
    scheduleNextRun();
    
    // Also fetch immediately if we haven't fetched yet today
    const now = new Date();
    const lastFetchedTime = get().lastFetched;
    const lastFetched = lastFetchedTime !== null ? new Date(lastFetchedTime) : null;
    const todayAt9AM = new Date(now);
    todayAt9AM.setHours(9, 0, 0, 0);
    
    if (!lastFetched || 
        (lastFetched < todayAt9AM && now >= todayAt9AM)) {
      get().fetchNews();
    }
  },
  
  stopScheduler: () => {
    const timerId = get().schedulerTimerId;
    if (timerId !== null) {
      window.clearTimeout(timerId);
      set({ schedulerTimerId: null });
    }
  }
}));

// Initialize the scheduler when this module is imported
useDashboardStore.getState().initScheduler();