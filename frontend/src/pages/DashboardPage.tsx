import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { useVideoStore } from '@/store/video';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';


export function DashboardPage() {
  const { user } = useAuthStore();
  const { videos, progress } = useVideoStore();

  const completedVideos = Object.values(progress).filter(Boolean).length;
  const totalVideos = videos.length;
  const progressPercentage = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

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
    </div>
    
    </>
    
  );
}