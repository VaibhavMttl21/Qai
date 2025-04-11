import { motion } from "framer-motion";

export const BusRevealText = () => {
  return (
    <div className="relative w-full h-screen bg-gradient-to-r from-blue-100 to-yellow-50 overflow-hidden flex items-center justify-start px-10">
      {/* The text revealed behind the bus */}
      <h1 className="absolute text-5xl font-bold text-black z-0">
        Welcome to the AI Bus Adventure!
      </h1>

      {/* White overlay to hide the text initially */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "100%" }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 h-full w-full bg-white z-10"
      >
        {/* The bus inside the moving overlay */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 text-5xl">
          🚌
        </div>
      </motion.div>
    </div>
  );
};
