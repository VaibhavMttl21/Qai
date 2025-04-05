import { create } from 'zustand';
import api from '../lib/api';
import { jwtDecode } from 'jwt-decode'; // Corrected import statement

interface User {
  id: string;
  email: string;
  name: string;
  userType: 'SCHOOL' | 'RANDOM';
  isPaid: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  googleSignIn: (idToken: string) => Promise<void>;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  
  initAuth: () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode the JWT token to get the user information
        const decoded = jwtDecode<User>(token);
        set({ user: decoded, token });
      } catch (error) {
        console.error('Failed to decode token:', error);
        localStorage.removeItem('token');
        set({ user: null, token: null });
      }
    }
  },
  
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    const token = response.data.token;
    localStorage.setItem('token', token);
    
    // Decode the JWT token to get user info
    const decoded = jwtDecode<User>(token);
    set({ token, user: decoded });
  },
  
  register: async (email, password, name) => {
    const response = await api.post('/api/auth/register', { email, password, name });
    const token = response.data.token;
    localStorage.setItem('token', token);
    
    // Decode the JWT token to get user info
    const decoded = jwtDecode<User>(token);
    set({ token, user: decoded });
  },
  
  googleSignIn: async (idToken) => {
    const response = await api.post('/api/auth/google', { idToken });
    const token = response.data.token;
    localStorage.setItem('token', token);
    
    // Decode the JWT token to get user info
    const decoded = jwtDecode<User>(token);
    set({ token, user: decoded });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));