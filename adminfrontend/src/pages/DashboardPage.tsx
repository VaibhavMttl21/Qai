import { useState } from 'react';
import { useAdminAuthStore } from '../store/admin-auth';
import { Button } from '../components/ui/Button';
import { ExcelUpload } from '../components/ExcelUpload';
import { VideoUpload } from '../components/VideoUpload';
import { PdfUpload } from '../components/PdfUpload';
import { ModuleCreation } from '../components/ModuleCreation';
import { DeleteResourcesPage } from './DeleteResourcesPage';
import { RenameResource } from '../components/RenameResource';
import { Menu, X } from 'lucide-react';

export function DashboardPage() {
  const { user, logout } = useAdminAuthStore();
  const [activeTab, setActiveTab] = useState<'excel' | 'video' | 'pdf' | 'module' | 'delete' | 'rename'>('excel');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const tabs = [
    { id: 'excel', label: 'Excel Upload' },
    { id: 'video', label: 'Video Upload' },
    { id: 'pdf', label: 'PDF Upload' },
    { id: 'module', label: 'Module Creation' },
    { id: 'rename', label: 'Rename Resources' },
    { id: 'delete', label: 'Delete Resources' },
  ] as const;

  const handleTabClick = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setSidebarOpen(false); // Close sidebar when tab is selected on mobile
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              className="mr-4 md:hidden" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden sm:inline">
              Welcome, {user?.name || 'Admin'}
            </span>
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 relative">
        {/* Mobile Sidebar */}
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
             onClick={() => setSidebarOpen(false)}>
        </div>

        <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition duration-300 ease-in-out md:hidden z-30 w-64 bg-white shadow-lg`}>
          <div className="flex justify-between items-center p-4 border-b">
            <span className="font-medium">Menu</span>
            <button onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>
          
          <div className="flex flex-col p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                } px-4 py-3 text-left rounded-md mb-1 font-medium text-sm`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Desktop Tab navigation */}
          <div className="border-b border-gray-200 mb-6 hidden md:block">
            <nav className="-mb-px flex flex-wrap space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Current active tab content */}
          <div className="mt-6">
            {activeTab === 'excel' 
              ? <ExcelUpload /> 
              : activeTab === 'video' 
                ? <VideoUpload /> 
                : activeTab === 'pdf'
                  ? <PdfUpload />
                  : activeTab === 'module'
                    ? <ModuleCreation />
                    : activeTab === 'rename'
                      ? <RenameResource />
                      : <DeleteResourcesPage />
            }
          </div>
        </main>
      </div>
    </div>
  );
}