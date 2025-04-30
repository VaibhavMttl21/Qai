import { Link } from 'react-router-dom';
import { motion , MotionProps} from 'framer-motion';
import { useEffect, useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

const carouselImages = ['/login1.jpg', '/login4.jpg', '/login3.jpg'];

export function LoginPage() {
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
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' fill='none' stroke='#989898' stroke-width='1.5'><path d='M0 0H32V32'/></svg>`
  );

  const MotionImg = motion.img as React.ComponentType<
  React.ImgHTMLAttributes<HTMLImageElement> & MotionProps
>;

const MotionDiv = motion.div as React.ComponentType<
React.HTMLAttributes<HTMLDivElement> & MotionProps & { 
  ref?: React.Ref<HTMLDivElement>; 
}
>;

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

      {/* Background image on mobile and tablet */}
      <div className="absolute inset-0 lg:hidden w-full h-full overflow-hidden z-0">
        <MotionImg
          key={currentImageIndex}
          src={carouselImages[currentImageIndex]}
          alt="Background Slide"
          className="w-full h-full object-cover transition-all duration-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </div>

      <MotionDiv
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl mx-auto shadow-2xl rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 items-stretch relative z-20"
      >
        {/* Left Side */}
        <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 md:p-10 flex flex-col justify-center items-center text-center">
          <div className="flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div>
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  Sign in to your account
                </h2>
                <p className="mt-4 mb-5 text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-purple-400 hover:text-purple-500">
                    Sign up
                  </Link>
                </p>
              </div>
              {/* Pass bgColor to LoginForm as a prop */}
              <LoginForm bgColor={''} />
            </motion.div>
          </div>
        </div>

        {/* Right Side: Carousel image for laptop/desktop */}
        <div className="hidden lg:flex items-center justify-center bg-white/10 rounded-r-2xl w-full h-[600px]">
          <MotionImg
            key={currentImageIndex}
            src={carouselImages[currentImageIndex]}
            alt="Carousel Slide"
            className="w-full h-full object-cover transition-all duration-1000 rounded-r-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
        </div>
      </MotionDiv>
    </div>
  );
}
