import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play } from 'lucide-react';
import { useVideoStore } from '@/store/video';

export function ModulePage() {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Get data and actions from store
  const { modules, loading, fetchModules } = useVideoStore(state => ({
    modules: state.modules,
    loading: state.loading,
    fetchModules: state.fetchModules
  }));

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const handleVideoClick = (videoId: string) => {
    navigate(`/video/${videoId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const MotionDiv = motion.div as React.ComponentType<
  React.HTMLAttributes<HTMLDivElement> & { 
    ref?: React.Ref<HTMLDivElement>; 
    whileHover?: object; 
    whileTap?: object; 
  }
>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white py-12 px-4 sm:px-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Course Modules
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <motion.div 
              key={module.id}
              {...{className : "bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100 flex flex-col"}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div 
                className="p-5 cursor-pointer"
                onClick={() => toggleModule(module.id)}
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold text-gray-800">{module.name}</h2>
                  
                  <motion.div 
                    {...{className :"w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center"}}
                    animate={{ rotate: expandedModule === module.id ? 180 : 0 }}
                  >
                    <ChevronDown size={18} className="text-indigo-600" />
                  </motion.div>
                </div>
                
                {/* Image below title */}
                {module.imageUrl && (
                  <div className="mt-3 mb-4">
                    <img 
                      src={module.imageUrl} 
                      alt={module.name} 
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs font-medium text-indigo-500">
                    {(module.videos ?? []).length} {(module.videos ?? []).length === 1 ? 'video' : 'videos'}
                  </span>
                  <span className="text-xs text-gray-400">Click to {expandedModule === module.id ? 'hide' : 'show'} videos</span>
                </div>
              </div>
              
              <AnimatePresence>
                {expandedModule === module.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ backgroundColor: '#EEF2FF', padding: '1.25rem' }}
                  >
                    {/* Description moved to dropdown */}
                    <p className="text-gray-600 text-sm mb-4 px-4">{module.description || "Learn more about this exciting module."}</p>
                    
                    <motion.div 
                      style={{ padding: '1rem', gap: '0.75rem', display: 'flex', flexDirection: 'column' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {(module.videos ?? []).sort((a, b) => a.order - b.order).map((video) => (
                        <MotionDiv
                          key={video.id}
                          {...{className:"bg-white p-3 rounded-lg border border-indigo-100 cursor-pointer hover:border-indigo-300 transition-colors"}}
                          onClick={() => handleVideoClick(video.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center mr-3 text-white flex-shrink-0">
                              <Play size={14} className="ml-0.5" />
                            </div>
                            <span className="font-medium text-gray-800 text-sm">{video.title}</span>
                          </div>
                        </MotionDiv>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
        {modules.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow mt-8">
            <h3 className="text-xl font-medium text-gray-600">No modules available yet</h3>
            <p className="text-gray-500 mt-2">Check back soon for new content</p>
          </div>
        )}
      </div>
    </div>
  );
}