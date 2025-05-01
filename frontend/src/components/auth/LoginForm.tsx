import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

export function LoginForm({}: { bgColor: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('regular'); // 'regular' or 'school'
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const { googleSignIn } = useAuthStore((state) => state);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      if (loginType === 'school') {
        // For school students, we'll check if they're using DOB or password
        if (password && password.length === 8 && /^\d{8}$/.test(password)) {
          // If password looks like a DOB (8 digits), parse and format it
          const day = parseInt(password.slice(0, 2), 10);
          const month = parseInt(password.slice(2, 4), 10);
          const year = parseInt(password.slice(4), 10);
          const date = new Date(year, month - 1, day);
          const excelEpoch = new Date(1899, 11, 30);
          const diffInMs = date.getTime() - excelEpoch.getTime();
          const formattedDob = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;

          await login(email, password, formattedDob.toString());
        } else {
          // If it's not in DOB format, treat it as a regular password
          await login(email, password);
        }
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Invalid credentials. Please check your email and password.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

    const handleGoogleSignIn = async () => {
      setError(null);
      setIsGoogleLoading(true);
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken();
        await googleSignIn(idToken);
        navigate('/dashboard');
      } catch (error: any) {
        const errorMessage = error.message || 'Google sign-in failed';
        setError(errorMessage);
      } finally {
        setIsGoogleLoading(false);
      }
    };

  return (
    <form onSubmit={handleSubmit} >
      {error && (
        <Alert variant="destructive" className="mb-4">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          
        />
      </div>

      <div className="flex items-center space-x-2 py-4">
        <Checkbox
          id="school-login"
          checked={loginType === 'school'}
          onCheckedChange={(checked) => setLoginType(checked ? 'school' : 'regular')}
        />
        <Label htmlFor="school-login"> school student</Label>
      </div>

      {loginType === 'school' ? (
        <div>
          {/* <Label htmlFor="dob" className="block text-sm font-medium mb-1">
            Password
          </Label> */}
          <Input
            id="password"
            type="password"
            placeholder="Password or DOB (Format: DDMMYYYY)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="text-xs text-gray-500 mt-1">
            <p>Enter your custom password or date of birth as DDMMYYYY</p>
            <a 
              href="/forgot-password" 
              className="text-purple-500 hover:text-purple-600 hover:underline"
            >
              Forgot Password?
            </a>
          </div>
        </div>
      ) : (
        <div>
          {/* <Label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </Label> */}
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="text-xs text-gray-500 mt-6">
            <a 
              href="/forgot-password" 
              className="text-purple-500 hover:text-purple-600 hover:underline "
            >
              Forgot Password?
            </a>
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full mb-5 mt-2 text-white bg-gradient-to-br from-purple-400 from-40% to-indigo-400 hover:bg-purple-700 cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>

      <div className="relative mb-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">OR</span>
        </div>
      </div>

      <Button 
          type="button" 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 text-white bg-gradient-to-br from-purple-400 from-40% to-indigo-400 hover:bg-purple-500 cursor-pointer"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading} // Controlled by isGoogleLoading state
          // style={{ borderColor: bgColor, color: bgColor }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {isGoogleLoading ? "Processing..." : "Continue with Google"}
        </Button>
    </form>
  );
}
