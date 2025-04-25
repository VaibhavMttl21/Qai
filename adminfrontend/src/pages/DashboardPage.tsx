import { useState } from 'react';
import { useAdminAuthStore } from '../store/admin-auth';
import { Button } from '../components/ui/Button';
import { ExcelUpload } from '../components/ExcelUpload';
import { VideoUpload } from '../components/VideoUpload';
import { PdfUpload } from '../components/PdfUpload';
import { ModuleCreation } from '../components/ModuleCreation';
import { DeleteResourcesPage } from './DeleteResourcesPage';

export function DashboardPage() {
  const { user, logout } = useAdminAuthStore();
  const [activeTab, setActiveTab] = useState<'excel' | 'video' | 'pdf' | 'module' | 'delete'>('excel');
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.name || 'Admin'}
            </span>
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Tab navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('excel')}
              className={`${
                activeTab === 'excel'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Excel Upload
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`${
                activeTab === 'video'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Video Upload
            </button>
            <button
              onClick={() => setActiveTab('pdf')}
              className={`${
                activeTab === 'pdf'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              PDF Upload
            </button>
            <button
              onClick={() => setActiveTab('module')}
              className={`${
                activeTab === 'module'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Module Creation
            </button>
            <button
              onClick={() => setActiveTab('delete')}
              className={`${
                activeTab === 'delete'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Delete Resources
            </button>
          </nav>
        </div>
        
        {/* Tab content */}
        <div className="mt-6">
          {activeTab === 'excel' 
            ? <ExcelUpload /> 
            : activeTab === 'video' 
              ? <VideoUpload /> 
              : activeTab === 'pdf'
                ? <PdfUpload />
                : activeTab === 'module'
                  ? <ModuleCreation />
                  : <DeleteResourcesPage />
          }
        </div>
      </main>
    </div>
  );
}
