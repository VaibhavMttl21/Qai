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
  url: string;
  hlsUrls: HLSUrls;
  order: number;
  moduleId: string;
  pdfs?: PDF[];
}

interface Module {
  id: string;
  name: string;
  description: string;
  videos?: Video[];
}

interface HLSUrls {
   '1080p': string;
   '720p': string;
   '480p': string;
}

interface VideoState {
  videos: Video[];
  modules: Module[];
  currentVideo: Video | null;
  progress: Record<string, boolean>;
  fetchVideos: () => Promise<void>;
  fetchModules: () => Promise<void>;
  setCurrentVideo: (video: Video) => void;
  updateProgress: (videoId: string, completed: boolean) => Promise<void>;
}

export const useVideoStore = create<VideoState>((set, get) => ({
  videos: [],
  modules: [],
  currentVideo: null,
  progress: {},
  
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
      const response = await api.get('/api/modules');
      set({ modules: response.data });
    } catch (error) {
      console.error('Failed to fetch modules:', error);
    }
  },
  
  setCurrentVideo: (video) => {
    set({ currentVideo: video });
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