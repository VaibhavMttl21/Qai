import { motion } from "framer-motion";
import '../../styles/fonts.css';

export const DrawCircleText = () => {
  return (
    <div className="relative flex justify-center items-center px-4 py-24 lg:py-60 text-black overflow-hidden">
      {/* Base solid background color */}
      <div className="absolute inset-0 z-0" style={{ backgroundColor: "#e3e3e3" }} />

      {/* Fading SVG grid pattern */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' fill='none' stroke='%239ca3af' stroke-width='1.5'%3E%3Cpath d='M0 0H32V32'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "32px 32px",
          WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
        }}
      />

      {/* Floating PNG behind text (Top-Right) */}
      <motion.img
        src="/greendonut.png"
        alt="Floating decoration"
        className="absolute top-0 right-0 w-32 md:w-[28rem] opacity-80 pointer-events-none z-20"
        animate={{ y: [0, -20, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Top-Left PNG with left-right motion */}
      <motion.img
        src="/cone.png"
        alt="Top Left Motion"
        className="absolute top-30 left-50 w-40 md:w-60 opacity-80 z-20"
        animate={{ x: [0, 20, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Middle PNG with rotation */}
      <motion.img
        src="/orangecone.png"
        alt="Middle Rotating"
        className="absolute top-95 left-200 w-40 md:w-60 opacity-100 pointer-events-none z-20"
        animate={{ rotate: [0, 360] }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Bottom-Left PNG with up-down motion */}
      <motion.img
        src="/purplesphere.png"
        alt="Bottom Left Motion"
        className="absolute bottom-4 left-20 w-40 md:w-64 opacity-80 z-20"
        animate={{ y: [0, -20, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main Text with fade-in + blur animation (repeats on scroll) */}
      <motion.h1
        initial={{ y: 100, opacity: 0, filter: "blur(8px)" }}
        whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: false, amount: 0.6 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-20 max-w-3xl px-4 text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-snug font-satoshi font-regular"
      >
        To get ready for the{" "}
        <span className="relative inline-block">
          future of AI
          <svg
            viewBox="0 0 286 73"
            fill="none"
            className="absolute -left-2 -right-2 -top-2 bottom-0 translate-y-1"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{
                duration: 1.25,
                ease: "easeInOut",
              }}
              d="M142.293 1C106.854 16.8908 6.08202 7.17705 1.23654 43.3756C-2.10604 68.3466 29.5633 73.2652 122.688 71.7518C215.814 70.2384 316.298 70.689 275.761 38.0785C230.14 1.37835 97.0503 24.4575 52.9384 1"
              stroke="#FACC15"
              strokeWidth="3"
            />
          </svg>
        </span>{" "}
        and give knowledge to kids about AI
      </motion.h1>
    </div>
  );
};
