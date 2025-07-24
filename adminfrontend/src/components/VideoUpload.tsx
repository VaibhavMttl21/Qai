import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface Module {
  id: string;
  name: string;
}

export function VideoUpload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  
  // Module state
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [loadingModules, setLoadingModules] = useState(false);

  // Fetch modules on component mount
  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      setLoadingModules(true);
      const response = await api.get<Module[]>('/api/admin/modules');
      setModules(response.data);
      setLoadingModules(false);
    } catch (error) {
      console.error('Failed to fetch modules:\n', error);
      setError('Failed to fetch modules');
      setLoadingModules(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !file) {
      setError('Title and video file are required');
      return;
    }

    if (!selectedModuleId) {
      setError('Please select a module');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('order', order.toString());
      formData.append('video', file);
      formData.append('moduleId', selectedModuleId);
      formData.append('demo', isDemo.toString());
      
      if (imageFile) {
        formData.append('thumbnail', imageFile);
      }

      await api.post('/api/admin/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Video added successfully!');
      setTitle('');
      setDescription('');
      setOrder(0);
      setFile(null);
      setImageFile(null);
      setIsDemo(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Video</h2>

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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Module selection section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Module
          </label>
          
          {loadingModules ? (
            <div className="text-sm text-gray-500">Loading modules...</div>
          ) : (
            <select
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">-- Select a module --</option>
              {modules.map(module => (
                <option key={module.id} value={module.id}>
                  {module.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <Input
          label="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter video title"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter video description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono"
            rows={4}
          />
        </div>

        <Input
          label="Display Order"
          type="number"
          min="0"
          value={order.toString()}
          onChange={(e) => setOrder(parseInt(e.target.value))}
          placeholder="0"
          required
        />

        <div className="flex items-center">
          <input
            id="demo-checkbox"
            type="checkbox"
            checked={isDemo}
            onChange={(e) => setIsDemo(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="demo-checkbox" className="ml-2 block text-sm text-gray-900">
            Demo Video (available without subscription)
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Video File
          </label>
          <input
            id="video-file"
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {file && (
            <p className="mt-1 text-sm text-gray-500">
              Selected file: {file.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Thumbnail Image (optional)
          </label>
          <input
            id="image-file"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {imageFile && (
            <p className="mt-1 text-sm text-gray-500">
              Selected image: {imageFile.name}
            </p>
          )}
        </div>

        <Button type="submit" isLoading={loading}>
          Add Video
        </Button>
      </form>
    </div>
  );
}