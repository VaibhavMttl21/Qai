import { create } from 'zustand';
import api from '../lib/api';
import { socket } from '@/lib/socket';
import { useAuthStore } from '@/store/auth';

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
  isAdmin?: boolean; // Flag to identify admin posts
}

interface Reply {
  id: string;
  content: string;
  imageUrl?: string;
  user: User;
  createdAt: string;
  isAdmin?: boolean; // Flag to identify admin replies
}

interface CommunityState {
  posts: Post[];
  userPosts: Post[];
  fetchPosts: () => Promise<void>;
  fetchUserPosts: (userId: string) => Promise<void>;
  createPost: (content: string, imageUrl?: string) => Promise<void>;
  createReply: (postId: string, content: string, imageUrl?: string) => Promise<void>;
  createAdminPost: (content: string, imageUrl?: string) => Promise<void>;
  createAdminReply: (postId: string, content: string, imageUrl?: string) => Promise<void>;
  editPost: (postId: string, content: string) => Promise<void>;
  editReply: (postId: string, replyId: string, content: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  deleteReply: (postId: string, replyId: string) => Promise<void>;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
  posts: [],
  userPosts: [],
  fetchPosts: async () => {
    try {
      const response = await api.get('/api/community/posts');
      // Sort posts - admin posts first, then by date
      const sortedPosts = response.data.sort((a: Post, b: Post) => {
        // First sort by admin status (admin posts first)
        if (a.isAdmin && !b.isAdmin) return -1;
        if (!a.isAdmin && b.isAdmin) return 1;
        
        // Then sort by date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      set({ posts: sortedPosts });
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  },
  fetchUserPosts: async (userId) => {
    try {
      const response = await api.get(`/api/community/users/${userId}/posts`);
      console.log("reponse",response)
      set({ userPosts: response.data });
    } catch (error) {
      console.error('Failed to fetch user posts:', error);
    }
  },
  createPost: async (content, imageUrl) => {
    try {
      // Get current user to check if admin
      const user = useAuthStore.getState().user;
      
      if (user?.userType === 'ADMIN') {
        // Use admin endpoint for admin users
        await api.post('/api/community/admin/posts', { 
          content, 
          imageUrl
        });
      } else {
        console.log('Creating post:', content, imageUrl);
        // Use regular endpoint for non-admin users
        await api.post('/api/community/posts', { content, imageUrl });
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  },
  createReply: async (postId, content, imageUrl) => {
    try {
      // Get current user to check if admin
      const user = useAuthStore.getState().user;
      
      // Check if the post is an admin post
      const posts = get().posts;
      const post = posts.find(p => p.id === postId);
      
      if (user?.userType === 'ADMIN') {
        // If admin user and admin post, use admin reply endpoint
        if (post?.isAdmin) {
          await api.post(`/api/community/admin/posts/${postId}/replies`, {
            content,
            imageUrl
          });
        } else {
          // Even if admin user but regular post, use regular reply endpoint
          await api.post(`/api/community/posts/${postId}/replies`, {
            content,
            imageUrl
          });
        }
      } else {
        // Regular user always uses regular reply endpoint
        await api.post(`/api/community/posts/${postId}/replies`, {
          content,
          imageUrl
        });
      }
    } catch (error) {
      console.error('Failed to create reply:', error);
    }
  },
  createAdminPost: async (content, imageUrl) => {
    try {
      await api.post('/api/community/admin/posts', { 
        content, 
        imageUrl
      });
    } catch (error) {
      console.error('Failed to create admin post:', error);
    }
  },
  createAdminReply: async (postId, content, imageUrl) => {
    try {
      await api.post(`/api/community/admin/posts/${postId}/replies`, {
        content,
        imageUrl
      });
    } catch (error) {
      console.error('Failed to create admin reply:', error);
    }
  },
  editPost: async (postId, content) => {
    try {
      const user = useAuthStore.getState().user;
      
      if (user?.userType === 'ADMIN') {
        // Check if it's an admin post
        const posts = get().posts;
        const post = posts.find(p => p.id === postId);
        
        if (post?.isAdmin) {
          // Use admin endpoint for admin posts
          const response = await api.put(`/api/community/admin/posts/${postId}`, { content });
          
          // Update local state
          useCommunityStore.setState((state) => ({
            posts: state.posts.map(p => p.id === postId ? { ...p, content } : p)
          }));
          
          return response.data;
        }
      }
      
      // Regular endpoint for regular posts
      const response = await api.put(`/api/community/posts/${postId}`, { content });
      
      // Update local state
      useCommunityStore.setState((state) => ({
        posts: state.posts.map(p => p.id === postId ? { ...p, content } : p)
      }));
      
      return response.data;
    } catch (error) {
      console.error('Failed to edit post:', error);
    }
  },
  editReply: async (postId, replyId, content) => {
    try {
      const user = useAuthStore.getState().user;
      
      // Check if it's an admin post
      const posts = get().posts;
      const post = posts.find(p => p.id === postId);
      
      if (post?.isAdmin && user?.userType === 'ADMIN') {
        // Use admin endpoint for admin posts
        const response = await api.put(`/api/community/admin/posts/${postId}/replies/${replyId}`, { 
          content 
        });
        
        // Update local state
        useCommunityStore.setState((state) => ({
          posts: state.posts.map(p => {
            if (p.id === postId) {
              return {
                ...p,
                replies: p.replies.map(r => r.id === replyId ? { ...r, content } : r)
              };
            }
            return p;
          })
        }));
        
        return response.data;
      }
      
      // Regular endpoint for regular posts
      const response = await api.put(`/api/community/posts/${postId}/replies/${replyId}`, { 
        content 
      });
      
      // Update local state
      useCommunityStore.setState((state) => ({
        posts: state.posts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              replies: p.replies.map(r => r.id === replyId ? { ...r, content } : r)
            };
          }
          return p;
        })
      }));
      
      return response.data;
    } catch (error) {
      console.error('Failed to edit reply:', error);
    }
  },
  deletePost: async (postId) => {
    try {
      const user = useAuthStore.getState().user;
      
      // Check if it's an admin post
      const posts = get().posts;
      const post = posts.find(p => p.id === postId);
      
      if (post?.isAdmin && user?.userType === 'ADMIN') {
        // Use admin endpoint for admin posts
        await api.delete(`/api/community/admin/posts/${postId}`);
      } else {
        // Regular endpoint for regular posts
        await api.delete(`/api/community/posts/${postId}`);
      }
      
      // Update local state
      useCommunityStore.setState((state) => ({
        posts: state.posts.filter(p => p.id !== postId)
      }));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  },
  deleteReply: async (postId, replyId) => {
    try {
      const user = useAuthStore.getState().user;
      
      // Check if it's an admin post
      const posts = get().posts;
      const post = posts.find(p => p.id === postId);
      
      if (post?.isAdmin && user?.userType === 'ADMIN') {
        // Use admin endpoint for admin posts
        await api.delete(`/api/community/admin/posts/${postId}/replies/${replyId}`);
      } else {
        // Regular endpoint for regular posts
        await api.delete(`/api/community/posts/${postId}/replies/${replyId}`);
      }
      
      // Update local state
      useCommunityStore.setState((state) => ({
        posts: state.posts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              replies: p.replies.filter(r => r.id !== replyId)
            };
          }
          return p;
        })
      }));
    } catch (error) {
      console.error('Failed to delete reply:', error);
    }
  },
}));

// Setup Socket.IO listeners
socket.on('newPost', (post: Post) => {
  useCommunityStore.setState((state) => {
    // Add the new post and sort all posts - admin posts first, then by date
    const updatedPosts = [post, ...state.posts];
    updatedPosts.sort((a, b) => {
      // First sort by admin status
      if (a.isAdmin && !b.isAdmin) return -1;
      if (!a.isAdmin && b.isAdmin) return 1;
      
      // Then sort by date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return { posts: updatedPosts };
  });
  
  // Dispatch an event to notify components about the new post
  window.dispatchEvent(new CustomEvent('newPost', { detail: post }));
});

socket.on('newReply', ({ postId, reply }: { postId: string; reply: Reply }) => {
  useCommunityStore.setState((state) => ({
    posts: state.posts.map((post) => {
      if (post.id === postId) {
        // Add the new reply and sort - admin replies first, then by date
        const updatedReplies = [...post.replies, reply];
        updatedReplies.sort((a, b) => {
          // First sort by admin status
          if (a.isAdmin && !b.isAdmin) return -1;
          if (!a.isAdmin && b.isAdmin) return 1;
          
          // Then sort by date
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        return { ...post, replies: updatedReplies };
      }
      return post;
    }),
  }));
  
  // Dispatch an event to notify components about the new reply
  window.dispatchEvent(new CustomEvent('newReply', { detail: { postId, reply } }));
});

// Handle admin posts/replies with the same events
socket.on('newAdminPost', (post: Post) => {
  useCommunityStore.setState((state) => {
    const updatedPosts = [post, ...state.posts];
    updatedPosts.sort((a, b) => {
      // First sort by admin status
      if (a.isAdmin && !b.isAdmin) return -1;
      if (!a.isAdmin && b.isAdmin) return 1;
      
      // Then sort by date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return { posts: updatedPosts };
  });
  
  window.dispatchEvent(new CustomEvent('newAdminPost', { detail: post }));
});

socket.on('newAdminReply', ({ postId, reply }: { postId: string; reply: Reply }) => {
  useCommunityStore.setState((state) => ({
    posts: state.posts.map((post) => {
      if (post.id === postId) {
        const updatedReplies = [...post.replies, reply];
        updatedReplies.sort((a, b) => {
          // First sort by admin status
          if (a.isAdmin && !b.isAdmin) return -1;
          if (!a.isAdmin && b.isAdmin) return 1;
          
          // Then sort by date
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        return { ...post, replies: updatedReplies };
      }
      return post;
    }),
  }));
  
  window.dispatchEvent(new CustomEvent('newAdminReply', { detail: { postId, reply } }));
});

// Add these socket listeners at the bottom where other socket events are handled

socket.on('updatePost', (post: Post) => {
  useCommunityStore.setState((state) => ({
    posts: state.posts.map(p => p.id === post.id ? post : p)
  }));
});

socket.on('updateReply', ({ postId, reply }: { postId: string; reply: Reply }) => {
  useCommunityStore.setState((state) => ({
    posts: state.posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          replies: post.replies.map(r => r.id === reply.id ? reply : r)
        };
      }
      return post;
    })
  }));
});

socket.on('deletePost', ({ id }: { id: string }) => {
  useCommunityStore.setState((state) => ({
    posts: state.posts.filter(p => p.id !== id)
  }));
});

socket.on('deleteReply', ({ postId, replyId }: { postId: string; replyId: string }) => {
  useCommunityStore.setState((state) => ({
    posts: state.posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          replies: post.replies.filter(r => r.id !== replyId)
        };
      }
      return post;
    })
  }));
});

socket.on('updateAdminPost', (post: Post) => {
  useCommunityStore.setState((state) => ({
    posts: state.posts.map(p => p.id === post.id ? post : p)
  }));
});

socket.on('updateAdminReply', ({ postId, reply }: { postId: string; reply: Reply }) => {
  useCommunityStore.setState((state) => ({
    posts: state.posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          replies: post.replies.map(r => r.id === reply.id ? reply : r)
        };
      }
      return post;
    })
  }));
});

socket.on('deleteAdminPost', ({ id }: { id: string }) => {
  useCommunityStore.setState((state) => ({
    posts: state.posts.filter(p => p.id !== id)
  }));
});

socket.on('deleteAdminReply', ({ postId, replyId }: { postId: string; replyId: string }) => {
  useCommunityStore.setState((state) => ({
    posts: state.posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          replies: post.replies.filter(r => r.id !== replyId)
        };
      }
      return post;
    })
  }));
});