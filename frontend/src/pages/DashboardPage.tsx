import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { useVideoStore } from '@/store/video';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboard';


export function DashboardPage() {
  const { user } = useAuthStore();
  const { videos, progress } = useVideoStore();
  const { news, isLoading, error, fetchNews } = useDashboardStore();

  const completedVideos = Object.values(progress).filter(Boolean).length;
  const totalVideos = videos.length;
  const progressPercentage = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return (
    <>
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-4">Welcome back, {user?.name}!</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Course Progress</h3>
            <p className="text-3xl font-bold text-blue-600">{progressPercentage.toFixed(0)}%</p>
            <p className="text-sm text-gray-600">
              {completedVideos} of {totalVideos} videos completed
            </p>
          </div>
          {!user?.isPaid && (
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Upgrade to Premium</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get access to all videos and community features
              </p>
              <Button asChild>
                <Link to="/pricing">Upgrade Now</Link>
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
          <Button asChild className="w-full">
            <Link to="/videos">Go to Videos</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-xl font-semibold mb-4">Community</h2>
          <Button asChild className="w-full">
            <Link to="/community">Join Discussion</Link>
          </Button>
        </motion.div>
      </div>

      <motion.div 
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-4">Latest AI News</h2>
        
        {isLoading && <p className="text-gray-500">Loading latest news...</p>}
        
        {error && (
          <div className="bg-red-50 p-4 rounded-lg text-red-600">
            Error loading news: {error}
          </div>
        )}
        
        {!isLoading && !error && news.length === 0 && (
          <p className="text-gray-500">No news articles found.</p>
        )}
        
        <div className="space-y-4">
          {news.map((article, index) => (
            <motion.div 
              key={index}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="flex flex-col md:flex-row gap-4">
                {article.image && (
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full md:w-32 h-20 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{article.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{article.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Read more
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
    
    </>
    
  );
}