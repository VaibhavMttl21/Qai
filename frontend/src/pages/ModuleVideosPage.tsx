import {  useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion , MotionProps } from 'framer-motion';
import { useVideoStore } from '@/store/video';
import { PlayCircle, FileText, CheckCircle } from 'lucide-react';

// Types
interface Module {
  id: string;
  name: string;
  description: string;
  imageUrl?: string; // Added image property
  videos?: Video[];
}

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  demo: boolean;
}

export function ModuleVideosPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { progress } = useVideoStore();
  
  const [module, setModule] = useState<Module | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { modules, loading, fetchModules  } = useVideoStore(state => ({
    modules: state.modules,
    loading: state.loading,
    fetchModules: state.fetchModules
  }));

  useEffect(() => {
    fetchModules();
  }
  , [fetchModules]);

  useEffect(() => {
    
      if (!moduleId)
        {
          console.log(`moduleId is undefined`);
          return;
        } 
      
      try {
        
        // Fetch all modules and filter for the current module
        // fetchModules();
        console.log('ModuleId:', moduleId);
        console.log('Fetched modules:', modules);
        // const modules = response;
        
        // Find the specific module by ID
        const currentModule = modules.find((mod) => mod.id === moduleId) as Module | undefined;
        console.log('Current module:', currentModule);
        if (currentModule) {
          setModule(currentModule);
          // Set videos from the module's videos array
          setVideos(currentModule.videos || []);
        } else {
          setError('Module not found');
        }
        // console.log('Videos:', videos);
        console.log("Video thumbnails:", videos.map(v => ({ id: v.id, thumbnail: v.thumbnail })));
        setError(null);
      } catch (err) {
        console.error('Error fetching module data:', err);
        setError('Failed to load module content. Please try again later.');
      } finally {
      }

  }, [modules , fetchModules]);

  const handleVideoClick = (videoId: string) => {
    navigate(`/video/${videoId}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: {
        duration: 0.3
      }
    }
  };


  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-red-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  
  const MotionDiv = motion.div as React.ComponentType<
React.HTMLAttributes<HTMLDivElement> & MotionProps & { 
  ref?: React.Ref<HTMLDivElement>; 
}
>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Module Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        {...{className :"mb-8 md:mb-12"}}
      >
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-purple-600 hover:text-purple-800 mb-4 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Modules
        </button>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">{module?.name}</h1>
        {module?.description && (
          <p className="text-gray-600 text-lg">{module.description}</p>
        )}
      </motion.div>
      
      {/* Videos Grid */}
      {videos.length === 0 ? (
        <div className="bg-purple-50 p-6 rounded-lg text-center">
          <h3 className="text-xl font-medium text-purple-700">No videos available</h3>
          <p className="text-purple-600 mt-2">This module doesn't have any videos yet.</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          {...{className :"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"}}
        >
          {videos.map(video => {
            const isCompleted = progress[video.id] === true;
            return (
              <MotionDiv
                key={video.id}
                variants={itemVariants}
                whileHover="hover"
                onClick={() => handleVideoClick(video.id)}
                className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer group relative"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-purple-100 overflow-hidden">
                  {video.thumbnail ? (
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-blue-500">
                      <FileText className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center  bg-opacity-0 group-hover:bg-opacity-30 transition-all">
                    <PlayCircle className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100" />
                  </div>
                  
                  
                  {/* Demo badge */}
                  {video.demo && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Demo
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {video.title}
                    </h3>
                    {isCompleted && (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                    )}
                  </div>
                  {video.description && (
                    <p className="mt-2 text-gray-600 text-sm line-clamp-2">{video.description}</p>
                  )}
                </div>
              </MotionDiv>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
