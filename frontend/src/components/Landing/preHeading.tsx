import { motion, MotionProps } from "framer-motion";
import BlurText from "./text";
// import Button from "./buttonpre";
import { Link } from "react-router-dom";
import '../../styles/fonts.css';
import NeuFollowButton3 from "./buttonpre";
import Spline from '@splinetool/react-spline'; // Keep this import


const handleAnimationComplete = () => {
  // console.log('Animation completed!');
};

const MotionImg = motion.img as React.ComponentType<
  React.ImgHTMLAttributes<HTMLImageElement> & MotionProps
>;

export function PreHeading() {
  return (
    <div className="relative w-screen h-screen bg-[#e3e3e3] bg-cover bg-center z-40 overflow-hidden">
      {/* Left Floating Image */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-auto
                    w-1/2 max-w-[700px] max-h-[900px]
                    md:w-[55%] sm:w-[60%]
                    xs:w-[80%] z-10">
        <MotionImg
          src="/blob.png"
          alt="Left side illustration"
          className="w-full h-auto object-contain opacity-70"
          initial={false}
          animate={{ y: [0, -30, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Text Content */}
      <div className="absolute
                    top-26 sm:top-1/3 sm:transform sm:-translate-y-1/4
                    w-full sm:w-auto
                    max-w-[95%] sm:max-w-[80%] md:max-w-[50%]
                    px-4 sm:px-6 md:px-12 z-20">
        <BlurText
          text="Smarter Learning, Future Thinking!"
          delay={150}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl
                    mt-6 sm:mt-12 mb-4 sm:mb-6
                    ml-2 sm:ml-6
                    font-satoshi font-bold text-black/80"
        />
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
          style={{
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
            color: "rgba(0, 0, 0, 0.8)",
            marginTop: "0.5rem",
            marginLeft: "0.5rem",
            marginBottom: "1rem",
            fontFamily: "Satoshi, sans-serif",
            fontWeight: "400",
            paddingRight: "0.5rem",
          }}
        >
          Step into the future with QAI — a powerful AI course designed for Indian school students. Learn to study smarter, understand Artificial Intelligence, and build skills that matter.
          <br />
          <Link to="/login">
            <div className="mt-4 sm:mt-6 justify-left">
              <NeuFollowButton3/>
            </div>
          </Link>
        </motion.p>
      </div>

      {/* Right Spline Viewer */}
      {/* Visible only on medium and larger screens */}
<div className="hidden md:block absolute 
                right-0 bottom-0 sm:top-0 
                h-1/2 sm:h-full 
                w-full sm:w-1/2 
                max-w-[1000px] max-h-[800px]
                md:w-[45%] sm:w-[60%] 
                z-0">
  <Spline
    scene="https://prod.spline.design/7E53giVz8ZZrrWXb/scene.splinecode"
  />
</div>

{/* Visible only on small screens */}
<div className="block md:hidden absolute 
                right-0 bottom-0 sm:top-0 
                h-1/3 sm:h-full 
                w-full sm:w-1/2 
                max-w-[1000px] max-h-[800px]
                md:w-[45%] sm:w-[60%] 
                z-0">
  <img
    src="/robotsmall.png"
    alt="3D Preview"
    className="h-full w-full object-contain"
  />
</div>


    </div>
  );
}