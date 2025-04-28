import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const SPRING_OPTIONS = {
  mass: 1.5,
  stiffness: 500,
  damping: 100,
};

const NeuFollowButton = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, SPRING_OPTIONS);
  const ySpring = useSpring(y, SPRING_OPTIONS);

  const transform = useMotionTemplate`translateX(${xSpring}px) translateY(${ySpring}px)`;

  const handleMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;

    const { height, width } = ref.current.getBoundingClientRect();
    const { offsetX, offsetY } = e.nativeEvent;

    const xPct = offsetX / width;
    const yPct = 1 - offsetY / height;

    const newY = 12 + yPct * 12;
    const newX = 12 + xPct * 12;

    x.set(newX);
    y.set(-newY);
  };

  const handleReset = () => {
    x.set(0);
    y.set(0);
  };

  // Define a properly typed motion component
  const MotionDiv = motion.div as React.ComponentType<
    React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }
  >;

  return (
    <section className="pl-6 pr-6 py-6">
      <div className="mx-auto h-20 w-full max-w-145 bg-[#e3e3e3]">
        <MotionDiv
          ref={ref}
          style={{
            transform: transform as unknown as React.CSSProperties['transform'],
          }}
          onMouseMove={handleMove}
          onMouseLeave={handleReset}
          onClick={handleReset}
          className="group flex h-full w-full items-center justify-between border-2 text-white border-black bg-gradient-to-br from-purple-400 from-40% to-indigo-400 px-8 text-xl font-semibold cursor-pointer"
        >
          <Copy>COMMUNITY!</Copy>
          <Arrow />
        </MotionDiv>
      </div>
    </section>
  );
};

const Copy = ({ children }: { children: string }) => {
  return (
    <span className="relative overflow-hidden">
      <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
        {children}
      </span>
      <span className="absolute left-0 top-0 block translate-y-full transition-transform duration-300 group-hover:translate-y-0">
        {children}
      </span>
    </span>
  );
};

const Arrow = () => (
  <div className="pointer-events-none flex h-6 w-6 overflow-hidden text-2xl">
    <FiArrowRight className="shrink-0 -translate-x-full text-black transition-transform duration-300 group-hover:translate-x-0" />
    <FiArrowRight className="shrink-0 -translate-x-full transition-transform duration-300 group-hover:translate-x-0" />
  </div>
);

export default NeuFollowButton;