import  { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";
import '../../styles/fonts.css';

const BasicFAQ = () => {
  return (
    <div className="relative px-4 py-12 overflow-hidden">
      {/* Floating PNG */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        {...{className:"absolute left-0 top-10 w-58 opacity-60 pointer-events-none z-0"}}
      >
        <img
          src="/purplesphere.png" // image path from public folder
          alt="FAQ Float"
          className="w-full h-full"
        />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-3xl">
        <h3 className="mb-4 text-center text-3xl font-satoshi font-bold">
          Frequently asked questions
        </h3>
        <Question title="Do I need any coding background?" defaultOpen>
          <p className="font-satoshi font-regular">
          Not at all! This course is built for absolute beginners
          </p>
        </Question>
        <Question title="Can I access the course anytime?">
          <p>
          Yes, once enrolled, you get full lifetime access.
          </p>
        </Question>
        <Question title="Is it suitable for all boards?">
          <p>
          Yes, it aligns with CBSE, ICSE, and state board levels.
          </p>
        </Question>
        <Question title="Do schools get support?">
          <p>
          100%. We provide onboarding, training, and live support,
          </p>
        </Question>
      </div>
    </div>
  );
};

interface QuestionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Question = ({ title, children, defaultOpen = false }: QuestionProps) => {
  const [ref, { height }] = useMeasure();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div
      animate={open ? "open" : "closed"}
      {...{className:"border-b-[1px] border-b-slate-300 font-satoshi font-regular"}}
    >
      <button
        onClick={() => setOpen((pv) => !pv)}
        className="flex w-full items-center justify-between gap-4 py-6"
      >
        <motion.span
          variants={{
            open: {
              color: "rgba(3, 6, 23, 0)",
            },
            closed: {
              color: "rgba(3, 6, 23, 1)",
            },
          }}
          {...{className:"bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-left text-lg font-medium"}}
        >
          {title}
        </motion.span>
        <motion.span
          variants={{
            open: {
              rotate: "180deg",
              color: "rgb(124 58 237)",
            },
            closed: {
              rotate: "0deg",
              color: "#030617",
            },
          }}
        >
          <FiChevronDown className="text-2xl" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: open ? height : "0px",
          marginBottom: open ? "24px" : "0px",
        }}
        {...{className :"overflow-hidden text-slate-600"}}
      >
        <p ref={ref}>{children}</p>
      </motion.div>
    </motion.div>
  );
};

export default BasicFAQ;
