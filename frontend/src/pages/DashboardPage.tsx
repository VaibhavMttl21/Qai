

import { useAuthStore } from '@/store/auth';
import { useVideoStore } from '@/store/video';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDashboardStore } from '@/store/dashboard';
import { motion } from 'framer-motion';
import NeuFollowButton from '@/components/Dashboard/ButttonCom';
import NeuFollowButton2 from '@/components/Dashboard/Button';

export function DashboardPage() {
  const { user } = useAuthStore();
  const { videos, progress } = useVideoStore();
  const { news, isLoading, error, fetchNews } = useDashboardStore();

  const completedVideos = Object.values(progress).filter(Boolean).length;
  const totalVideos = videos.length;
  const progressPercentage = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

  // Typing animation logic
  const fullText = `lcome back, ${user?.name || ''}!`;
  const [typedText, setTypedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTypedText(fullText.slice(0, index));
      setIndex((prev) => (prev >= fullText.length ? 0 : prev + 1));
    }, 100);
    return () => clearTimeout(timeout);
  }, [index, fullText]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return (
    <div className="max-w-screen mx-auto"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='%23d4d4d4'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
    }}
    >
      {/* Welcome & Progress Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <motion.h1
          className="text-2xl font-bold mb-4 pt-6 pl-6 min-h-[48px] w-fit md:min-w-[300px] whitespace-nowrap "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-neutral-700">We</span>
          <span className="text-neutral-700">{typedText}</span>
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-6">
          <motion.div
            className="relative p-[2px] rounded-lg group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute -inset-[2px] rounded-lg bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm animate-shimmer" />
            <div className="relative bg-gradient-to-br from-purple-200 from-40% to-indigo-200 p-6 rounded-lg z-10">
              <h3 className="text-lg font-semibold mb-2">Course Progress</h3>
              <p className="text-3xl font-bold text-blue-600">
                {progressPercentage.toFixed(0)}%
              </p>
              <p className="text-sm text-gray-600">
                {completedVideos} of {totalVideos} videos completed
              </p>
            </div>
          </motion.div>

          {!user?.isPaid && (
            <motion.div
              className="p-6 rounded-lg bg-yellow-50 hover:shadow-lg transition duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-2">Upgrade to Premium</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get access to all videos and community features
              </p>
              <Button asChild>
                <Link to="/pricing">Upgrade Now</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Learning & Community Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-xl font-bold font-Satoshi mb-4 pl-6 text-neutral-700">Continue Learning</h2>
          <Link to="/videos">
            <NeuFollowButton2 />
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-xl font-Satoshi font-bold mb-4 pl-6 text-neutral-700">Community</h2>
          <Link to="/community">
            <NeuFollowButton />
          </Link>
        </motion.div>
      </div>

      {/* AI News Section */}
      <motion.div
        className="mt-10 pr-6 pl-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-Satoshi font-bold mb-4 text-neutral-700">Latest AI News</h2>

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
              className=" p-4 rounded-lg shadow-sm transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-purple-200 via-pink-50 to-indigo-100 "
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.05 * index }}
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
                  <h3 className="font-bold font-Satoshi">{article.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{article.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-Satoshi">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-500 text-sm hover:text-purple-700"
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
  );
}
