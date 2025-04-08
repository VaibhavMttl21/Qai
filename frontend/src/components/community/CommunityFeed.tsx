import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommunityStore } from '@/store/community';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CreatePostDialog } from './CreatePostDialog';
import { Post } from './Post';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { useToast } from '@/components/ui/toaster';

export function CommunityFeed() {
  const { posts, fetchPosts } = useCommunityStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'prioritized' | 'chronological'>('prioritized');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true);
      setError(null);
      try {
        await fetchPosts();
      } catch (err) {
        setError('Failed to load community posts. Please try again later.');
        toast('Failed to load posts', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadPosts();
    
    // Connect to socket when component mounts
    connectSocket();
    
    // Set up toast notifications for real-time updates
    const handleNewPost = () => {
      toast('New post has been added!', 'info');
    };
    
    const handleNewReply = () => {
      toast('New reply has been added!', 'info');
    };
    
    // Add event listeners to global window object
    window.addEventListener('newPost', handleNewPost);
    window.addEventListener('newReply', handleNewReply);
    
    // Clean up socket connection and event listeners when component unmounts
    return () => {
      disconnectSocket();
      window.removeEventListener('newPost', handleNewPost);
      window.removeEventListener('newReply', handleNewReply);
    };
  }, [fetchPosts, toast]);

  // Apply sorting based on view mode
  const sortedPosts = [...posts].sort((a, b) => {
    if (viewMode === 'prioritized') {
      // First sort by admin status (admin posts first)
      if (a.isAdmin && !b.isAdmin) return -1;
      if (!a.isAdmin && b.isAdmin) return 1;
    }
    // Then sort by date (newest first) - always applies
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center mb-8">
        <h2 className="text-2xl font-bold">Community Discussion</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="view-mode" 
              checked={viewMode === 'prioritized'}
              onCheckedChange={(checked) => 
                setViewMode(checked ? 'prioritized' : 'chronological')
              }
            />
            <Label htmlFor="view-mode">
              {viewMode === 'prioritized' ? 'Admin Posts Prioritized' : 'Chronological View'}
            </Label>
          </div>
          {user?.isPaid && <CreatePostDialog />}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <p>{error}</p>
          <Button 
            onClick={() => fetchPosts()} 
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && sortedPosts.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-500 mb-6">Be the first to start a discussion!</p>
          {user?.isPaid ? (
            <CreatePostDialog />
          ) : (
            <Button variant="outline" asChild>
              <a href="/pricing">Upgrade to Join Discussions</a>
            </Button>
          )}
        </div>
      )}

      {/* Posts List */}
      {!isLoading && !error && sortedPosts.length > 0 && (
        <AnimatePresence>
          <div className="space-y-6">
            {sortedPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Post post={post} viewMode={viewMode} />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Load More Button (if needed for pagination) */}
      {!isLoading && !error && sortedPosts.length >= 10 && (
        <div className="mt-8 text-center">
          <Button variant="outline" className="mx-auto">
            Load More Posts
          </Button>
        </div>
      )}

      {!user?.isPaid && (
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <p className="text-yellow-800">
            Upgrade to premium to participate in discussions!
          </p>
          <Button className="mt-2" variant="outline" asChild>
            <a href="/pricing">Upgrade Now</a>
          </Button>
        </div>
      )}
    </div>
  );
}