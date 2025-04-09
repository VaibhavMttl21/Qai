import { useState } from 'react';
import api from '../lib/api';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export function VideoUpload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [order, setOrder] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !videoUrl) {
      setError('Title and video URL are required');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await api.post('/api/admin/videos', {
        title,
        description,
        url: videoUrl,
        order: Number(order),
      });
      
      setSuccess('Video added successfully!');
      setTitle('');
      setDescription('');
      setVideoUrl('');
      setOrder(0);
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono whitespace-pre overflow-auto"
            style={{ whiteSpace: 'pre', tabSize: 2 }}
            spellCheck="false"
            rows={4}
          ></textarea>
        </div>
        
        <Input
          label="Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          required
        />
        
        <Input
          label="Display Order"
          type="number"
          min="0"
          value={order.toString()}
          onChange={(e) => setOrder(parseInt(e.target.value))}
          placeholder="0"
          required
        />
        
        <Button
          type="submit"
          isLoading={loading}
        >
          Add Video
        </Button>
      </form>
    </div>
  );
}
