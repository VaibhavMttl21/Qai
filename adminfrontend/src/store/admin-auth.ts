import { create } from 'zustand';
import api from '../lib/api';
import { jwtDecode } from 'jwt-decode';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  userType: 'ADMIN'; // Only ADMIN type can be admin
  exp?: number; // Optional expiration time from JWT
}

interface AdminAuthState {
  user: AdminUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAdminAuthStore = create<AdminAuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('admin_token'),
  loading: false,
  error: null,
  
  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post('/api/auth/login', { email, password });
      console.log('Login response:', response);
      interface LoginResponse {
        token: string;
      }
      const data = response.data as LoginResponse;
      const token = data.token;
      
      // Decode the token to verify this is an admin (ADMIN type)
      const decoded = jwtDecode<AdminUser>(token);
      console.log('Decoded token:', decoded);
      
      if (decoded.userType !== 'ADMIN') {
        set({ loading: false, error: 'Unauthorized: Admin access required' });
        return false;
      }
      
      localStorage.setItem('admin_token', token);
      set({ token, user: decoded, loading: false });
      return true;
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Login failed'
      });
      return false;
    }
  },
  
  logout: () => {
    localStorage.removeItem('admin_token');
    set({ user: null, token: null });
  },
  
  checkAuth: () => {
    const token = get().token;
    if (!token) return false;
    
    try {
      const decoded = jwtDecode<AdminUser>(token);
      // Check token expiration
      const currentTime = Date.now() / 1000;
      const isValid = decoded.exp ? decoded.exp > currentTime : true;
      // Also verify it's an admin user
      return isValid && decoded.userType === 'ADMIN';
    } catch {
      return false;
    }
  }
}));
