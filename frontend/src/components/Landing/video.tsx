import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import AnimatedList from "./scroll";
import { SpringCards } from "./cards";
import CollapseCardFeatures from "./collapseCard";

const ROTATION_RANGE = 35;
const HALF_ROTATION_RANGE = ROTATION_RANGE / 2;

const PERSPECTIVE = "1500px";



// export const Video = () => {
//   return (
//     <div
//       style={{
//         backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='%23d4d4d4'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
//       }}
//       className="relative h-[700px] bg-neutral-100 "
//     >
//       {/* <TiltShineCard /> */}
//     </div>
//   );
// };

export const Video = () => {
  return (
    <div
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='%23d4d4d4'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
      }}
      className="relative min-h-screen bg-neutral-100 flex items-center justify-center px-4 md:px-8 py-16"
    >
      <div className="max-w-4xl w-full flex flex-col items-center gap-6">
        {/* Video Section */}
        <div className="rounded-xl bg-slate-800 shadow-xl w-full">
          {/* Window-style Header */}
          <div className="flex gap-1.5 rounded-t-xl bg-slate-900 p-3">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>

          {/* Video Element */}
          <video
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            controls
            className="w-full h-64 sm:h-80 md:h-[400px] object-cover"
          />
        </div>

        {/* Spacing below video */}
        <div className="h-4" />

        {/* Text Section with Cards */}
        <div className="w-full px-2 sm:px-4">
          <CollapseCardFeatures />
          {/* <SpringCards /> */}
        </div>
      </div>
    </div>
  );
};

