import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { useVideoStore } from '@/store/video';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import Hls from 'hls.js'

export function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null);
  const [quality, setQuality] = useState<'480p' | '720p' | '1080p'>('720p');
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();

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
    if (videos.length > 0 && videoId) {
      const video = videos.find(v => v.id === videoId);
      if (video) {
        setCurrentVideo(video);
      }
    }
  }, [videos, videoId, setCurrentVideo]);
useEffect(() => {
    if (!currentVideo || !videoRef.current || !currentVideo.hlsUrls) return;

    // Dispose previous player if it exists
    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = null;
    }

    const token = localStorage.getItem('token');
    console.log('Token:', token);

    const rawUrl = currentVideo.hlsUrls[quality];
    const secureUrl = token ? `${rawUrl}?token=${token}` : rawUrl;
    console.log('Secure URL:', secureUrl);

    let hls = null;

    if (Hls.isSupported()) {
      // Initialize Hls.js and set up the Authorization header for requests
      hls = new Hls({
        xhrSetup: (xhr, url) => {
          // Set Authorization header with the token for each request
          if (token) {
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);
          }
        },
      });

      hls.loadSource(secureUrl); // Load the HLS URL
      hls.attachMedia(videoRef.current); // Attach to the video element

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current?.play(); // Play video once manifest is parsed
      });

      // Handle HLS error (e.g., if no compatible format found)
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS.js error:', data);
      });
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // For browsers that support native HLS
      videoRef.current.src = secureUrl;
      videoRef.current.play();
    }

    // Dispose of the HLS instance when the component unmounts
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [currentVideo, quality, updateProgress]);
  const handleVideoSelect = (video: typeof currentVideo) => {
    if (video) {
      navigate(`/video/${video.id}`);
    }
  };

  const navigateToNextVideo = () => {
    if (!currentVideo || videos.length === 0) return;
    
    const currentIndex = videos.findIndex(v => v.id === currentVideo.id);
    if (currentIndex < videos.length - 1) {
      const nextVideo = videos[currentIndex + 1];
      navigate(`/video/${nextVideo.id}`);
    }
  };

  const navigateToPrevVideo = () => {
    if (!currentVideo || videos.length === 0) return;
    
    const currentIndex = videos.findIndex(v => v.id === currentVideo.id);
    if (currentIndex > 0) {
      const prevVideo = videos[currentIndex - 1];
      navigate(`/video/${prevVideo.id}`);
    }
  };

  if (!currentVideo || !currentVideo.hlsUrls) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar - Video List */}
        <div className="lg:w-1/4 bg-white p-4 rounded-lg shadow-md">
          <h2 className="font-bold text-xl mb-4">Videos</h2>
          <div className="space-y-2 max-h-[50vh] overflow-y-auto">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoSelect(video)}
                className={`p-3 rounded-md cursor-pointer ${
                  currentVideo.id === video.id
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`h-2 w-2 rounded-full mr-2 ${
                      progress[video.id] 
                        ? 'bg-green-500' 
                        : currentVideo.id === video.id
                          ? 'bg-white'
                          : 'bg-gray-300'
                    }`}
                  />
                  <span>{video.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Video Player and Description */}
        <div className="lg:w-2/4 flex flex-col">
          {/* Video Player */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            {/* Quality Selector */}
            <div className="mb-4">
              <label className="mr-2 font-medium text-sm">Quality:</label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value as '480p' | '720p' | '1080p')}
                className="border rounded px-2 py-1 text-sm"
              >
                {Object.keys(currentVideo.hlsUrls).map((res) => (
                  <option key={res} value={res}>
                    {res}
                  </option>
                ))}
              </select>
            </div>

            {/* Video Player */}
            <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
              <video
                ref={videoRef}
                className="video-js vjs-default-skin w-full h-full"
                controls
              />
            </div>

            {/* PDF Resources Section with Navigation Buttons */}
            {currentVideo.pdfs && currentVideo.pdfs.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Resources</h3>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={navigateToPrevVideo}
                      disabled={videos.findIndex(v => v.id === currentVideo.id) === 0}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={navigateToNextVideo}
                      disabled={videos.findIndex(v => v.id === currentVideo.id) === videos.length - 1}
                    >
                      Next <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentVideo.pdfs.map((pdf) => (
                    <a
                      key={pdf.id}
                      href={pdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="mr-3 text-red-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-medium text-sm truncate">{pdf.title}</p>
                        {pdf.description && (
                          <p className="text-xs text-gray-600 truncate">{pdf.description}</p>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Video Description */}
        <div className="lg:w-1/4 bg-white p-4 rounded-lg shadow-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full"
          >
            <h2 className="text-xl font-bold mb-2">{currentVideo.title}</h2>
            <div className="h-1 w-24 bg-primary mb-4"></div>
            <p className="text-gray-600 whitespace-pre-line">{currentVideo.description}</p>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center text-sm">
                <div className={`h-3 w-3 rounded-full mr-2 ${progress[currentVideo.id] ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>
                  {progress[currentVideo.id] ? 'Completed' : 'Not completed'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
