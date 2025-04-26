import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toaster';
import api from '@/lib/api';
import "../styles/fonts.css"; // ✅ Import custom font

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
   
    'Priority support'
  ];

  return (
    <div className="max-w-screen mx-auto px-4 font-Satoshi font-medium pt-6 "
    style={{
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='%23d4d4d4'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
    }}
    > 
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        {...{className :"text-center mb-12"}}
      >
        <h1 className="text-4xl pb-1 font-black font-Satoshi mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
          Pricing
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto font-Satoshi font-bold">
          Unlock the full potential of our platform with a premium subscription.
          Get access to all videos and join the community.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          {...{className:"bg-white rounded-lg shadow-md py-6 pr-6 pl-6 border border-indigo-200 flex flex-col justify-between"}}
        >
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-indigo-700 font-Satoshi">Free Plan</h2>
              <p className="text-3xl font-bold mt-2 text-purple-600">$0</p>
              <p className="text-gray-500 font-Satoshi ">Limited access</p>
            </div>
            <ul className="space-y-3 mb-8 text-l text-gray-700 font-Satoshi">
              <li className="flex items-center font-Satoshi">
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
              <li className="flex items-center text-gray-400 font-Satoshi">
                <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                No community access
              </li>
            </ul>
          </div>
          <Button
            variant="outline"
            className="w-full transition duration-300 hover:scale-105 hover:brightness-110"
            disabled
          >
            Current Plan
          </Button>
        </motion.div>

        {/* Premium Plan */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          {...{ className: "bg-white rounded-lg shadow-md py-6 pr-6 pl-6 border-2 border-purple-600 relative flex flex-col justify-between" }}
        >
          <div className="absolute top-0 right-0 font-Satoshi bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 text-sm font-semibold rounded-bl-lg transform translate-y-[-50%]">
            ★ Popular
          </div>

          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl  text-purple-700 font-bold font-Satoshi">Premium Plan</h2>
              <p className="text-3xl font-bold mt-2 text-indigo-700 font-Satoshi">$49</p>
              <p className="text-gray-500 font-Satoshi">One-time payment</p>
            </div>
            <ul className="space-y-3 mb-8 text-l text-gray-700">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {user?.isPaid ? (
            <Button
              className="w-full transition duration-300 hover:scale-105 hover:brightness-110 font-Satoshi"
              disabled
            >
              Current Plan
            </Button>
          ) : (
            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition duration-300 hover:scale-105 hover:brightness-110 font-Satoshi"
              onClick={handleSubscribe}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Upgrade Now'}
            </Button>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        {...{className: "mt-12 text-center"}}
      >
        <h3 className="text-lg font-bold mb-2 text-indigo-600 font-Satoshi">Terms and Condition</h3>
        <p className="text-gray-600 font-Satoshi font-regular" >
          QAI
          <br />Contact us for more queries
          
        </p>
      </motion.div>
    </div>
  );
}
