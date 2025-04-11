import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiDollarSign, FiEye, FiPlay, FiSearch } from "react-icons/fi";
const Explain = () => {
  return (
    <div className="bg-gradient-to-b from-[#b65fcf] to-white"> 

     
        <SwapColumnFeatures />
    </div>
    
  );
};



const SwapColumnFeatures = () => {
  const [featureInView, setFeatureInView] = useState(features[0]);

  return (
    <section className="relative mx-auto max-w-7xl">
      <SlidingFeatureDisplay featureInView={featureInView} />

      {/* Offsets the height of SlidingFeatureDisplay so that it renders on top of Content to start */}
      <div className="-mt-[100vh] hidden md:block" />

      {features.map((s) => (
        <Content
          key={s.id}
          featureInView={s}
          setFeatureInView={setFeatureInView}
          {...s}
        />
      ))}
    </section>
  );
};

const SlidingFeatureDisplay = ({ featureInView }) => {
  return (
    <div
      style={{
        justifyContent:
          featureInView.contentPosition === "l" ? "flex-end" : "flex-start",
      }}
      className="pointer-events-none sticky top-0 z-10 hidden h-screen w-full items-center justify-center md:flex"
    >
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
        className="h-fit w-3/5 rounded-xl p-8"
      >
        <ExplainFeature featureInView={featureInView} />
      </motion.div>
    </div>
  );
};

const Content = ({ setFeatureInView, featureInView }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    margin: "-150px",
  });

  useEffect(() => {
    if (isInView) {
      setFeatureInView(featureInView);
    }
  }, [isInView]);

  return (
    <section
      ref={ref}
      className="relative z-0 flex h-fit md:h-screen"
      style={{
        justifyContent:
          featureInView.contentPosition === "l" ? "flex-start" : "flex-end",
      }}
    >
      <div className="grid h-full w-full place-content-center px-4 py-12 md:w-2/5 md:px-8 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <span className="rounded-full bg-[#800080] px-2 py-1.5 text-xs font-medium text-white"> 
          {/* indigo-600 */}
            {featureInView.callout}
          </span>
          <p className="my-3 text-5xl font-bold">{featureInView.title}</p>
          <p className="text-slate-600">{featureInView.description}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="mt-8 block md:hidden"
        >
          <ExplainFeature featureInView={featureInView} />
        </motion.div>
      </div>
    </section>
  );
};

const ExplainFeature = ({ featureInView }) => {
  return (
    <div className="relative h-96 w-full rounded-xl bg-slate-800 shadow-xl">
      <div className="flex w-full gap-1.5 rounded-t-xl bg-slate-900 p-3">
        <div className="h-3 w-3 rounded-full bg-red-500" />
        <div className="h-3 w-3 rounded-full bg-yellow-500" />
        <div className="h-3 w-3 rounded-full bg-green-500" />
      </div>
      <div className="p-2">
        <p className="font-mono text-sm text-slate-200">
          <span className="text-green-300">~</span> ABOUT US{" "}
          <span className="inline-block rounded bg-indigo-600 px-1 font-semibold">
            "{featureInView.title}"
          </span>{" "}
          means.
        </p>
      </div>

      <span className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] text-9xl text-slate-700">
        <featureInView.Icon />
      </span>
    </div>
  );
};

export default Explain;

const features = [
  {
    id: 1,
    callout: "humarey barein mei",
    title: "About us",
    description:
      "QAI makes Artificial Intelligence simple, fun, and practical for students from Class 6 to 12. Our course is built to prepare young minds for tomorrow’s world — through interactive lessons, real-world examples, and smart study strategies",
    contentPosition: "r",
    Icon: FiSearch,
  },
  {
    id: 2,
    callout: "Aim",
    title: "Our mission",
    description:
      "AI education should be integrated into every classroom to equip students with modern learning tools. Simplifying AI through engaging, age-appropriate lessons will help schools deliver essential future-ready skills.",
    contentPosition: "l",
    Icon: FiEye,
  },
 
  {
    id: 3,
    callout: "join us",
    title: "Who can join",
    description:
      "This course is ideal for students from Classes 6 to 12 who are eager to understand how AI works, enhance their study methods using modern tools, explore emerging career opportunities, and learn through fun and easy-to-understand lessons.",
    contentPosition: "r",
    Icon: FiPlay,
  },
  {
    id: 4,
    callout: "kyun nahi ?",
    title: "Why choose QAI!",
    description:
      "Built by education and tech experts, this course is designed for a school-level understanding of AI. It is 100% online and mobile-friendly, making learning accessible anytime, anywhere. With fun quizzes, interactive projects, and practical tools, students stay engaged throughout the course. Upon completion, they receive a digital certificate, and full access is provided through a secure Learning Management System (LMS).",
    contentPosition: "l",
    Icon: FiDollarSign,
  },
];