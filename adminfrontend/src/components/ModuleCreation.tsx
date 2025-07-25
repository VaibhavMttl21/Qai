import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface Module {
  id: string;
  name: string;
  description?: string | null;
  order?: number;
  imageUrl?: string | null;
}

export function ModuleCreation() {
  const [modules, setModules] = useState<Module[]>([]);
  const [newModuleName, setNewModuleName] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [moduleOrder, setModuleOrder] = useState<number>(0);
  const [moduleImage, setModuleImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
      console.error('Error fetching modules:', error);
      setError('Failed to fetch modules');
      setLoadingModules(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setModuleImage(selectedFile);
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newModuleName) {
      setError('Module name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('name', newModuleName);
      formData.append('description', moduleDescription || '');
      formData.append('order', moduleOrder.toString());
      
      if (moduleImage) {
        formData.append('image', moduleImage);
      }
      
      const response = await api.post<Module>('/api/admin/modules', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Add new module to the list
      const newModule = response.data;
      setModules([...modules, newModule]);
      
      // Reset form
      setNewModuleName('');
      setModuleDescription('');
      setModuleOrder(0);
      setModuleImage(null);
      
      // Reset file input
      const fileInput = document.getElementById('module-image') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      setSuccess('Module created successfully');
      setLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create module');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Manage Modules</h2>

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

      <form onSubmit={handleCreateModule} className="space-y-4 mb-6">
        <Input
          label="Module Name"
          value={newModuleName}
          onChange={(e) => setNewModuleName(e.target.value)}
          placeholder="Enter module name"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Module Description
          </label>
          <textarea
            value={moduleDescription}
            onChange={(e) => setModuleDescription(e.target.value)}
            placeholder="Enter module description (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono"
            rows={3}
          />
        </div>

        <Input
          label="Display Order"
          type="number"
          min="0"
          value={moduleOrder.toString()}
          onChange={(e) => setModuleOrder(parseInt(e.target.value))}
          placeholder="0"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Module Image (optional)
          </label>
          <input
            id="module-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {moduleImage && (
            <p className="mt-1 text-sm text-gray-500">
              Selected image: {moduleImage.name}
            </p>
          )}
        </div>

        <Button type="submit" isLoading={loading}>
          Create Module
        </Button>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Existing Modules</h3>
        {loadingModules ? (
          <div className="text-sm text-gray-500">Loading modules...</div>
        ) : modules.length === 0 ? (
          <div className="text-sm text-gray-500">No modules created yet</div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {modules.map((module) => (
                  <tr key={module.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{module.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{module.order || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {module.imageUrl ? (
                        <img 
                          src={module.imageUrl} 
                          alt={module.name} 
                          className="h-10 w-10 object-cover rounded"
                        />
                      ) : (
                        "No image"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
