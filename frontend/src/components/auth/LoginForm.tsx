import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

export function LoginForm({ bgColor }: { bgColor: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('regular'); // 'regular' or 'school'
  const [dob, setDob] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      if (loginType === 'school') {
        // For school students, we'll check if they're using DOB or password
        if (dob) {
          // If DOB is provided, format it and send as before
          const day = parseInt(dob.slice(0, 2), 10);
          const month = parseInt(dob.slice(2, 4), 10);
          const year = parseInt(dob.slice(4), 10);
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
    </form>
  );
}
