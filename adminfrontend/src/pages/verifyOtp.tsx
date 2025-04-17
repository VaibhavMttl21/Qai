import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useToast } from '@/components/ui/use-toast';
import  api  from '../lib/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function VerifyOTPPage() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  // const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  
  const encodedSVG = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' fill='none' stroke='#989898 ' stroke-width='1.5'><path d='M0 0H32V32'/></svg>`
  );

  // Redirect if no email in state
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp) {
      alert("Please enter the verification code");
      // toast({
      //   title: "Error",
      //   description: "Please enter the verification code",
      //   variant: "destructive",
      // });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await api.post('/api/auth/verify-otp', { email, otp });
      alert("Verification successful");
      // toast({d
      //   title: "Success",
      //   description: "Verification successful",
      // });
      
      // Navigate to reset password page
      navigate('/reset-password', { state: { email, token: response.data.token } });
    } catch (error) {
      alert("Invalid verification code. Please try again.");
      // toast({
      //   title: "Error",
      //   description: "Invalid verification code. Please try again.",
      //   variant: "destructive",
      // });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    
    try {
      await api.post('/auth/forgot-password', { email });
      
      // toast({
      //   title: "OTP Sent",
      //   description: "A new verification code has been sent to your email",
      // });
      
      setCountdown(60);
      setCanResend(false);
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to send verification code. Please try again.",
      //   variant: "destructive",
      // });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
        className="w-full max-w-md p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl relative z-20"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Verify OTP</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the verification code sent to {email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="otp">Verification Code</label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter your verification code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          {canResend ? (
            <button 
              onClick={handleResendOTP} 
              className="text-sm text-purple-400 hover:text-purple-500"
              disabled={isLoading}
            >
              Resend verification code
            </button>
          ) : (
            <p className="text-sm text-gray-500">
              Resend code in {countdown} seconds
            </p>
          )}
          <div className="mt-2">
            <Link to="/forgot-password" className="text-sm text-purple-400 hover:text-purple-500">
              Change email
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
