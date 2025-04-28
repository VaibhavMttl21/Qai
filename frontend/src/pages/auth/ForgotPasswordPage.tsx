import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster, useToast } from '@/components/ui/toaster';
import api  from '@/lib/api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const encodedSVG = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' fill='none' stroke='#989898 ' stroke-width='1.5'><path d='M0 0H32V32'/></svg>`
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast("Error: Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
       await api.post('/api/auth/forgot-password', { email});
      
      toast("OTP Sent: A verification code has been sent to your email");
      
      // Navigate to OTP verification page, passing email as state
      navigate('/verify-otp', { state: { email } });
    } catch (error) {
      console.error("Error sending verification code:", error);
      toast("Error: Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative">
        {/* SVG grid background */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodedSVG}")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '32px 32px',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
            maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          {...{className:"w-full max-w-md p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl relative z-20"}}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Forgot Password</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email to receive a verification code
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Verification Code"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-purple-400 hover:text-purple-500">
              Back to login
            </Link>
          </div>
        </motion.div>
      </div>
      <Toaster />
    </>
  );
}
