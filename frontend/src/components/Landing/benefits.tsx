// import { useState } from "react";
// import { FiArrowRight } from "react-icons/fi";
// import { AnimatePresence, motion } from "framer-motion";

// const AccordionSolutions = () => {
//   const [open, setOpen] = useState(solutions[0].id);
//   const imgSrc = solutions.find((s) => s.id === open)?.imgSrc;
//   return (
//     <section className="px-8 py-12 bg-white">
//       <div className="w-full max-w-5xl mx-auto grid gap-8 grid-cols-1 lg:grid-cols-[1fr_350px]">
//         <div>
//           <h3 className="text-4xl font-bold mb-8">Benifits</h3>
//           <div className="flex flex-col gap-4">
//             {solutions.map((q) => {
//               return (
//                 <Solution {...q} key={q.id} open={open} setOpen={setOpen} index={q.id} />
//               );
//             })}
//           </div>
//         </div>
//         <AnimatePresence mode="wait">
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             key={imgSrc}
//             className="bg-slate-300 rounded-2xl aspect-[4/3] lg:aspect-auto"
//             style={{
//               backgroundImage: `url(${imgSrc})`,
//               backgroundPosition: "center",
//               backgroundSize: "cover",
//             }}
//           />
//         </AnimatePresence>
//       </div>
//     </section>
//   );
// };

// const Solution = ({ title, description, index, open, setOpen }) => {
//   const isOpen = index === open;

//   return (
//     <div
//       onClick={() => setOpen(index)}
//       className="p-0.5 rounded-lg relative overflow-hidden cursor-pointer"
//     >
//       <motion.div
//         initial={false}
//         animate={{
//           height: isOpen ? "240px" : "72px",
//         }}
//         className="p-6 rounded-[7px] bg-white flex flex-col justify-between relative z-20"
//       >
//         <div>
//           <motion.p
//             initial={false}
//             animate={{
//               color: isOpen ? "rgba(0, 0, 0, 0)" : "rgba(0, 0, 0, 1)",
//             }}
//             className="text-xl font-medium w-fit bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text"
//           >
//             {title}
//           </motion.p>
//           <motion.p
//             initial={false}
//             animate={{
//               opacity: isOpen ? 1 : 0,
//             }}
//             className="mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent"
//           >
//             {description}
//           </motion.p>
//         </div>
//         <motion.button
//           initial={false}
//           animate={{
//             opacity: isOpen ? 1 : 0,
//           }}
//           className="-ml-6 -mr-6 -mb-6 mt-4 py-2 rounded-b-md flex items-center justify-center gap-1 group transition-[gap] bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
//         >
          
         
//         </motion.button>
//       </motion.div>
//       <motion.div
//         initial={false}
//         animate={{
//           opacity: isOpen ? 1 : 0,
//         }}
//         className="absolute inset-0 z-10 bg-gradient-to-r from-violet-600 to-indigo-600"
//       />
//       <div className="absolute inset-0 z-0 bg-slate-200" />
//     </div>
//   );
// };

// export default AccordionSolutions;

// const solutions = [
//   {
//     id: 1,
//     title: "Students",
//     description:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos laudantium in iusto iure aliquam commodi possimus eaque sit recusandae incidunt?",
//     imgSrc:
//       "https://media2.giphy.com/media/SsTcO55LJDBsI/giphy.gif?cid=ecf05e47hfid50hu34mzkabzoy46hrftyl6g6656uygzmnpy&ep=v1_gifs_search&rid=giphy.gif&ct=g",
//   },

//   {
//     id: 3,
//     title: "Schools",
//     description:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos laudantium in iusto iure aliquam commodi possimus eaque sit recusandae incidunt?",
//     imgSrc:
//       "https://media1.giphy.com/media/VkMV9TldsPd28/giphy.gif?cid=ecf05e478ipd21u861g034loyqpc66eseytcl7lzjbk1wqrh&ep=v1_gifs_search&rid=giphy.gif&ct=g",
//   },
// ];

// import React from "react";

// const BenefitsSection: React.FC = () => {
//   return (
//     <section
//       className="w-full px-6 py-16 bg-cover bg-center bg-no-repeat"
//       style={{ backgroundImage: "url('/benefitsbg.png')" }} // Replace with your actual path
//     >
//       <div className="max-w-6xl mx-auto">
//         <h2 className="text-4xl font-bold text-black mb-10">Benefits</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Student Box */}
//           <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl border border-white/30 shadow-lg">
//             <h3 className="text-2xl font-semibold text-black mb-4">How Students Benefit</h3>
//             <ul className="space-y-4 text-black text-sm list-disc list-inside">
//               <li>Learn smart study strategies to improve academic performance with less stress and more clarity in understanding.</li>
//               <li>Interact with real AI tools to enhance learning and build familiarity with emerging technologies used in the world today.</li>
//               <li>Boost creativity and critical thinking through engaging, hands-on activities powered by artificial intelligence concepts.</li>
//               <li>Understand AI through real-life examples that make abstract topics relatable and easier to grasp for students of all ages.</li>
//               <li>Gain confidence using technology for studies and solve complex problems more effectively with digital solutions.</li>
//               <li>Earn a certificate to showcase your new skills and improve future academic and career opportunities.</li>
//             </ul>
//           </div>

//           {/* School Box */}
//           <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl border border-white/30 shadow-lg">
//             <h3 className="text-2xl font-semibold text-black mb-4">Benefits for Schools</h3>
//             <ul className="space-y-4 text-black text-sm list-disc list-inside">
//               <li>Empowering schools with ready-to-use AI education designed for immediate classroom impact and student engagement.</li>
//               <li>Plug-and-play video modules simplify the teaching process without requiring teachers to create new content from scratch.</li>
//               <li>Teacher orientation materials ensure that instructors feel supported and prepared to lead AI lessons effectively.</li>
//               <li>No technical staff needed to manage the platform, keeping implementation simple and accessible for all schools.</li>
//               <li>Dedicated onboarding support provided to ease the transition and maximize the platform’s educational impact.</li>
//               <li>Bulk access & LMS tracking offer schools full visibility into student participation and learning outcomes.</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default BenefitsSection;

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
      <CountUpStats />
      <section className="w-full min-h-screen py-30 px-6 text-black relative">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-100"
          style={{ backgroundImage: 'url("/benefitsbg.png")' }}
        ></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-12 items-stretch relative z-10 h-full">
          {/* Left Side */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg flex-1 flex flex-col">
            <h2 className="text-4xl  mb-6 font-satoshi font-bold ">Benefits</h2>

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
              className="space-y-3 text-base flex-grow"
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
                className="w-full h-64 md:h-80"
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





