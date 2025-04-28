import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { CountUpStats } from "./countup";
import '../../styles/fonts.css';

const BenefitsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"student" | "school">("student");
  const controls = useAnimation();

  const studentBenefits = [
    "Learn smart study strategies to improve your academic performance.",
    "Interact with real AI tools that enhance your learning experience.",
    "Boost creativity and critical thinking with engaging AI-based tasks.",
    "Understand AI through relatable, real-world examples and scenarios.",
    "Gain confidence using technology to solve study-related problems.",
    "Earn a certificate to showcase your newly acquired AI skills."
  ];

  const schoolBenefits = [
    "Ready-to-use AI video modules for seamless classroom integration.",
    "Simple plug-and-play model, no tech expertise needed for usage.",
    "Comprehensive orientation materials for teacher onboarding.",
    "Dedicated support from our team for implementation success.",
    "Bulk access and detailed LMS tracking for student progress.",
    "Empowers your school to lead in AI-enabled learning innovation."
  ];

  const pieData = {
    labels: ["Education", "Healthcare", "Finance", "Transportation", "Others"],
    datasets: [
      {
        data: [25, 30, 20, 15, 10],
        backgroundColor: [
          "#60a5fa",
          "#34d399",
          "#fbbf24",
          "#f87171",
          "#a78bfa"
        ],
        borderWidth: 1
      }
    ]
  };

  const pieOptions = {
    animation: {
      animateRotate: true,
      duration: 1000,
      easing: "easeOutQuad"
    },
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <>
      {/* Floating Image Animation */}
      {/* <motion.img
        src="/bluecube.png" // Make sure this image is in the public folder
        alt="Floating Icon"
        className="top-10 left-10 w-64 h-64 z-[999]"
        animate={{ y: [0, -20, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut"
        }}
      /> */}

      <CountUpStats />

      <section className="w-full min-h-screen py-30 px-6 text-black relative">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-100"
          style={{ backgroundImage: 'url("/benefitsbg.png")' }}
        ></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-12 items-stretch relative z-10 h-full">
          {/* Left Side */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg flex-1 flex flex-col">
            <h2 className="text-4xl mb-6 font-Satoshi font-black text-black">Benefits</h2>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab("student")}
                className={`px-4 py-2 rounded-full transition ${
                  activeTab === "student"
                    ? "bg-gradient-to-br from-purple-400 from-40% to-indigo-400 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setActiveTab("school")}
                className={`px-4 py-2 rounded-full transition ${
                  activeTab === "school"
                    ? "bg-gradient-to-br from-purple-400 from-40% to-indigo-400 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                School
              </button>
            </div>

            <motion.ul
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              {...{className:"space-y-3 text-base flex-grow"}}
            >
              {(activeTab === "student" ? studentBenefits : schoolBenefits).map(
                (point, idx) => (
                  <li key={idx} className="list-disc ml-5 font-satoshi font-regular">
                    {point}
                  </li>
                )
              )}
            </motion.ul>
          </div>

          {/* Right Side */}
          <div className="space-y-8 bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg flex-1 flex flex-col justify-between">
            <div className="bg-white rounded-xl p-4 shadow-md h-full">
              <h4 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                AI Sector Distribution (2024)
              </h4>
              <motion.div
                animate={controls}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                {...{className:"w-full h-64 md:h-80"}}
              >
                <Pie data={pieData} options={pieOptions} />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BenefitsSection;
