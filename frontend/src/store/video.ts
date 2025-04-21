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
  order: number;
  pdfs?: PDF[];
}

interface VideoProgress {
  videoId: string;
  completed: boolean;
}

interface VideoState {
  videos: Video[];
  currentVideo: Video | null;
  progress: Record<string, boolean>;
  fetchVideos: () => Promise<void>;
  setCurrentVideo: (video: Video) => void;
  updateProgress: (videoId: string, completed: boolean) => Promise<void>;
}

export const useVideoStore = create<VideoState>((set, get) => ({
  videos: [],
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
  setCurrentVideo: (video) => {
    set({ currentVideo: video });
  },
  updateProgress: async (videoId, completed) => {
    try {
      await api.post(`/api/videos/${videoId}/progress`, { completed });
      set((state) => ({
        progress: { ...state.progress, [videoId]: completed },
      }));
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  },
}));