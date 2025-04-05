import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommunityStore } from '@/store/community';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { CreatePostDialog } from './CreatePostDialog';
import { Post } from './Post';

export function CommunityFeed() {
  const { posts, fetchPosts } = useCommunityStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Community Discussion</h2>
        {user?.isPaid && <CreatePostDialog />}
      </div>

      <AnimatePresence>
        <div className="space-y-6">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Post post={post} />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

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