import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { VideoPage } from '@/pages/VideoPage';
import { CommunityPage } from '@/pages/CommunityPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { PricingPage } from '@/pages/PricingPage';
// import { AdminUploadPage } from '@/pages/AdminUploadPage';
import { useAuthStore } from '@/store/auth';
import { connectSocket } from '@/lib/socket';

function App() {
  const initAuth = useAuthStore(state => state.initAuth);
  const token = useAuthStore(state => state.token);
  
  useEffect(() => {
    initAuth();
    
    // If the user has a token, connect to the socket
    if (token) {
      connectSocket();
    }
  }, [initAuth, token]);
  

  return (
    <Router>
      <Routes>
      <Route
            path="/home"
            element={
                <LandingPage />
            }
          />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
               </ProtectedRoute>
            }
          />
          <Route
            path="/videos"
            element={
              <ProtectedRoute>
                <VideoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <CommunityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pricing"
            element={
              <ProtectedRoute>
                <PricingPage />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/admin/upload"
            element={
              <ProtectedRoute>
                <AdminUploadPage />
              </ProtectedRoute>
            }
          />
          
          /> */}
        </Route>
        
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
