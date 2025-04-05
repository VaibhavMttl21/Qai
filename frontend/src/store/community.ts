import { create } from 'zustand';
import api from '../lib/api';
import { socket } from '@/lib/socket';

interface User {
  id: string;
  name: string;
}

interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  user: User;
  replies: Reply[];
  createdAt: string;
}

interface Reply {
  id: string;
  content: string;
  imageUrl?: string;
  user: User;
  createdAt: string;
}

interface CommunityState {
  posts: Post[];
  fetchPosts: () => Promise<void>;
  createPost: (content: string, imageUrl?: string) => Promise<void>;
  createReply: (postId: string, content: string, imageUrl?: string) => Promise<void>;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
  posts: [],
  fetchPosts: async () => {
    try {
      const response = await api.get('/api/community/posts');
      set({ posts: response.data });
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  },
  createPost: async (content, imageUrl) => {
    try {
      const response = await api.post('/api/community/posts', { content, imageUrl });
      set((state) => ({
        posts: [response.data, ...state.posts],
      }));
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  },
  createReply: async (postId, content, imageUrl) => {
    try {
      const response = await api.post(`/api/community/posts/${postId}/replies`, {
        content,
        imageUrl,
      });
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? { ...post, replies: [...post.replies, response.data] }
            : post
        ),
      }));
    } catch (error) {
      console.error('Failed to create reply:', error);
    }
  },
}));

// Setup Socket.IO listeners
socket.on('newPost', (post: Post) => {
  useCommunityStore.setState((state) => ({
    posts: [post, ...state.posts],
  }));
});

socket.on('newReply', ({ postId, reply }: { postId: string; reply: Reply }) => {
  useCommunityStore.setState((state) => ({
    posts: state.posts.map((post) =>
      post.id === postId
        ? { ...post, replies: [...post.replies, reply] }
        : post
    ),
  }));
});