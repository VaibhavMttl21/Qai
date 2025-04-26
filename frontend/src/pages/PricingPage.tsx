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
  const [amount] = useState(350); // Fixed amount

  const handlePayment = async () => {
    // if (user?.isPaid) {
    //   toast({
    //     title: 'Already Subscribed',
    //     description: 'You already have access to the premium content!',
    //     variant: 'default',
    //   });
    //   return;
    // }
    try {
      setIsLoading(true);
      const response = await api.post('/api/payment/order', { amount });
      const data = response.data;
      handlePaymentVerify(data.data);
    } catch (error) {
      console.log(error);
      toast('Failed to initiate payment. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentVerify = async (data) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: 'Qai',
      description: 'Test Mode',
      order_id: data.id,
      handler: async (response) => {
        try {
          const verificationResponse = await api.post('/api/payment/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          const verifyData = verificationResponse.data;

          if (verifyData.message) {
            toast('Payment successful!', 'success');
          }
        } catch (error) {
          console.log(error);
          toast('Payment verification failed. Please contact support.', 'error');
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
    'Priority support',
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Unlock the full potential of our platform with a premium subscription. Get access to all videos and join the community.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Plan */}
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
            <li className="flex items-center">✅ Access to first video</li>
            <li className="flex items-center">✅ Limited features</li>
            <li className="flex items-center text-gray-400">❌ No community access</li>
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
                ✅ {feature}
              </li>
            ))}
          </ul>

          <Button
            className="w-full"
            onClick={handlePayment}
            // disabled={isLoading || user?.isPaid}
          >
            {user?.isPaid ? 'Current Plan' : isLoading ? 'Processing...' : 'Upgrade Now'}
          </Button>
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
