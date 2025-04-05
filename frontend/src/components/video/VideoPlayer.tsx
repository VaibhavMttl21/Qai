import { useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useVideoStore } from '@/store/video';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function VideoPlayer() {
  const { currentVideo, videos, progress, fetchVideos, setCurrentVideo, updateProgress } = useVideoStore();

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleVideoEnd = () => {
    if (currentVideo) {
      updateProgress(currentVideo.id, true);
    }
  };

  const handleVideoSelect = (video: typeof currentVideo) => {
    if (video) {
      setCurrentVideo(video);
    }
  };

  if (!currentVideo) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="aspect-w-16 aspect-h-9 mb-8">
        <ReactPlayer
          url={currentVideo.url}
          width="100%"
          height="100%"
          controls
          onEnded={handleVideoEnd}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold mb-2">{currentVideo.title}</h2>
        <p className="text-gray-600">{currentVideo.description}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <motion.div
            key={video.id}
            whileHover={{ scale: 1.02 }}
            {...{
              className: `p-4 rounded-lg border ${
                currentVideo.id === video.id ? 'border-primary' : 'border-gray-200'
              }`,
            }}
          >
            <Button
              variant="ghost"
              className="w-full text-left"
              onClick={() => handleVideoSelect(video)}
            >
              <div>
                <h3 className="font-medium">{video.title}</h3>
                <div className="flex items-center mt-2">
                  <div
                    className={`h-2 w-2 rounded-full mr-2 ${
                      progress[video.id] ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                  <span className="text-sm text-gray-500">
                    {progress[video.id] ? 'Completed' : 'Not completed'}
                  </span>
                </div>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}