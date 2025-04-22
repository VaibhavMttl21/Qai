// import React, { useState, useRef, useEffect } from 'react';

// export default function AnimatedParallaxSection() {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
//   const leftButtonRef = useRef<HTMLButtonElement>(null);
//   const rightButtonRef = useRef<HTMLButtonElement>(null);
//   const [headingOffset, setHeadingOffset] = useState(0);
  
//   const content = [
//     {
//       heading: "About Us",
//       text: "We are a dynamic team of creative professionals dedicated to delivering exceptional results. With years of industry experience, we bring fresh perspectives and innovative solutions to every project we undertake.",
//       position: "left"
//     },
//     {
//       heading: "Our Vision",
//       text: "Our vision is to transform the digital landscape through cutting-edge technology and design. We strive to create meaningful experiences that connect brands with their audiences in authentic and impactful ways.",
//       position: "right"
//     },
//     {
//       heading: "Why Choose Us",
//       text: "We combine technical expertise with creative flair to deliver solutions that exceed expectations. Our collaborative approach ensures that your unique needs and goals are at the center of everything we do.",
//       position: "left"
//     },
//     {
//       heading: "We Are Better",
//       text: "Our commitment to excellence sets us apart. We don't just meet industry standards - we set them. With a focus on innovation, quality, and client satisfaction, we deliver results that speak for themselves.",
//       position: "right"
//     }
//   ];

//   // Continuous movement animation for heading
//   useEffect(() => {
//     let animationFrame: number;
//     let direction = 1;
//     let lastTimestamp = 0;
    
//     const animate = (timestamp: number) => {
//       if (!lastTimestamp) lastTimestamp = timestamp;
//       const elapsed = timestamp - lastTimestamp;
      
//       // Control speed of the animation
//       if (elapsed > 50) {
//         lastTimestamp = timestamp;
//         setHeadingOffset(prev => {
//           // Reverse direction when reaching boundaries
//           if (prev > 15) direction = -1;
//           if (prev < -15) direction = 1;
          
//           return prev + direction * 0.8;
//         });
//       }
      
//       animationFrame = requestAnimationFrame(animate);
//     };
    
//     animationFrame = requestAnimationFrame(animate);
    
//     return () => {
//       cancelAnimationFrame(animationFrame);
//     };
//   }, []);

//   // Track mouse position with higher precision for button hover effects
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       setCursorPosition({ x: e.clientX, y: e.clientY });
//     };

//     window.addEventListener('mousemove', handleMouseMove);
//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//     };
//   }, []);

//   // Enhanced button hover effect with more sensitivity
//   useEffect(() => {
//     const leftButton = leftButtonRef.current;
//     const rightButton = rightButtonRef.current;

//     if (leftButton && rightButton) {
//       const applyHoverEffect = (button: HTMLElement) => {
//         const rect = button.getBoundingClientRect();
//         const buttonCenterX = rect.left + rect.width / 2;
//         const buttonCenterY = rect.top + rect.height / 2;
        
//         const distance = Math.sqrt(
//           Math.pow(cursorPosition.x - buttonCenterX, 2) + 
//           Math.pow(cursorPosition.y - buttonCenterY, 2)
//         );
        
//         // Increased sensitivity range and effect strength
//         if (distance < 150) {
//           const strength = 0.4; // Increased from 0.2
//           const translateX = (cursorPosition.x - buttonCenterX) * strength;
//           const translateY = (cursorPosition.y - buttonCenterY) * strength;
//           button.style.transform = `translate(${translateX}px, ${translateY}px)`;
//         } else {
//           button.style.transform = 'translate(0, 0)';
//         }
//       };
      
//       applyHoverEffect(leftButton);
//       applyHoverEffect(rightButton);
//     }
//   }, [cursorPosition]);

//   const goToPrevious = () => {
//     setActiveIndex((prev) => (prev === 0 ? content.length - 1 : prev - 1));
//   };

//   const goToNext = () => {
//     setActiveIndex((prev) => (prev === content.length - 1 ? 0 : prev + 1));
//   };

//   return (
//     <div className="w-full min-h-screen bg-gray-900 text-white font-sans p-4 overflow-hidden">
//       <div className="max-w-6xl mx-auto relative">
//         {/* Heading with continuous movement */}
//         <div 
//           className={`mb-8 transform transition-all duration-700 ${
//             content[activeIndex].position === 'left' 
//               ? 'translate-x-0' 
//               : 'translate-x-12 md:translate-x-24'
//           }`}
//           style={{ transform: `translateX(${headingOffset}px)` }}
//         >
//           <div 
//             className={`inline-block ${
//               content[activeIndex].position === 'left' ? 'bg-purple-700' : 'bg-blue-700'
//             } transform skew-x-12 py-4 px-8 md:px-12 transition-all duration-500`}
//           >
//             <h1 className="text-2xl md:text-4xl font-extrabold transform -skew-x-12">
//               {content[activeIndex].heading}
//             </h1>
//           </div>
//         </div>
        
//         {/* Content */}
//         <div 
//           className={`mb-12 transform transition-all duration-700 ${
//             content[activeIndex].position === 'left' ? 'translate-x-4' : '-translate-x-4'
//           }`}
//           style={{ transform: `translateX(${headingOffset * 0.5}px)` }}
//         >
//           <div className="bg-gray-800 transform skew-x-12 p-6 md:p-8">
//             <p className="transform -skew-x-12 text-base md:text-lg">
//               {content[activeIndex].text}
//             </p>
//           </div>
//         </div>
        
//         {/* Navigation Buttons */}
//         <div className="flex justify-between items-center mt-6">
//           <button
//             ref={leftButtonRef}
//             onClick={goToPrevious}
//             className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-lg transition-all duration-300 hover:scale-110 relative z-10"
//           >
//             &larr; Previous
//           </button>
          
//           <button
//             ref={rightButtonRef}
//             onClick={goToNext}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-lg transition-all duration-300 hover:scale-110 relative z-10"
//           >
//             Next &rarr;
//           </button>
//         </div>
        
//         {/* Indicators */}
//         <div className="flex justify-center mt-8">
//           {content.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setActiveIndex(index)}
//               className={`h-3 w-3 mx-1 rounded-full transition-all duration-300 ${
//                 index === activeIndex ? 'bg-white scale-125' : 'bg-gray-500'
//               }`}
//               aria-label={`Go to slide ${index + 1}`}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import { MotionValue, useScroll, motion, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { IconType } from "react-icons";
import {
  FiArrowRight,
  FiAward,
  FiCalendar,
  FiCopy,
  FiDatabase,
} from "react-icons/fi";

export const StickyCards = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  return (
    <>
      <div ref={ref} className="relative">
        {CARDS.map((c, idx) => (
          <Card
            key={c.id}
            card={c}
            scrollYProgress={scrollYProgress}
            position={idx + 1}
          />
        ))}
      </div>
      {/* <div className="h-screen bg-black" /> */}
    </>
  );
};

interface CardProps {
  position: number;
  card: CardType;
  scrollYProgress: MotionValue;
}

const Card = ({ position, card, scrollYProgress }: CardProps) => {
  const scaleFromPct = (position - 1) / CARDS.length;
  const y = useTransform(scrollYProgress, [scaleFromPct, 1], [0, -CARD_HEIGHT]);

  const isOddCard = position % 2;

  return (
    <motion.div
      style={{
        height: CARD_HEIGHT,
        y: position === CARDS.length ? undefined : y,
        background: isOddCard ? "#e3e3e3" : "white",
        color: isOddCard ? "black" : "black",
      }}
      className="sticky top-0 flex w-full origin-top flex-col items-center justify-center px-4"
    >
      <card.Icon className="mb-4 text-4xl" />
      <h3 className="mb-6 text-center text-4xl font-semibold md:text-6xl">
        {card.title}
      </h3>
      <p className="mb-8 max-w-lg text-center text-sm md:text-base">
        {card.description}
      </p>
      <a
        href={card.routeTo}
        className={`flex items-center gap-2 rounded px-6 py-4 text-base font-medium uppercase text-black transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 md:text-lg ${
          card.ctaClasses
        } ${
          isOddCard
            ? "shadow-[4px_4px_0px_white] hover:shadow-[8px_8px_0px_white]"
            : "shadow-[4px_4px_0px_black] hover:shadow-[8px_8px_0px_black]"
        }`}
      >
        <span>Learn more</span>
        <FiArrowRight />
      </a>
    </motion.div>
  );
};

const CARD_HEIGHT = 500;

type CardType = {
  id: number;
  Icon: IconType;
  title: string;
  description: string;
  ctaClasses: string;
  routeTo: string;
};

const CARDS: CardType[] = [
  {
    id: 1,
    Icon: FiCalendar,
    title: "About Us",
    description:
      "QAI makes Artificial Intelligence simple, fun, and practical for students from Class 6 to 12. Our course is built to prepare young minds for tomorrow’s world — through interactive lessons, real-world examples, and smart study strategies",
    ctaClasses: "bg-violet-300",
    routeTo: "#",
  },
  {
    id: 2,
    Icon: FiDatabase,
    title: "Our Mission",
    description:
      "AI education should be integrated into every classroom to equip students with modern learning tools. Simplifying AI through engaging, age-appropriate lessons will help schools deliver essential future-ready skills.",
    ctaClasses: "bg-pink-300",
    routeTo: "#",
  },
  {
    id: 3,
    Icon: FiCopy,
    title: "Join Us",
    description:
      "This course is ideal for students from Classes 6 to 12 who are eager to understand how AI works, enhance their study methods using modern tools, explore emerging career opportunities, and learn through fun and easy-to-understand lessons.",
    ctaClasses: "bg-red-300",
    routeTo: "#",
  },
  {
    id: 4,
    Icon: FiAward,
    title: "Why choose QAI",
    description:
      "Built by education and tech experts, this course is designed for a school-level understanding of AI. It is 100% online and mobile-friendly, making learning accessible anytime, anywhere. With fun quizzes, interactive projects, and practical tools, students stay engaged throughout the course. Upon completion, they receive a digital certificate, and full access is provided through a secure Learning Management System (LMS).",
    ctaClasses: "bg-amber-300",
    routeTo: "#",
  },
];