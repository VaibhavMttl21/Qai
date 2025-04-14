import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import api from '../../lib/api'; // Updated import path
import { jwtDecode } from 'jwt-decode'; // Updated import statement

interface User {
  id: string;
  email: string;
  name: string;
  userType: 'SCHOOL' | 'RANDOM' | 'ADMIN'; // Update userType to match expected type
  isPaid: boolean;  // Add isPaid field
  // Add other fields as per your JWT payload structure
}

// Initialize Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export function RegisterForm({ bgColor }: { bgColor: string }) {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { googleSignIn } = useAuthStore((state) => state);
  const navigate = useNavigate();

  const [step, setStep] = useState('register'); // 'register' or 'verify'
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 'register') {
      try {
        await api.post('/api/auth/generate-otp', formData);
        setStep('verify');
      } catch (error) {
        console.error('OTP generation failed:', error);
      }
    } else {
      try {
        const response = await api.post('/api/auth/verify-otp', {
          email: formData.email,
          otp,
        });

        // Store token and navigate
        const token = response.data.token;
        localStorage.setItem('token', token);
        const decoded = jwtDecode<User>(token);
        useAuthStore.setState({ user: decoded, token });
        navigate('/dashboard');
      } catch (error) {
        console.error('OTP verification failed:', error);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      await googleSignIn(idToken);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign-in failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {step === 'register' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-2 text-white bg-purple-400 hover:bg-purple-500"
          >
            Send Verification Code
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-center text-lg font-medium">Verify your email</h3>
          <p className="text-center text-sm text-gray-500">
            We've sent a verification code to {formData.email}
          </p>
          <div>
            <Input
              type="text"
              placeholder="Enter 6-digit verification code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-2 text-white bg-purple-400 hover:bg-purple-500"
          >
            Verify & Create Account
          </Button>
          <p className="text-center text-sm text-gray-500">
            Didn't receive a code?{' '}
            <button
              type="button"
              onClick={() => handleSubmit(new Event('submit') as any)}
              className="text-purple-400 hover:text-purple-500"
            >
              Resend
            </button>
          </p>
        </form>
      )}

      <div className="flex items-center gap-4">
        <Separator className="flex-grow" />
        <span className="text-xs text-gray-500">OR</span>
        <Separator className="flex-grow" />
      </div>

      <Button 
        type="button" 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2 text-white bg-gradient-to-br from-purple-400 from-40% to-indigo-400 hover:bg-purple-500 cursor-pointer"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        style={{ borderColor: bgColor, color: bgColor }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Sign up with Google
      </Button>
    </div>
  );
}
