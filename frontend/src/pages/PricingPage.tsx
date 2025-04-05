import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toaster';
import api from '@/lib/api';

export function PricingPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (user?.isPaid) {
      toast('You already have a premium account', 'info');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.post('/api/payment/create-checkout-session');
      window.location.href = response.data.url;
    } catch (error) {
      toast('Failed to initialize checkout', 'error');
      console.error('Checkout initialization failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    'Access to all educational videos',
    'Community discussion participation',
    'Post and reply in forums',
    'Downloadable resources',
    'Certificate of completion',
    'Priority support'
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Unlock the full potential of our platform with a premium subscription.
          Get access to all videos and join the community.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold">Free Plan</h2>
            <p className="text-3xl font-bold mt-2">$0</p>
            <p className="text-gray-500">Limited access</p>
          </div>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Access to first video
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Limited features
            </li>
            <li className="flex items-center text-gray-400">
              <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              No community access
            </li>
          </ul>
          
          <Button variant="outline" className="w-full" disabled>
            Current Plan
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6 border-2 border-blue-500 relative"
        >
          <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm font-semibold transform translate-y-[-50%]">
            Popular
          </div>
          
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold">Premium Plan</h2>
            <p className="text-3xl font-bold mt-2">$49</p>
            <p className="text-gray-500">One-time payment</p>
          </div>
          
          <ul className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          
          {user?.isPaid ? (
            <Button className="w-full" disabled>
              Current Plan
            </Button>
          ) : (
            <Button className="w-full" onClick={handleSubscribe} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Upgrade Now'}
            </Button>
          )}
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 text-center"
      >
        <h3 className="text-lg font-semibold mb-2">Money Back Guarantee</h3>
        <p className="text-gray-600">
          Not satisfied with our premium content? We offer a 30-day money-back guarantee.
        </p>
      </motion.div>
    </div>
  );
}
