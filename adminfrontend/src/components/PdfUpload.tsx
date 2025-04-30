import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface Video {
  id: string;
  title: string;
  order: number;
}

export function PdfUpload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [videoId, setVideoId] = useState<string>('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Fetch videos for the dropdown
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get<Video[]>('/api/admin/videos/');
        setVideos(response.data);
      } catch (err) {
        console.error('Failed to fetch videos:', err);
        setError('Failed to load videos');
      }
    };
    
    fetchVideos();
  }, []);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      setError('Title is required');
      return;
    }
    
    if (!file) {
      setError('Please select a PDF file');
      return;
    }
    
    if (!videoId) {
      setError('Please select a video');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('videoId', videoId);
    
    try {
      await api.post('/api/admin/pdfs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSuccess('PDF uploaded successfully!');
      setTitle('');
      setDescription('');
      setFile(null);
      setVideoId('');
      
      // Reset file input
      const fileInput = document.getElementById('pdf-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload PDF');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload PDF Resource</h2>
      
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
        <Input
          label="PDF Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter PDF title"
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PDF Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter PDF description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          ></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Video
          </label>
          <select
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">-- Select a video --</option>
            {videos.map((video) => (
              <option key={video.id} value={video.id}>
                {video.order}. {video.title}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PDF File
          </label>
          <input
            id="pdf-file"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
          {file && (
            <p className="mt-1 text-sm text-gray-500">
              Selected file: {file.name}
            </p>
          )}
        </div>
        
        <Button
          type="submit"
          isLoading={loading}
        >
          Upload PDF
        </Button>
      </form>
    </div>
  );
}
