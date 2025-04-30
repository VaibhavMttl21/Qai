import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Button } from './ui/Button';

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
}

interface Module {
  id: string;
  name: string;
  description?: string;
  order?: number;
}

export function DeleteResources() {
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
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [resourceType, setResourceType] = useState<string | null>(null);
  
  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 'pdfs') fetchPdfs();
    else fetchModules();
    if (activeTab === 'videos') {fetchVideos();}
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
  
  // Delete functions
  const deletePdf = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/api/admin/pdfs/${id}`);
      setPdfs(pdfs.filter(pdf => pdf.id !== id));
      setSuccess('PDF deleted successfully');
    } catch (err) {
      console.error(err);
      setError('Failed to delete PDF');
    } finally {
      setLoading(false);
      setConfirmDelete(null);
      setResourceType(null);
    }
  };
  
  const deleteVideo = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/api/admin/videos/${id}`);
      setVideos(videos.filter(video => video.id !== id));
      setSuccess('Video deleted successfully');
    } catch (err) {
      console.error(err);
      setError('Failed to delete video');
    } finally {
      setLoading(false);
      setConfirmDelete(null);
      setResourceType(null);
    }
  };
  
  const deleteModule = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/api/admin/module/${id}`);
      setModules(modules.filter(module => module.id !== id));
      setSuccess('Module deleted successfully');
    } catch (err) {
      console.error(err);
      setError('Failed to delete module');
    } finally {
      setLoading(false);
      setConfirmDelete(null);
      setResourceType(null);
    }
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = (id: string, type: 'pdf' | 'video' | 'module') => {
    setConfirmDelete(id);
    setResourceType(type);
  };
  
  // Execute delete based on type
  const executeDelete = () => {
    if (!confirmDelete || !resourceType) return;
    
    if (resourceType === 'pdf') {
      deletePdf(confirmDelete);
    } else if (resourceType === 'video') {
      deleteVideo(confirmDelete);
    } else if (resourceType === 'module') {
      deleteModule(confirmDelete);
    }
  };
  
  // Cancel delete
  const cancelDelete = () => {
    setConfirmDelete(null);
    setResourceType(null);
  };
  
  // Clear messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Delete Resources</h1>
      
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
      
      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            {resourceType === 'pdf' && (
              <p className="mb-6">
              Are you sure you want to delete this PDF? <br />
              This action cannot be undone.
              </p>
            )}
            {resourceType === 'video' && (
              <p className="mb-6">
              Are you sure you want to delete this video?<br /> 
              <strong>Deleting a video might also delete its associated PDFs.</strong><br />
              This action cannot be undone.
              </p>
            )}
            {resourceType === 'module' && (
              <p className="mb-6 text-red-700">
              Are you sure you want to delete this module?<br />
              This action cannot be undone. <br /> <br />
              <strong>Note: Module with associated videos or resources cannot be deleted.</strong>
              </p>
            )}
            <div className="flex justify-end space-x-3">
              <Button
                onClick={cancelDelete}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={executeDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
                isLoading={loading}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Content based on active tab */}
      <div className="bg-white shadow rounded-lg p-6">
        {loading && !confirmDelete ? (
          <p className="text-center py-4">Loading...</p>
        ) : activeTab === 'pdfs' ? (
          <PDFsList pdfs={pdfs} onDelete={handleDeleteConfirm} />
        ) : activeTab === 'videos' ? (
          <VideosList videos={videos} modules = {modules} onDelete={handleDeleteConfirm} />
        ) : (
          <ModulesList modules={modules} onDelete={handleDeleteConfirm} />
        )}
      </div>
    </div>
  );
}

// PDF List component
function PDFsList({ pdfs, onDelete }: { pdfs: PDF[], onDelete: (id: string, type: 'pdf') => void }) {
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
                    onClick={() => onDelete(pdf.id, 'pdf')}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
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
function VideosList({ videos,modules,onDelete }: { videos: Video[],modules: Module[] ,onDelete: (id: string, type: 'video') => void }) {
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {videos.map((video) => (
              <tr key={video.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{video.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{video.order}</td>
                {/* display module name */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{modules.find(m => m.id === video.moduleId)?.name ?? 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => onDelete(video.id, 'video')}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
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
function ModulesList({ modules, onDelete }: { modules: Module[], onDelete: (id: string, type: 'module') => void }) {
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
                    onClick={() => onDelete(module.id, 'module')}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
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
