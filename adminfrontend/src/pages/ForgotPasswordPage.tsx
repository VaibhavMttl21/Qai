import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import api from '../lib/api'; 

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    
    try {
        // Use the API client instead of fetch
         await api.post('/api/auth/forgot-password', { email });
        setSuccess(true);
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
      navigate('/verify-otp', { state: { email } });
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
          <p className="text-gray-600">Enter your email to reset your password</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        {success ? (
          <div className="text-center">
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
              Password reset instructions have been sent to your email.
            </div>
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Return to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
            />
            
            <Button
              type="submit"
              isLoading={loading}
              className="w-full"
            >
              Send Reset Link
            </Button>
            
            <div className="text-center mt-4">
              <Link to="/login" className="text-sm text-blue-600 hover:text-blue-800">
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
