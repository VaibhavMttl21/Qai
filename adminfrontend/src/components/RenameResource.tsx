import { useState, useEffect, ChangeEvent } from 'react';
import api from '../lib/api';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

// Define interfaces for our data types
interface PDF {
  id: string;
  title: string;
  description?: string;
  url: string;
  videoId: string;
}

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  order: number;
  moduleId: string;
  thumbnail?: string; // Add thumbnail property
}

interface Module {
  id: string;
  name: string;
  description?: string;
  order?: number;
}

export function RenameResource() {
  // Active tab state
  const [activeTab, setActiveTab] = useState<'pdfs' | 'videos' | 'modules'>('pdfs');
  
  // Data states
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  
  // UI states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Rename modal states
  const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);
  const [resourceToRename, setResourceToRename] = useState<{
    id: string;
    type: 'pdf' | 'video' | 'module';
    currentName: string;
    description?: string;
    thumbnail?: string; // Add thumbnail to the state
  } | null>(null);
  const [newName, setNewName] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null); // Add state for thumbnail file

  // Preview for selected thumbnail
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  
  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 'pdfs') fetchPdfs();
    else if (activeTab === 'videos') fetchVideos();
    else fetchModules();
  }, [activeTab]);
  
  // Fetch functions
  const fetchPdfs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<PDF[]>('/api/admin/pdfs');
      setPdfs(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch PDFs');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Video[]>('/api/admin/videos/');
      setVideos(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchModules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Module[]>('/api/admin/modules');
      setModules(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch modules');
    } finally {
      setLoading(false);
    }
  };
  
  // Open rename modal
  const openRenameModal = (
    id: string, 
    type: 'pdf' | 'video' | 'module', 
    currentName: string, 
    description?: string,
    thumbnail?: string
  ) => {
    setResourceToRename({ id, type, currentName, description, thumbnail });
    setNewName(currentName);
    setNewDescription(description || '');
    setThumbnailFile(null);
    setThumbnailPreview(thumbnail || null);
    setIsRenameModalOpen(true);
  };
  
  // Close rename modal
  const closeRenameModal = () => {
    setIsRenameModalOpen(false);
    setResourceToRename(null);
    setNewName('');
    setNewDescription('');
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  // Handle thumbnail selection
  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
      
      // Clean up the preview URL when component unmounts
      return () => URL.revokeObjectURL(previewUrl);
    }
  };
  
  // Handle rename submit
  const handleRenameSubmit = async () => {
    if (!resourceToRename) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Different API call based on resource type
      if (resourceToRename.type === 'pdf') {
        await api.put(`/api/admin/pdfs/${resourceToRename.id}`, {
          title: newName,
          description: newDescription || undefined
        });
        
        // Update local state
        setPdfs(pdfs.map(pdf => 
          pdf.id === resourceToRename.id 
            ? { ...pdf, title: newName, description: newDescription } 
            : pdf
        ));
      } else if (resourceToRename.type === 'video') {
        // Use FormData for video updates when we have a thumbnail file
        if (thumbnailFile) {
          const formData = new FormData();
          formData.append('title', newName);
          formData.append('description', newDescription || '');
          formData.append('thumbnail', thumbnailFile);
          
          interface VideoUpdateResponse {
            thumbnail: string;
            [key: string]: any; // for any other properties in the response
          }
          
          const response = await api.put<VideoUpdateResponse>(`/api/admin/videos/${resourceToRename.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          
          // Update local state with new thumbnail URL from response
          setVideos(videos.map(video => 
            video.id === resourceToRename.id 
              ? { 
                  ...video, 
                  title: newName, 
                  description: newDescription,
                  thumbnail: response.data.thumbnail
                } 
              : video
          ));
        } else {
          // Regular update without thumbnail
          await api.put(`/api/admin/videos/${resourceToRename.id}`, {
            title: newName,
            description: newDescription || undefined
          });
          
          // Update local state
          setVideos(videos.map(video => 
            video.id === resourceToRename.id 
              ? { ...video, title: newName, description: newDescription } 
              : video
          ));
        }
      } else if (resourceToRename.type === 'module') {
        await api.put(`/api/admin/module/${resourceToRename.id}`, {
          name: newName,
          description: newDescription || undefined
        });
        
        // Update local state
        setModules(modules.map(module => 
          module.id === resourceToRename.id 
            ? { ...module, name: newName, description: newDescription } 
            : module
        ));
      }
      
      setSuccess(`${resourceToRename.type.charAt(0).toUpperCase() + resourceToRename.type.slice(1)} updated successfully`);
      closeRenameModal();
    } catch (err) {
      console.error(err);
      setError(`Failed to update ${resourceToRename.type}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Clear messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);
  
  // Rename modal JSX
  const renderRenameModal = () => {
    if (!isRenameModalOpen || !resourceToRename) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h3 className="text-lg font-bold mb-4">
            {resourceToRename.type === 'module' ? 'Edit Module' : 
             resourceToRename.type === 'video' ? 'Edit Video' : 'Edit PDF'}
          </h3>
          <div className="space-y-4">
            <Input
              label="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>
            
            {/* Thumbnail upload - only for videos */}
            {resourceToRename.type === 'video' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail Image
                </label>
                
                {/* Show current or new thumbnail preview */}
                {thumbnailPreview && (
                  <div className="mb-2">
                    <img 
                      src={thumbnailPreview} 
                      alt="Thumbnail preview" 
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Select an image to update the thumbnail. Leave empty to keep the current one.
                </p>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                onClick={closeRenameModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRenameSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                isLoading={loading}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Resources</h1>
      
      {/* Success and error messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}
      
      {/* Tabs navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('pdfs')}
            className={`${
              activeTab === 'pdfs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            PDFs
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`${
              activeTab === 'videos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Videos
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`${
              activeTab === 'modules'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Modules
          </button>
        </nav>
      </div>
      
      {/* Render the rename modal */}
      {renderRenameModal()}
      
      {/* Content based on active tab */}
      <div className="bg-white shadow rounded-lg p-6">
        {loading && !isRenameModalOpen ? (
          <p className="text-center py-4">Loading...</p>
        ) : activeTab === 'pdfs' ? (
          <PDFsList pdfs={pdfs} onRename={openRenameModal} />
        ) : activeTab === 'videos' ? (
          <VideosList videos={videos} modules={modules} onRename={openRenameModal} />
        ) : (
          <ModulesList modules={modules} onRename={openRenameModal} />
        )}
      </div>
    </div>
  );
}

// PDF List component
function PDFsList({ pdfs, onRename }: { 
  pdfs: PDF[], 
  onRename: (id: string, type: 'pdf', currentName: string, description?: string) => void 
}) {
  if (pdfs.length === 0) {
    return <p className="text-center py-4 text-gray-500">No PDFs found.</p>;
  }
  
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">PDFs List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pdfs.map((pdf) => (
              <tr key={pdf.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pdf.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pdf.description || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => onRename(pdf.id, 'pdf', pdf.title, pdf.description)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Rename
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Video List component
function VideosList({ videos, modules, onRename }: { 
  videos: Video[], 
  modules: Module[], 
  onRename: (id: string, type: 'video', currentName: string, description?: string, thumbnail?: string) => void 
}) {
  if (videos.length === 0) {
    return <p className="text-center py-4 text-gray-500">No videos found.</p>;
  }
  
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Videos List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {videos.map((video) => (
              <tr key={video.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {video.thumbnail ? (
                    <img 
                      src={video.thumbnail} 
                      alt={`Thumbnail for ${video.title}`} 
                      className="h-12 w-20 object-cover rounded"
                    />
                  ) : (
                    <div className="h-12 w-20 bg-gray-200 flex items-center justify-center rounded">
                      <span className="text-xs text-gray-500">No image</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{video.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{video.order}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {modules.find(m => m.id === video.moduleId)?.name ?? 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => onRename(video.id, 'video', video.title, video.description, video.thumbnail)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Module List component
function ModulesList({ modules, onRename }: { 
  modules: Module[], 
  onRename: (id: string, type: 'module', currentName: string, description?: string) => void 
}) {
  if (modules.length === 0) {
    return <p className="text-center py-4 text-gray-500">No modules found.</p>;
  }
  
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Modules List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {modules.map((module) => (
              <tr key={module.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{module.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{module.description || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{module.order || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => onRename(module.id, 'module', module.name, module.description)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Rename
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
