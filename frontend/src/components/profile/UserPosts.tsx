import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCommunityStore } from '@/store/community';
import { Post } from '@/components/community/Post';

interface UserPostsProps {
  userId: string;
}

export function UserPosts({ userId }: UserPostsProps) {
  const { userPosts, fetchUserPosts } = useCommunityStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('text'); // Add state for active tab

  useEffect(() => {
    async function loadUserPosts() {
      setIsLoading(true);
      setError(null);
      try {
        await fetchUserPosts(userId);
      } catch (err) {
        setError('Failed to load user posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUserPosts();
  }, []);

  // Filter posts into text-only and image posts
  const textPosts = userPosts.filter(post => !post.imageUrl);
  const imagePosts = userPosts.filter(post => post.imageUrl);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">My Posts</h2>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && userPosts.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-500">You haven't created any posts yet.</p>
        </div>
      )}

      {/* Posts Display */}
      {!isLoading && !error && userPosts.length > 0 && (
        <div className="w-full">
          {/* Custom Tab List */}
          <div className="grid w-full grid-cols-2 mb-6 border-b">
            <button 
              onClick={() => setActiveTab('text')}
              className={`py-2 px-4 font-medium text-center transition-all ${
                activeTab === 'text' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Text Posts ({textPosts.length})
            </button>
            <button 
              onClick={() => setActiveTab('images')}
              className={`py-2 px-4 font-medium text-center transition-all ${
                activeTab === 'images' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Image Posts ({imagePosts.length})
            </button>
          </div>
          
          {/* Tab Content */}
          {activeTab === 'text' && (
            <div className="space-y-6">
              {textPosts.length > 0 ? (
                textPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Post post={post} viewMode="chronological" disableActions={true} />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No text posts yet.</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'images' && (
            <div className="space-y-6">
              {imagePosts.length > 0 ? (
                imagePosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Post post={post} viewMode="chronological" disableActions={true} />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No image posts yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
