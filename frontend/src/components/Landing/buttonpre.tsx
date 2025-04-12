
import { motion } from "framer-motion";


const Button = () => {
  return (
    
      <MarqueeButton>Start your journey!</MarqueeButton>
    
  );
};

const MarqueeButton = ({ children }: { children: string }) => {
  return (
    <motion.button
      whileHover={{
        scale: 1.05,
      }}
      whileTap={{
        scale: 0.95,
      }}
      className="relative overflow-hidden rounded-full bg-gradient-to-br from-purple-400 from-40% to-indigo-400 p-4 text-xl font-black uppercase text-black mt-10"
    >
      <motion.span
        className="block"
        initial={{ x: "0%" }}
        animate={{
          x: "calc(-100% - 6px)",
        }}
        transition={{
          ease: "linear",
          duration: 5,
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        {children} •{" "}
      </motion.span>

      <motion.span
        initial={{ x: "calc(-100% - 6px)" }}
        animate={{
          x: "calc(-200% - 12px)",
        }}
        transition={{
          ease: "linear",
          duration: 5,
          repeat: Infinity,
          repeatType: "loop",
        }}
        className="absolute left-4 top-4 block"
      >
        {children} •
      </motion.span>
      <motion.span
        initial={{ x: "calc(100% + 6px)" }}
        animate={{
          x: "0%",
        }}
        transition={{
          ease: "linear",
          duration: 5,
          repeat: Infinity,
          repeatType: "loop",
        }}
        className="absolute left-4 top-4 block"
      >
        {children} •
      </motion.span>
      <motion.span
        initial={{ x: "calc(200% + 12px)" }}
        animate={{
          x: "calc(100% + 6px)",
        }}
        transition={{
          ease: "linear",
          duration: 5,
          repeat: Infinity,
          repeatType: "loop",
        }}
        className="absolute left-4 top-4 block"
      >
        {children} •
      </motion.span>
    </motion.button>
  );
};

export default Button;