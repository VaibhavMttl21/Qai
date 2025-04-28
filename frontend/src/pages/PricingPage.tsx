import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
// import { useToast } from '@/components/ui/toaster';
import api from '@/lib/api';
import "../styles/fonts.css";
import { useNavigate } from 'react-router-dom';

// Declare Razorpay on the window object
declare global {
  interface Window {
    Razorpay: any;
  }
}

export function PricingPage() {
  const { user, setUser } = useAuthStore();
  // const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [amount] = useState(350); // Fixed amount
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (user?.isPaid) {
      // toast({
      //   title: 'Already Subscribed',
      //   description: 'You already have access to the premium content!',
      //   variant: 'default',
      // });
      return;
    }
    try {
      setIsLoading(true);
      const response = await api.post('/api/payment/create-order', { amount });
      const data = response.data;
      handlePaymentVerify(data.data);
    } catch (error) {
      console.error(error);
      // toast('Failed to initiate payment. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentVerify = async (data: { amount: any; currency: any; id: any; }) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: 'Qai',
      description: 'Test Mode',
      order_id: data.id,
      handler: async (response: { razorpay_order_id: any; razorpay_payment_id: any; razorpay_signature: any; }) => {
        try {
          const verificationResponse = await api.post('/api/payment/verify-payment', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          const verifyData = verificationResponse.data;
          
          if (verifyData.message) {
            if (user) {
              const updateResponse = await api.post('/api/payment/update-payment', { userId: user.id });
              
              // Update local user state to reflect premium status
              if (updateResponse.data && updateResponse.data.isPaid) {
                setUser({ ...user, isPaid: true });
                // Show success message
                alert('Payment successful! You now have premium access.');
                // Optionally navigate to profile or dashboard
                navigate('/profile');
              }
            }
          }
        } catch (error) {
          console.error(error);
          // toast('Payment verification failed. Please contact support.', 'error');
          alert('Payment verification failed. Please contact support.');
        }
      },
      theme: {
        color: '#5f63b8',
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
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
        {...{classNam:"text-center mb-12"}}
      >
        <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
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
          {...{className :"bg-white rounded-lg shadow-md p-6 border border-indigo-200 flex flex-col justify-between"}}
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-indigo-700 font-Satoshi">Free Plan</h2>
            <p className="text-3xl font-bold mt-2 text-purple-600">$0</p>
            <p className="text-gray-500 font-Satoshi">Limited access</p>
          </div>

          <ul className="space-y-3 mb-8 text-l text-gray-700 font-Satoshi">
            <li className="flex items-center">
              ✅ Access to first video
            </li>
            <li className="flex items-center">
              ✅ Limited features
            </li>
            <li className="flex items-center text-gray-400">
              ❌ No community access
            </li>
          </ul>

          <Button variant="outline" className="w-full" disabled>
            Current Plan
          </Button>
        </motion.div>

        {/* Premium Plan */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          {...{className :"bg-white rounded-lg shadow-sm p-6 border-2 border-blue-500 relative"}}
        >
          <div className="absolute top-0 right-0 font-Satoshi bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 text-sm font-semibold rounded-bl-lg transform translate-y-[-50%]">
            ★ Popular
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-purple-700 font-Satoshi">Premium Plan</h2>
            <p className="text-3xl font-bold mt-2 text-indigo-700 font-Satoshi">$49</p>
            <p className="text-gray-500 font-Satoshi">One-time payment</p>
          </div>

          <ul className="space-y-3 mb-8 text-l text-gray-700">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center">
                ✅ {feature}
              </li>
            ))}
          </ul>

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
              onClick={handlePayment}
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
        {...{className:"mt-12 text-center"}}
      >
        <h3 className="text-lg font-bold mb-2 text-indigo-600 font-Satoshi">Terms and Condition</h3>
        <p className="text-gray-600 font-Satoshi font-regular">
          QAI
          <br />
          Contact us for more queries
        </p>
      </motion.div>
    </div>
  );
}