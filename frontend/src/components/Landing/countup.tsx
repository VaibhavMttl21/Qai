// import { useEffect, useRef } from "react";
// import { animate, useInView } from "framer-motion";

// export const CountUpStats = () => {
//   return (
//     <div className="relative mx-auto max-w-3xl px-4 py-16 sm:py-20 md:py-24">
//       {/* Rotating background PNG (Positioned on the right side) */}
//       <div
//         className="absolute top-10 inset-y-0 right-0 w-1/2 z-0 bg-no-repeat opacity-50"
//         style={{
//           backgroundImage: 'url("/Gemini.png")', // Replace with your PNG path
//           backgroundPosition: "right center",
//           animation: "rotateBg 30s linear infinite",
//         }}
//       ></div>

//       <div className="relative z-10">
//         <h2 className="mb-10 text-center text-sm font-medium text-indigo-900 sm:text-base md:text-lg md:mb-16">
//           THE GROWTH AND IMPACT OF
//           <span className="text-indigo-500"> AI</span>
//         </h2>

//         <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
//           <Stat
//             num={35.9}
//             decimals={1}
//             suffix="%"
//             subheading="growth-rate 2025–2035"
//           />
//           <div className="h-[1px] w-12 bg-indigo-200 sm:h-12 sm:w-[1px]" />
//           <Stat
//             num={638.23}
//             decimals={1}
//             suffix="B+"
//             subheading="Market size projected"
//           />
//           <div className="h-[1px] w-12 bg-indigo-200 sm:h-12 sm:w-[1px]" />
//           <Stat
//             num={15.7}
//             decimals={1}
//             suffix="T+"
//             subheading="Economic impact by 2030"
//           />
//         </div>
//       </div>

//       {/* Inline CSS for rotating background */}
//       <style>
//         {`
//           @keyframes rotateBg {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(-360deg); }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// interface StatProps {
//   num: number;
//   suffix: string;
//   decimals?: number;
//   subheading: string;
// }

// const Stat = ({ num, suffix, decimals = 0, subheading }: StatProps) => {
//   const ref = useRef<HTMLElement>(null);
//   const isInView = useInView(ref as React.RefObject<Element>);

//   useEffect(() => {
//     if (!isInView) return;

//     animate(0, num, {
//       duration: 2.5,
//       onUpdate(value) {
//         if (!ref.current) return;
//         ref.current.textContent = value.toFixed(decimals);
//       },
//     });
//   }, [num, decimals, isInView]);

//   return (
//     <div className="flex w-64 flex-col items-center py-8 sm:py-0">
//       <p className="mb-2 text-center text-5xl font-semibold sm:text-6xl md:text-7xl">
//         <span ref={ref}></span>
//         {suffix}
//       </p>
//       <p className="max-w-48 text-center text-sm text-neutral-600 sm:text-base">
//         {subheading}
//       </p>
//     </div>
//   );
// };

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export const CountUpStats = () => {
  return (
    <div className="relative mx-auto max-w-3xl px-4 py-16 sm:py-20 md:py-24">
      {/* Rotating background PNG (Positioned on the right side) */}
      <div
        className="absolute top-10 inset-y-0 right-0 w-1/2 z-0 bg-no-repeat opacity-50"
        style={{
          backgroundImage: 'url("/api/placeholder/400/400")', // Using placeholder for demo
          backgroundPosition: "right center",
          backgroundSize: "contain",
          transform: "rotate(0deg)",
          transformOrigin: "center",
          animation: "rotate 30s linear infinite",
        }}
      ></div>

      <div className="relative z-10">
        <h2 className="mb-10 text-center text-sm font-medium text-indigo-900 sm:text-base md:text-lg md:mb-16">
          THE GROWTH AND IMPACT OF
          <span className="text-indigo-500"> AI</span>
        </h2>

        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
          <Stat
            num={35.9}
            decimals={1}
            suffix="%"
            subheading="growth 2025–2035"
          />
          <div className="h-px w-12 bg-indigo-200 sm:h-12 sm:w-px" />
          <Stat
            num={638.23}
            decimals={1}
            suffix="B+"
            subheading="Market size projected"
          />
          <div className="h-px w-12 bg-indigo-200 sm:h-12 sm:w-px" />
          <Stat
            num={15.7}
            decimals={1}
            suffix="T+"
            subheading="Economic impact"
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
};

interface StatProps {
  num: number;
  suffix: string;
  decimals?: number;
  subheading: string;
}

const Stat = ({ num, decimals = 0, suffix, subheading }: StatProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let animationFrameId;
    
    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const duration = 2500; // 2.5 seconds in ms
      
      if (progress < duration) {
        const value = progress / duration * num;
        setDisplayValue(value.toFixed(decimals));
        animationFrameId = requestAnimationFrame(animateCount);
      } else {
        setDisplayValue(num.toFixed(decimals));
      }
    };
    
    animationFrameId = requestAnimationFrame(animateCount);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [num, decimals, isInView]);

  return (
    <div className="flex w-64 flex-col items-center py-8 sm:py-0">
      <p className="mb-2 text-center text-5xl font-semibold sm:text-6xl md:text-7xl">
        <span ref={ref}>{displayValue}</span>
        {suffix}
      </p>
      <p className="max-w-xs text-center text-sm text-neutral-600 sm:text-base">
        {subheading}
      </p>
    </div>
  );
};
