import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toaster';
import api from '@/lib/api';

export function AdminUploadPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const navigate = useNavigate();
  
  // Redirect if not an admin
//   if (user?.userType !== 'SCHOOL') {
//     // navigate('/dashboard');
//     return null;
//   }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast('Please select a file to upload', 'error');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', fileName);
    
    setIsUploading(true);
    try {
      await api.post('/api/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast('File uploaded successfully', 'success');
      setFile(null);
      setFileName('');
    } catch (error) {
      console.error('Upload failed:', error);
      toast('Failed to upload file', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-6">Admin Upload</h1>
        
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Upload CSV or Excel File
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            {file && (
              <p className="text-sm text-gray-500">
                Selected file: {file.name}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="fileName" className="block text-sm font-medium text-gray-700">
              Dataset Name
            </label>
            <input
              id="fileName"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Enter a name for this dataset"
              required
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isUploading || !file}>
              {isUploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
