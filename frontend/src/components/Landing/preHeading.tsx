// import { motion } from "framer-motion";


// export function PreHeading() {
//   return (
//     <div className="relative w-screen h-screen bg-[#e3e3e3] bg-cover bg-center z-40">

// {/* url('/topbg.png') */}
//       {/* Left Floating Image */}
//       <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-auto w-1/2 max-w-[700px] max-h-[900px] md:w-[55%] sm:w-[60%] xs:w-[90%]">
//         <motion.img
//           src="/blob.png"
//           alt="Left side illustration"
//           className="w-full h-auto object-contain opacity-70"
//           animate={{ y: [0, -30, 0] }}
//           transition={{
//             duration: 6,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//         />
//       </div>

//       {/* Right Spline Viewer */}
//       <div className="absolute right-0 top-0 h-full w-1/2 max-w-[1000px] max-h-[800px] md:w-[45%] sm:w-[60%] xs:w-[90%]">
//         <spline-viewer
//           url="https://prod.spline.design/m-8d-MxC0lhpf3BE/scene.splinecode"
//           hideSplineLogo="true"
//         />
//       </div>
//     </div>
//   );
// }
import { motion } from "framer-motion";
import BlurText from "./text";
import Button from "./buttonpre";
import { Link } from "react-router-dom";
import '../../styles/fonts.css';

const handleAnimationComplete = () => {
  console.log('Animation completed!');
};

export function PreHeading() {
  return (
    <div className="relative w-screen h-screen bg-[#e3e3e3] bg-cover bg-center z-40 overflow-hidden">
      {/* Left Floating Image */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-auto 
                    w-1/2 max-w-[700px] max-h-[900px] 
                    md:w-[55%] sm:w-[60%] 
                    xs:w-[80%] z-10">
        <motion.img
          src="/blob.png"
          alt="Left side illustration"
          className="w-full h-auto object-contain opacity-70"
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
          className="text-sm sm:text-sm md:text-base lg:text-lg 
                    text-black opacity-0 
                    mt-2 sm:mt-4 text-left 
                    ml-2 sm:ml-6 mb-4 
                    font-satoshi font-regular
                    pr-2 sm:pr-0"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
        >
          Step into the future with QAI — a powerful AI course designed for Indian school students. Learn to study smarter, understand Artificial Intelligence, and build skills that matter.
          <br />
          <Link to="/login">
            <div className="mt-4 sm:mt-6">
              <Button />
            </div>
          </Link>
        </motion.p>
      </div>
      
      {/* Right Spline Viewer */}
      <div className="absolute 
                    right-0 bottom-0 sm:top-0 
                    h-1/2 sm:h-full 
                    w-full sm:w-1/2 
                    max-w-[1000px] max-h-[800px]
                    md:w-[45%] sm:w-[60%] 
                    z-0">
        <spline-viewer
          url="https://prod.spline.design/7E53giVz8ZZrrWXb/scene.splinecode"
          hideSplineLogo="true"
        />
      </div>
    </div>
  );
}