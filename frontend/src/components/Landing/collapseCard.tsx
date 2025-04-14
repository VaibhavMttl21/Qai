// import { motion } from "framer-motion";
// import { useState } from "react";
// import {
//   FiArrowUp,
//   FiChevronLeft,
//   FiChevronRight,
//   FiLink,
//   FiTarget,
//   FiTool,
//   FiUpload,
// } from "react-icons/fi";

// const CollapseCardFeatures = () => {
//   const [position, setPosition] = useState(0);

//   const shiftLeft = () => {
//     if (position > 0) {
//       setPosition((pv) => pv - 1);
//     }
//   };

//   const shiftRight = () => {
//     if (position < features.length - 1) {
//       setPosition((pv) => pv + 1);
//     }
//   };

//   return (
//     <section className="overflow-hidden px-4 py-12">
//       <div className="mx-auto max-w-6xl">
//         <div className="mb-8 flex justify-between gap-4">
//           <h2 className="text-4xl font-bold leading-[1.2] md:text-5xl">
//             Course. <span className="text-[#e0b0ff]">overview.</span>
//           </h2>
//           <div className="flex gap-2">
//             <button
//               className="glass-nav h-fit bg-gradient-to-br from-black/80 to-black/70 p-4 text-2xl text-white transition-colors hover:bg-neutral-700"
//               onClick={shiftLeft}
//             >
//               <FiChevronLeft />
//             </button>
//             <button
//               className="h-fit bg-gradient-to-br from-black/80 to-black/70 p-4 text-2xl text-white transition-colors hover:bg-neutral-700"
//               onClick={shiftRight}
//             >
//               <FiChevronRight />
//             </button>
//           </div>
//         </div>
//         <div className="flex gap-4">
//           {features.map((feat, index) => (
//             <Feature {...feat} key={index} position={position} index={index} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// const Feature = ({ position, index, title, description, Icon }) => {
//   const translateAmt =
//     position >= index ? index * 100 : index * 100 - 100 * (index - position);

//   return (
//     <motion.div
//       animate={{ x: `${-translateAmt}%` }}
//       transition={{
//         ease: "easeInOut",
//         duration: 0.35,
//       }}
//       className={`relative flex min-h-[250px] w-10/12 max-w-lg shrink-0 flex-col justify-between overflow-hidden p-8 shadow-lg md:w-3/5 ${
//         index % 2 ? "bg-[#e0b0ff] text-white" : " bg-white"
//       }`}
//     >
//       <Icon className="absolute right-2 top-2 text-7xl opacity-20" />
//       <h3 className="mb-8 text-3xl font-bold">{title}</h3>
//       <p>{description}</p>
//     </motion.div>
//   );
// };

// export default CollapseCardFeatures;

// const features = [
//   {
//     title: "What is AI",
//     Icon: FiTarget,
//     description:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe deserunt ipsum rerum natus fugit ex minima voluptas ratione quaerat. Ea!",
//   },
//   {
//     title: "AI in Everday life",
//     Icon: FiArrowUp,
//     description:
//       "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sint, vitae sed? Maxime!",
//   },
//   {
//     title: "Smart study with AI tools",
//     Icon: FiTarget,
//     description:
//       "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo ab perspiciatis earum quibusdam laudantium non nihil nesciunt?",
//   },
//   {
//     title: "Basics of Machine Learning",
//     Icon: FiLink,
//     description:
//       "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Autem explicabo nobis officia, nostrum eligendi accusamus unde ad cumque, magnam deleniti adipisci fugiat facere. Veniam?",
//   },
//   {
//     title: "Data & Decision Making",
//     Icon: FiTool,
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima, saepe quo!",
//   },
//   {
//     title: "Ethics & AI",
//     Icon: FiLink,
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima, saepe quo!",
//   },
//   {
//     title: "Real-World Use Cases",
//     Icon: FiLink,
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima, saepe quo!",
//   },
//   {
//     title: "Mini Projects",
//     Icon: FiTool,
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima, saepe quo!",
//   },
//   {
//     title: "AI Careers",
//     Icon: FiArrowUp,
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima, saepe quo!",
//   },
//   {
//     title: "Final Quiz & recap",
//     Icon: FiTool,
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima, saepe quo!",
//   },
//   {
//     title: "Bonus AI Recap",
//     Icon: FiTool,
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima, saepe quo!",
//   },
//   {
//     title: "Certification",
//     Icon: FiArrowUp,
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima, saepe quo!",
//   }

// ];

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FiArrowUp,
  FiChevronLeft,
  FiChevronRight,
  FiLink,
  FiTarget,
  FiTool,
  FiBook,
  FiCpu,
  FiDatabase,
  FiCode,
  FiShield,
  FiAward
} from "react-icons/fi";

const CollapseCardFeatures = () => {
  // Start with position 1 so there's content on the left
  const [position, setPosition] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Handle screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on initial load
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const shiftLeft = () => {
    if (position > 0) {
      setPosition((pv) => pv - 1);
    }
  };

  const shiftRight = () => {
    if (position < features.length - 1) {
      setPosition((pv) => pv + 1);
    }
  };

  // Make sure we have content on the left side initially
  useEffect(() => {
    setPosition(1);
  }, []);

  return (
    <section className="overflow-visible px-2 py-8 md:px-0 md:py-12 w-full">
      <div className="mx-auto w-full">
        <div className="mb-6 md:mb-8">
          <h2 className="text-3xl md:text-4xl font-bold leading-[1.2] md:text-5xl">
            Course. <span className="text-[#e0b0ff]">overview.</span>
          </h2>
        </div>
        
        {/* Carousel container with responsive height */}
        <div className="relative h-[340px] sm:h-[360px] md:h-[380px] w-full">
          {/* Card container */}
          <div className="absolute inset-0 flex justify-center">
            {/* Visible cards based on position */}
            {features.map((feat, index) => {
              // Only render cards near the current position
              if (Math.abs(index - position) > (isMobile ? 1 : 2)) return null;
              
              return (
                <FeatureCard
                  key={index}
                  {...feat}
                  isFocused={index === position}
                  position={index - position}
                  isMobile={isMobile}
                />
              );
            })}
          </div>
        </div>
        
        {/* Navigation buttons - fixed at bottom center */}
        <div className="mt-4 flex justify-center gap-4">
          <button
            className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-[#e0b0ff]/90 to-[#e0b0ff]/70 flex items-center justify-center text-xl md:text-2xl text-white transition-all duration-300 hover:bg-[#d0a0ef] hover:shadow-lg disabled:opacity-50"
            onClick={shiftLeft}
            disabled={position === 0}
          >
            <FiChevronLeft />
          </button>
          <button
            className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-[#e0b0ff]/90 to-[#e0b0ff]/70 flex items-center justify-center text-xl md:text-2xl text-white transition-all duration-300 hover:bg-[#d0a0ef] hover:shadow-lg disabled:opacity-50"
            onClick={shiftRight}
            disabled={position === features.length - 1}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ title, description, Icon, isFocused, position, isMobile }) => {
  // Dynamic positioning based on screen size
  let xPosition, scale, opacity, zIndex;
  
  // Different positioning for mobile vs desktop
  if (isMobile) {
    // Mobile layout (fewer cards showing)
    if (position === 0) {
      xPosition = "0%";
      scale = 1;
      opacity = 1;
      zIndex = 30;
    } else if (position === -1) {
      xPosition = "-75%";
      scale = 0.9;
      opacity = 0.8;
      zIndex = 20;
    } else if (position === 1) {
      xPosition = "75%";
      scale = 0.9;
      opacity = 0.8;
      zIndex = 20;
    } else {
      // Hide cards that are too far
      xPosition = position < 0 ? "-150%" : "150%";
      scale = 0.8;
      opacity = 0;
      zIndex = 10;
    }
  } else {
    // Desktop layout (more cards showing)
    if (position === 0) {
      // Center card (focused)
      xPosition = "0%";
      scale = 1;
      opacity = 1;
      zIndex = 30;
    } else if (position === -1) {
      // Left card
      xPosition = "-45%"; // Moved closer to center
      scale = 0.9;
      opacity = 0.9;
      zIndex = 20;
    } else if (position === 1) {
      // Right card
      xPosition = "45%"; // Moved closer to center
      scale = 0.9;
      opacity = 0.9;
      zIndex = 20;
    } else if (position === -2) {
      // Far left card
      xPosition = "-90%"; // Moved closer to view
      scale = 0.8;
      opacity = 0.7;
      zIndex = 10;
    } else if (position === 2) {
      // Far right card
      xPosition = "90%"; // Moved closer to view
      scale = 0.8;
      opacity = 0.7;
      zIndex = 10;
    } else {
      xPosition = position < 0 ? "-150%" : "150%";
      scale = 0.7;
      opacity = 0;
      zIndex = 5;
    }
  }

  // Animation settings - smoother spring
  const springTransition = {
    type: "spring",
    stiffness: 280,
    damping: 28,
    mass: 1.2
  };

  // Responsive card width
  const cardWidthClass = isMobile 
    ? "w-[280px] sm:w-[320px]" 
    : "w-[320px] md:w-[340px] lg:w-[380px]";

  return (
    <motion.div
      initial={false}
      animate={{
        x: xPosition,
        scale: scale,
        opacity: opacity
      }}
      transition={springTransition}
      style={{ 
        zIndex: zIndex,
        position: "absolute",
        filter: isFocused ? "none" : `blur(${position === -1 || position === 1 ? "2px" : "4px"})`,
        boxShadow: isFocused 
          ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
          : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      }}
      className={`${cardWidthClass} mx-auto flex flex-col justify-between min-h-[300px] p-6 md:p-8 rounded-xl transform transition-all bg-white`}
    >
      <Icon className="absolute right-2 top-2 text-5xl md:text-7xl text-[#e0b0ff] opacity-20" />
      <h3 className="mb-3 md:mb-4 text-2xl md:text-3xl font-bold text-[#333]">{title}</h3>
      <p className="text-sm md:text-base text-[#555]">{description}</p>
    </motion.div>
  );
};

export default CollapseCardFeatures;

const features = [
  {
    title: "What is AI",
    Icon: FiBook,
    description:
      "Introduction to artificial intelligence, its history, and fundamental concepts. Learn how AI is transforming industries and why understanding it is crucial in today's digital landscape.",
  },
  {
    title: "AI in Everyday Life",
    Icon: FiTarget,
    description:
      "Discover how AI is already integrated into your daily activities. From virtual assistants and recommendation systems to smart home devices and navigation apps - see AI's practical applications.",
  },
  {
    title: "Smart Study with AI Tools",
    Icon: FiTool,
    description:
      "Learn to leverage AI tools for more effective learning and productivity. Explore language models, research assistants, summarization tools, and how to prompt AI systems to get the best results.",
  },
  {
    title: "Basics of Machine Learning",
    Icon: FiCpu,
    description:
      "Understand the core principles of machine learning without complex math. Learn about supervised and unsupervised learning, training data, and how algorithms find patterns to make predictions.",
  },
  {
    title: "Data & Decision Making",
    Icon: FiDatabase,
    description:
      "Explore how data drives AI systems and influences decision-making. Discover the importance of data quality, potential biases, and how to think critically about AI-generated recommendations.",
  },
  {
    title: "Ethics & AI",
    Icon: FiShield,
    description:
      "Navigate the ethical considerations of AI development and use. Discuss privacy concerns, algorithmic bias, transparency issues, and the importance of responsible AI development.",
  },
  {
    title: "Real-World Use Cases",
    Icon: FiLink,
    description:
      "Examine how AI is solving real problems across industries including healthcare, education, transportation, and environmental conservation. Learn from successful implementations and their impact.",
  },
  {
    title: "Mini Projects",
    Icon: FiCode,
    description:
      "Get hands-on experience with guided AI mini-projects that require no coding. Create a simple chatbot, design a recommendation system, and analyze image recognition results.",
  },
  {
    title: "AI Careers",
    Icon: FiArrowUp,
    description:
      "Explore diverse career opportunities in the AI field. From technical roles like AI engineers to non-technical positions like AI ethicists and product managers - find where you might fit in.",
  },
  {
    title: "Final Quiz & Recap",
    Icon: FiTarget,
    description:
      "Test your knowledge with a comprehensive quiz covering all course topics. Reinforce key concepts and identify areas for further exploration with a guided recap of the most important lessons.",
  },
  {
    title: "Bonus AI Resources",
    Icon: FiBook,
    description:
      "Access additional learning materials including recommended books, online courses, podcasts, and communities. Continue your AI education journey with carefully curated resources for all levels.",
  },
  {
    title: "Certification",
    Icon: FiAward,
    description:
      "Complete the course requirements to earn your AI literacy certification. Showcase your knowledge of AI fundamentals, applications, and ethical considerations to enhance your professional profile.",
  }
];