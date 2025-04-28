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
  const [position, setPosition] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const shiftLeft = () => {
    if (position > 0) setPosition((pv) => pv - 1);
  };

  const shiftRight = () => {
    if (position < features.length - 1) setPosition((pv) => pv + 1);
  };

  useEffect(() => {
    setPosition(1);
  }, []);

  return (
    <section className="overflow-x-hidden px-2 py-8 md:px-0 md:py-12 w-full">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 md:mb-8">
          <h2 className="text-3xl md:text-4xl font-bold leading-[1.2] md:text-5xl">
            Course. <span className="text-[#e0b0ff]">overview.</span>
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative h-[340px] sm:h-[360px] md:h-[380px] w-full overflow-x-hidden">
          <div className="absolute inset-0 flex justify-center items-center">
            {features.map((feat, index) => {
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

        {/* Navigation Buttons */}
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

interface FeatureCardProps {
  title: string;
  description: string;
  Icon: React.ComponentType;
  isFocused: boolean;
  position: number;
  isMobile: boolean;
}

const FeatureCard = ({ title, description, Icon, isFocused, position, isMobile }: FeatureCardProps) => {
  let xPosition, scale, opacity, zIndex;

  if (isMobile) {
    if (position === 0) {
      xPosition = "0%";
      scale = 1;
      opacity = 1;
      zIndex = 30;
    } else if (position === -1) {
      xPosition = "-80%";
      scale = 0.9;
      opacity = 0.8;
      zIndex = 20;
    } else if (position === 1) {
      xPosition = "80%";
      scale = 0.9;
      opacity = 0.8;
      zIndex = 20;
    } else {
      xPosition = position < 0 ? "-150%" : "150%";
      scale = 0.8;
      opacity = 0;
      zIndex = 10;
    }
  } else {
    if (position === 0) {
      xPosition = "0%";
      scale = 1;
      opacity = 1;
      zIndex = 30;
    } else if (position === -1) {
      xPosition = "-45%";
      scale = 0.9;
      opacity = 0.9;
      zIndex = 20;
    } else if (position === 1) {
      xPosition = "45%";
      scale = 0.9;
      opacity = 0.9;
      zIndex = 20;
    } else if (position === -2) {
      xPosition = "-90%";
      scale = 0.8;
      opacity = 0.7;
      zIndex = 10;
    } else if (position === 2) {
      xPosition = "90%";
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

  const springTransition = {
    type: "spring",
    stiffness: 280,
    damping: 28,
    mass: 1.2
  };

  const cardWidthClass = isMobile
    ? "w-[280px] max-w-[90vw] sm:w-[320px]"
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
      <div className="absolute right-2 top-2 text-5xl md:text-7xl text-[#e0b0ff] opacity-20">
        <Icon />
      </div>
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
    description: "Introduction to artificial intelligence, its history, and fundamental concepts...",
  },
  {
    title: "AI in Everyday Life",
    Icon: FiTarget,
    description: "Discover how AI is already integrated into your daily activities...",
  },
  {
    title: "Smart Study with AI Tools",
    Icon: FiTool,
    description: "Learn to leverage AI tools for more effective learning and productivity...",
  },
  {
    title: "Basics of Machine Learning",
    Icon: FiCpu,
    description: "Understand the core principles of machine learning without complex math...",
  },
  {
    title: "Data & Decision Making",
    Icon: FiDatabase,
    description: "Explore how data drives AI systems and influences decision-making...",
  },
  {
    title: "Ethics & AI",
    Icon: FiShield,
    description: "Navigate the ethical considerations of AI development and use...",
  },
  {
    title: "Real-World Use Cases",
    Icon: FiLink,
    description: "Examine how AI is solving real problems across industries...",
  },
  {
    title: "Mini Projects",
    Icon: FiCode,
    description: "Get hands-on experience with guided AI mini-projects that require no coding...",
  },
  {
    title: "AI Careers",
    Icon: FiArrowUp,
    description: "Explore diverse career opportunities in the AI field...",
  },
  {
    title: "Final Quiz & Recap",
    Icon: FiTarget,
    description: "Test your knowledge with a comprehensive quiz covering all course topics...",
  },
  {
    title: "Bonus AI Resources",
    Icon: FiBook,
    description: "Access additional learning materials including books, podcasts, and communities...",
  },
  {
    title: "Certification",
    Icon: FiAward,
    description: "Complete the course requirements to earn your AI literacy certification...",
  }
];
