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
          // If only password is provided, use that
          await login(email, password);
        }
      } else {
        // Regular login with password
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
    setIsGoogleLoading(true);  // Use the Google-specific loading state
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      await googleSignIn(idToken);
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.message || 'Google sign-in failed';
      setError(errorMessage);
    } finally {
      setIsGoogleLoading(false);  // Reset Google-specific loading state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="flex items-center space-x-2 py-2">
        <Checkbox
          id="school-login"
          checked={loginType === 'school'}
          onCheckedChange={(checked) => setLoginType(checked ? 'school' : 'regular')}
        />
        <Label htmlFor="school-login"> school student</Label>
      </div>

      {loginType === 'school' ? (
        <div>
          <Label htmlFor="dob" className="block text-sm font-medium mb-1">
            Password
          </Label>
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
          <Label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </Label>
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
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
        </svg>
        {isGoogleLoading ? "Signing in..." : "Sign in with Google"}
      </Button>
    </form>
  );
}
