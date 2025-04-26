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
    'Priority support'
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        {...{ className: "text-center mb-12" }}
      >
        <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Unlock the full potential of our platform with a premium subscription.
          Get access to all videos and join the community.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Plan */}
        {/* Free Plan */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          {...{className:"bg-white rounded-lg shadow-md py-6 pr-6 pl-6 border border-indigo-200 flex flex-col justify-between"}}
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

        {/* Premium Plan */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          {...{ className: "bg-white rounded-lg shadow-sm p-6 border-2 border-blue-500 relative" }}
        >
          <div className="absolute top-0 right-0 font-Satoshi bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 text-sm font-semibold rounded-bl-lg transform translate-y-[-50%]">
            ★ Popular
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
        className="mt-12 text-center"
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
