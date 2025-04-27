import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { GuestRoute } from '@/components/auth/GuestRoute';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { VerifyOTPPage } from '@/pages/auth/VerifyOTPPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { CommunityPage } from '@/pages/CommunityPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { PricingPage } from '@/pages/PricingPage';
import { ModulePage } from './pages/ModulePage';
import { VideoDetailsPage } from './pages/VideoDetailsPage';
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
        {/* Public Route: Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Guest-only Routes */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPasswordPage />
            </GuestRoute>
          }
        />
        <Route
          path="/verify-otp"
          element={
            <GuestRoute>
              <VerifyOTPPage />
            </GuestRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <GuestRoute>
              <ResetPasswordPage />
            </GuestRoute>
          }
        />

        {/* Protected Routes with Layout */}
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/videos"
            element={
              <ProtectedRoute>
                <VideoPage />
              </ProtectedRoute>
            }
          /> */}
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
          <Route path="/modules" element={
            <ProtectedRoute>
              <ModulePage />
            </ProtectedRoute>
            } />
          <Route path="/video/:videoId" element={
            <ProtectedRoute>
              <VideoDetailsPage />
            </ProtectedRoute>
            } />
        </Route>

        {/* Catch-all Route: Redirect to Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
