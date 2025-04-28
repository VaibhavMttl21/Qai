import { create } from 'zustand';
import api from '../lib/api';
import { jwtDecode } from 'jwt-decode';
import { connectSocket, disconnectSocket } from '../lib/socket';

interface User {
  id: string;
  email: string;
  name: string;
  userType: 'SCHOOL' | 'RANDOM' | 'ADMIN';
  isPaid: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void; 
  isSchoolUser: (user?: User | null) => boolean;
  login: (email: string, password: string, dob?: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  googleSignIn: (idToken: string) => Promise<void>;
  logout: () => void;
  initAuth: () => void;
}

interface LoginPayload {
  email: string;
  password: string;
  dob?: string; // Optional for school users
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),

  setUser: (user) => {
    set({ user });
  },
  

  isSchoolUser: (user = null) => {
    const currentUser = user || get().user;
    return currentUser?.userType === 'SCHOOL';
  },
  
  initAuth: () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode the JWT token to get the user information
        const decoded = jwtDecode<User>(token);
        set({ user: decoded, token });
        
        // Connect to socket when auth is initialized with a valid token
        connectSocket();
      } catch (error) {
        console.error('Failed to decode token:', error);
        localStorage.removeItem('token');
        set({ user: null, token: null });
      }
    }
  },
  
  login: async (email, password, dob) => {
    // Create the payload for login
    const payload: LoginPayload = { email, password };
    
    // If DOB is provided for school users, include it
    if (dob) {
      payload.dob = dob;
    }
    
    const response = await api.post('/api/auth/login', payload);
    const token = response.data.token;
    localStorage.setItem('token', token);
    
    // Decode the JWT token to get user info
    const decoded = jwtDecode<User>(token);
    set({ token, user: decoded });
    
    // Connect to socket after successful login
    connectSocket();
  },
  
  register: async (email, password, name) => {
    const response = await api.post('/api/auth/register', { email, password, name });
    const token = response.data.token;
    localStorage.setItem('token', token);
    
    // Decode the JWT token to get user info
    const decoded = jwtDecode<User>(token);
    set({ token, user: decoded });
    
    // Connect to socket after successful registration
    connectSocket();
  },
  
  googleSignIn: async (idToken) => {
    const response = await api.post('/api/auth/google', { idToken });
    const token = response.data.token;
    localStorage.setItem('token', token);
    
    // Decode the JWT token to get user info
    const decoded = jwtDecode<User>(token);
    set({ token, user: decoded });
    
    // Connect to socket after successful Google sign-in
    connectSocket();
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
    
    // Disconnect socket on logout
    disconnectSocket();
  },
}));