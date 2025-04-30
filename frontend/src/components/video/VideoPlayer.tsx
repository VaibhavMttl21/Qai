import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { useVideoStore } from '@/store/video';
import { Button } from '@/components/ui/button';
import { motion , MotionProps } from 'framer-motion';
import { ChevronLeft, ChevronRight, FileText, CheckCircle, XCircle, PlayCircle } from 'lucide-react';
import Hls from 'hls.js';

type VideoQuality = 'high' | 'mid' | 'low';

export function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null);
  const [quality, setQuality] = useState<VideoQuality>('mid');
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();

  const {
    currentVideo,
    videos,
    progress,
    fetchVideos,
    setCurrentVideo,
    updateProgress,
    fetchProgress
  } = useVideoStore();

  useEffect(() => {
    fetchVideos();
    fetchProgress();
  }, [fetchVideos, fetchProgress]);

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

    // Since we're guaranteed to have all quality levels, we can access directly
    const rawUrl = currentVideo.hlsUrls[quality];
    const secureUrl = token ? `${rawUrl}?token=${token}` : rawUrl;

    let hls = null;

    if (Hls.isSupported()) {
      // Initialize Hls.js and set up the Authorization header for requests
      hls = new Hls({
        xhrSetup: (xhr,) => {
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
      hls.on(Hls.Events.ERROR, ( data) => {
        console.error('HLS.js error:', data);
      });
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {

      videoRef.current.src = secureUrl;
      videoRef.current.play();
    }

    // Add event listener to track when video ends
    const videoElement = videoRef.current;
    const handleVideoEnd = () => {
      // Update progress when video ends
      if (currentVideo && !progress[currentVideo.id]) {
        updateProgress(currentVideo.id, true);
      }
    };

    videoElement.addEventListener('ended', handleVideoEnd);

    // Dispose of the HLS instance when the component unmounts
    return () => {
      if (hls) {
        hls.destroy();
      }
      // Clean up event listener
      videoElement.removeEventListener('ended', handleVideoEnd);
    };
  }, [currentVideo, quality, updateProgress, progress]);

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

  // Toggle completion status manually
  const toggleCompletion = () => {
    if (currentVideo) {
      updateProgress(currentVideo.id, !progress[currentVideo.id]);
    }
  };

  if (!currentVideo || !currentVideo.hlsUrls) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const MotionDiv = motion.div as React.ComponentType<
  React.HTMLAttributes<HTMLDivElement> & MotionProps & { 
    ref?: React.Ref<HTMLDivElement>; 
  }
  >;

  const MotionAnchor = motion.a as React.ComponentType<
  React.AnchorHTMLAttributes<HTMLAnchorElement> & MotionProps & {
    ref?: React.Ref<HTMLAnchorElement>; 
  }
  >;

  return (
    <div className="container-fluid mx-auto py-4 h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white px-4 sm:px-6">
      <div className="flex flex-col lg:flex-row h-full gap-4 font-satoshi">
        {/* Video Player - Now on the left side and larger */}
        <div className="lg:w-3/5 flex flex-col h-full">
          <motion.div 
            {...{className:"bg-white p-4 rounded-xl shadow-lg flex flex-col h-full border border-indigo-100"}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Quality Selector and Progress Toggle */}
            <div className="mb-4 flex justify-between items-center">
              <div>
                <label className="mr-2 font-medium text-sm text-gray-700">Quality:</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as VideoQuality)}
                  className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                >
                  {currentVideo.hlsUrls && Object.keys(currentVideo.hlsUrls).map((qualityKey) => (
                    <option key={qualityKey} value={qualityKey}>
                      {qualityKey}
                    </option>
                  ))}
                </select>
              </div>

              {/* Manual progress toggle */}
              <Button
                size="sm"
                variant={progress[currentVideo.id] ? "outline" : "default"}
                onClick={toggleCompletion}
                className={`flex items-center gap-1 ${
                  progress[currentVideo.id] 
                    ? "border-purple-400 text-purple-600 hover:bg-purple-50" 
                    : "bg-gradient-to-br from-purple-400 from-40% to-indigo-400 text-white hover:from-purple-500 hover:to-indigo-500"
                }`}
              >
                {progress[currentVideo.id] ? (
                  <>
                    <XCircle className="h-4 w-4" />
                    Mark as incomplete
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Mark as complete
                  </>
                )}
              </Button>
            </div>

            {/* Video Player - Larger with flexible height */}
            <div className="relative w-full flex-grow rounded-lg overflow-hidden" style={{ minHeight: "70vh" }}>
              <video
                ref={videoRef}
                className="video-js vjs-default-skin w-full h-full"
                controls
                loop={false}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={navigateToPrevVideo}
                    disabled={videos.findIndex(v => v.id === currentVideo.id) === 0}
                    className="border-purple-300 text-purple-600 hover:bg-purple-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={navigateToNextVideo}
                    disabled={videos.findIndex(v => v.id === currentVideo.id) === videos.length - 1}
                    className="border-purple-300 text-purple-600 hover:bg-purple-50 disabled:opacity-50"
                  >
                    Next <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* PDF Resources Section */}
            {currentVideo.pdfs && currentVideo.pdfs.length > 0 && (
              <div className="mt-4 border-t border-indigo-100 pt-4">
                <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Resources</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentVideo.pdfs.map((pdf) => (
                    <MotionAnchor
                      key={pdf.id}
                      href={pdf.url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-colors"
                      whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    >
                      <div className="mr-3 text-purple-500">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-medium text-sm truncate text-gray-800">{pdf.title}</p>
                        {pdf.description && (
                          <p className="text-xs text-gray-600 truncate">{pdf.description}</p>
                        )}
                      </div>
                    </MotionAnchor>
                  ))} 
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Panel - Description and Video List */}
        <div className="lg:w-2/5 flex flex-col h-full">
          {/* Video Description */}
          <motion.div 
            {...{className:"bg-white p-4 rounded-xl shadow-lg mb-4 border border-indigo-100"}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <motion.div>
              <h2 className="text-xl font-bold mb-2 text-gray-800">{currentVideo.title}</h2>
              <div className="h-1 w-24 bg-gradient-to-r from-purple-400 to-indigo-400 mb-4 rounded-full"></div>
              <p className="text-gray-600 whitespace-pre-line">{currentVideo.description}</p>

              <div className="mt-4 pt-4 border-t border-indigo-100">
                <div className="flex items-center text-sm">
                  <div className={`h-3 w-3 rounded-full mr-2 ${
                    progress[currentVideo.id] ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className={progress[currentVideo.id] ? 'text-green-700' : 'text-gray-600'}>
                    {progress[currentVideo.id] ? 'Completed' : 'Not completed'}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Video List - Moved from left sidebar to right panel */}
          <motion.div 
            {...{className:"bg-white p-4 rounded-xl shadow-lg flex-grow overflow-hidden border border-indigo-100"}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h2 className="font-bold text-xl mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">All Videos</h2>
            <div className="space-y-2 overflow-y-auto pr-2" style={{ maxHeight: "calc(100% - 2rem)" }}>
              {videos.map((video) => (
                <MotionDiv
                  key={video.id}
                  onClick={() => handleVideoSelect(video)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 rounded-md cursor-pointer transition-all duration-200 ${
                    currentVideo.id === video.id
                      ? 'bg-gradient-to-br from-purple-400 from-40% to-indigo-400 text-white shadow-md'
                      : 'hover:bg-indigo-50 border border-indigo-100'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white flex-shrink-0 bg-gradient-to-br from-purple-400 to-indigo-400">
                      <PlayCircle size={16} className="ml-0.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{video.title}</span>
                      <div className="flex items-center text-xs mt-1">
                        <div
                          className={`h-2 w-2 rounded-full mr-2 ${
                            progress[video.id]
                              ? 'bg-green-500'
                              : currentVideo.id === video.id
                                ? 'bg-white'
                                : 'bg-gray-300'
                          }`}
                        />
                        <span className={
                          currentVideo.id === video.id 
                            ? 'text-white' 
                            : progress[video.id]
                              ? 'text-green-700'
                              : 'text-gray-500'
                        }>
                          {progress[video.id] ? 'Completed' : 'Not completed'}
                        </span>
                      </div>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}