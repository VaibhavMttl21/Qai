import { create } from 'zustand';
import api from '../lib/api';

interface PDF {
  id: string;
  title: string;
  description?: string;
  url: string;
  videoId: string;
}

interface Video {
  id: string;
  title: string;
  description: string;
  hlsUrls: HlsUrls;
  order: number;
  moduleId: string;
  pdfs?: PDF[];
}

interface Module {
  id: string;
  name: string;
  description: string;
  imageUrl?: string; // Added image property
  videos?: Video[];
}

export interface HlsUrls {
   high: string;
   mid: string;
   low : string;
}

interface VideoState {
  videos: Video[];
  modules: Module[];
  currentVideo: Video | null;
  loading: boolean; // Add loading state
  progress: Record<string, boolean>;
  fetchVideos: () => Promise<void>;
  fetchModules: () => Promise<void>;
  setCurrentVideo: (video: Video) => void;
  updateProgress: (videoId: string, completed: boolean) => Promise<void>;
  fetchProgress: () => Promise<void>;
}

export const useVideoStore = create<VideoState>((set, get) => ({
  videos: [],
  modules: [],
  currentVideo: null,
  progress: {},
  loading: false, // Initialize loading state
  
  fetchVideos: async () => {
    try {
      const response = await api.get('/api/videos');
      set({ videos: response.data });
      if (response.data.length > 0 && !get().currentVideo) {
        set({ currentVideo: response.data[0] });
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    }
  },
  
  fetchModules: async () => {
    try {
      set({ loading: true }); // Set loading to true before fetching
      const response = await api.get('/api/videos/modules');
      set({ modules: response.data, loading: false }); // Set loading to false when done
    } catch (error) {
      console.error('Failed to fetch modules:', error);
      set({ loading: false }); // Set loading to false on error
    }
  },
  
  setCurrentVideo: (video) => {
    set({ currentVideo: video });
  },
  
  // Fetch progress for all videos
  fetchProgress: async () => {
    try {
      const response = await api.get('/api/videos/progress');
      const progressData = response.data.reduce((acc: Record<string, boolean>, item: { videoId: string; completed: boolean }) => {
        acc[item.videoId] = item.completed;
        return acc;
      }, {});
      set({ progress: progressData });
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    }
  },            

  updateProgress: async (videoId, completed) => {
    try {
      await api.post(`/api/videos/${videoId}/progress`, { completed });
      set((state) => ({
        progress: { ...state.progress, [videoId]: completed }
      }));
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  }
}));