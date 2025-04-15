import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';

const carouselImages = ['/login1.jpg', '/login4.jpg', '/login3.jpg'];

export function RegisterPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bgColorIndex, setBgColorIndex] = useState(0);

  const bgColors = ['#b3b3b3', '#e5e4e2', '#CBE896'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
      setBgColorIndex((prev) => (prev + 1) % bgColors.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const encodedSVG = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' fill='none' stroke='#989898 ' stroke-width='1.5'><path d='M0 0H32V32'/></svg>`
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center transition-colors duration-1000 px-4 relative"
      style={{ backgroundColor: bgColors[bgColorIndex] }}
    >
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

      {/* Background image on mobile */}
      <div className="absolute inset-0 lg:hidden flex items-center justify-center opacity-40 z-0">
        <motion.img
          key={currentImageIndex}
          src={carouselImages[currentImageIndex]}
          alt="Background Slide"
          className="w-[500px] h-[800px] object-cover rounded-xl transition-all duration-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        {...{ className: "w-full max-w-5xl mx-auto shadow-2xl rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 items-stretch relative z-20" }}
      >
        {/* Left Side: Now Empty */}
        <div className="bg-white/90 backdrop-blur-md rounded-l-2xl p-6 sm:p-8 md:p-10 flex flex-col justify-center">
          <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              {...{ className: "max-w-md w-full space-y-8" }}
            >
              <div className="text-center">
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  Create your account
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-purple-400 hover:text-purple-500">
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Pass bgColor to RegisterForm as a prop */}
              <RegisterForm  />
            </motion.div>
          </div>
        </div>

        {/* Right: Carousel Image */}
        <div className="hidden lg:flex items-center justify-center bg-white/10 rounded-r-2xl w-full h-[600px]">
          <motion.img
            key={currentImageIndex}
            src={carouselImages[currentImageIndex]}
            alt="Carousel Slide"
            className="w-full h-full object-cover transition-all duration-1000 rounded-r-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
        </div>
      </motion.div>
    </div>
  );
}
