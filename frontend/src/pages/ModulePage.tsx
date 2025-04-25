import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  order: number;
}

interface Module {
  id: string;
  name: string;
  description: string;
  videos: Video[];
}

export function ModulePage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await api.get('/api/modules');
        setModules(response.data);
        // Expand the first module by default
        if (response.data.length > 0) {
          setExpandedModule(response.data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch modules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const handleVideoClick = (videoId: string) => {
    navigate(`/video/${videoId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='%23d4d4d4'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
      }}>
      <h1 className="text-3xl font-bold text-center mb-8">Course Modules</h1>
      
      <div className="max-w-4xl mx-auto space-y-6">
        {modules.map((module) => (
          <motion.div 
            key={module.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className={`p-4 flex justify-between items-center cursor-pointer ${
                expandedModule === module.id ? 'bg-primary text-white' : 'bg-gray-50'
              }`}
              onClick={() => toggleModule(module.id)}
            >
              <div>
                <h2 className="text-xl font-semibold">{module.name}</h2>
              </div>
              {expandedModule === module.id ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </div>
            
            <AnimatePresence>
              {expandedModule === module.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4">
                    <p className="text-gray-600 mb-4">{module.description}</p>
                    
                    <h3 className="font-medium mb-2">Videos:</h3>
                    <div className="space-y-2">
                      {module.videos.sort((a, b) => a.order - b.order).map((video) => (
                        <motion.div
                          key={video.id}
                          className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleVideoClick(video.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center">
                            <span className="mr-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                              {video.order}
                            </span>
                            <span className="font-medium">{video.title}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
