import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

interface GuestRouteProps {
  children: ReactNode;
}

export const GuestRoute = ({ children }: GuestRouteProps) => {
  const token = useAuthStore(state => state.token);
  const user = useAuthStore(state => state.user);
  
  // If user is already logged in, redirect to dashboard
  if (token && user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Otherwise, render the children (login/register page)
  return <>{children}</>;
};
