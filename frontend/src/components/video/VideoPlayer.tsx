import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { useVideoStore } from '@/store/video';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null);
  const [quality, setQuality] = useState<'480p' | '720p' | '1080p'>('720p');

  const {
    currentVideo,
    videos,
    progress,
    fetchVideos,
    setCurrentVideo,
    updateProgress,
  } = useVideoStore();

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  useEffect(() => {
    if (!currentVideo || !videoRef.current || !currentVideo.hlsUrls) return;

    const token = localStorage.getItem('token');
    const rawUrl = currentVideo.hlsUrls[quality];
    const secureUrl = token ? `${rawUrl}?token=${token}` : rawUrl;

    // Dispose previous player if it exists
    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = null;
    }

    const player = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      preload: 'auto',
      responsive: true,
      fluid: true,
      sources: [{ src: secureUrl, type: 'application/x-mpegURL' }],
    });

    player.on('ended', () => {
      updateProgress(currentVideo.id, true);
    });

    playerRef.current = player;

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [currentVideo, quality,updateProgress]);

  const handleVideoSelect = (video: typeof currentVideo) => {
    if (video) {
      setCurrentVideo(video);
      setQuality('720p');
    }
  };

  if (!currentVideo || !currentVideo.hlsUrls) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <label className="mr-2 font-semibold">Quality:</label>
        <select
          value={quality}
          onChange={(e) =>
            setQuality(e.target.value as '480p' | '720p' | '1080p')
          }
          className="border rounded px-2 py-1"
        >
          {Object.keys(currentVideo.hlsUrls).map((res) => (
            <option key={res} value={res}>
              {res}
            </option>
          ))}
        </select>
      </div>

      <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
        <video
          ref={videoRef}
          className="video-js vjs-default-skin w-full h-full"
          controls
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
      >
        <h2 className="text-2xl font-bold mb-2">{currentVideo.title}</h2>
        <p className="text-gray-600">{currentVideo.description}</p>
      </motion.div>

      {/* PDF resources section */}
      {currentVideo.pdfs && currentVideo.pdfs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Resources</h3>
          <div className="space-y-2">
            {currentVideo.pdfs.map((pdf) => (
              <a
                key={pdf.id}
                href={pdf.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="mr-3 text-red-600">
                  {/* PDF icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">{pdf.title}</p>
                  {pdf.description && (
                    <p className="text-sm text-gray-600">{pdf.description}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {videos.map((video) => (
          <motion.div
            key={video.id}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-lg border ${
              currentVideo.id === video.id
                ? 'border-primary'
                : 'border-gray-200'
            }`}
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
