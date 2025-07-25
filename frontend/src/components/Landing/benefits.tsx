import  { useState, useEffect } from "react";
import { motion ,  MotionProps } from "framer-motion";
import { Bar } from "recharts";
import { CountUpStats } from "./countup";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis
} from "recharts";
import '../../styles/fonts.css';

const BenefitsSection = () => {
  const [activeTab, setActiveTab] = useState("student");
  const [activeChart, setActiveChart] = useState("bar");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const studentBenefits = [
    "Learn smart study strategies to improve your academic performance",
    "Interact with real AI tools that enhance your learning experience",
    "Boost creativity and critical thinking with engaging AI-based tasks",
    "Understand AI through relatable, real-world examples and scenarios",
    "Gain confidence using technology to solve study-related problems",
    "Earn a certificate to showcase your newly acquired AI skills"
  ];

  const schoolBenefits = [
    "Ready-to-use AI video modules for seamless classroom integration",
    "Simple plug-and-play model, no tech expertise needed for usage",
    "Comprehensive orientation materials for teacher onboarding",
    "Dedicated support from our team for implementation success",
    "Bulk access and detailed LMS tracking for student progress",
    "Empowers your school to lead in AI-enabled learning innovation"
  ];

  const barData = [
    { name: "Education", value: 68, fill: "#8884d8" },
    { name: "Healthcare", value: 72, fill: "#82ca9d" },
    { name: "Finance", value: 58, fill: "#ffc658" },
    { name: "Transportation", value: 49, fill: "#ff8042" },
    { name: "Others", value: 38, fill: "#0088fe" }
  ];

  const radialData = [
    { name: "Education", value: 68, fill: "#8884d8" },
    { name: "Healthcare", value: 72, fill: "#82ca9d" },
    { name: "Finance", value: 58, fill: "#ffc658" },
    { name: "Transportation", value: 49, fill: "#ff8042" },
    { name: "Others", value: 38, fill: "#0088fe" }
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const MotionDiv = motion.div as React.ComponentType<
React.HTMLAttributes<HTMLDivElement> & MotionProps & { 
  ref?: React.Ref<HTMLDivElement>; 
}
>;

  return (
<section
  className="w-full py-16 bg-no-repeat bg-cover bg-center text-gray-800 font-Satoshi"
  style={{ backgroundImage: "url('/benefitsbg.png')" }}
>


      <CountUpStats />

      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeIn}
          {...{className :"text-4xl font-bold text-center mb-12 text-indigo-900"}}
        >
          Why Choose Our AI Learning Platform?
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Side - Benefits */}
          <MotionDiv
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={fadeIn}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-gradient-to-br from-purple-400 from-40% to-indigo-400 p-4">
              <div className="flex space-x-3 mb-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold text-white">Benefits</h3>
            </div>

            <div className="p-6">
              {/* Tabs */}
              <div className="flex justify-center mb-8">
                <div className="bg-gray-100 p-1 rounded-full inline-flex">
                  <button
                    onClick={() => setActiveTab("student")}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      activeTab === "student"
                        ? "bg-gradient-to-br from-purple-400 from-40% to-indigo-400 text-white shadow-md"
                        : "text-gray-700 hover:text-indigo-400"
                    }`}
                  >
                    For Students
                  </button>
                  <button
                    onClick={() => setActiveTab("school")}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      activeTab === "school"
                        ? "bg-gradient-to-br from-purple-400 from-40% to-indigo-400 text-white shadow-md"
                        : "text-gray-700 hover:text-indigo-400"
                    }`}
                  >
                    For Schools
                  </button>
                </div>
              </div>

              {/* Benefits List */}
              <MotionDiv
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {(activeTab === "student" ? studentBenefits : schoolBenefits).map(
                  (benefit, index) => (
                    <MotionDiv
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start"
                    >
                      <div className="mt-1 mr-4 flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-700">{benefit}</p>
                    </MotionDiv>
                  )
                )}
              </MotionDiv>
            </div>
          </MotionDiv>

          {/* Right Side - Charts */}
          <MotionDiv
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={fadeIn}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-gradient-to-br from-purple-400 from-40% to-indigo-400 p-4">
              <div className="flex space-x-3 mb-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">AI Sector Growth (2025)</h3>
                <div className="flex space-x-2">
                <button
                    onClick={() => setActiveChart("radial")}
                    className={`p-1 rounded ${
                      activeChart === "radial" ? "bg-white text-indigo-600" : "text-white"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setActiveChart("bar")}
                    className={`p-1 rounded ${
                      activeChart === "bar" ? "bg-white text-indigo-600" : "text-white"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </button>
               
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-4 h-80">
                {activeChart === "bar" ? (
                 <ResponsiveContainer width="100%" height="100%">
                 <BarChart
                   data={barData}
                   margin={{ top: 40, right: 30, left: 30, bottom: 60 }} // Add more margin
                 >
                   <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                   <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                   <YAxis />
                   <Tooltip
                     contentStyle={{
                       backgroundColor: "rgba(255, 255, 255, 0.8)",
                       borderRadius: "8px",
                       border: "none",
                       boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                     }}
                   />
                   <Legend
                     layout="horizontal" // Change layout to horizontal
                     verticalAlign="top" // Move legend to the top
                     align="center" // Center the legend
                   />
                   <Bar
                     dataKey="value"
                     name="Adoption Rate (%)"
                     radius={[8, 8, 0, 0]}
                      // Adjust bar size for better spacing
                   />
                 </BarChart>
               </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="30%"
                      outerRadius="80%"
                      data={radialData}
                      cx="50%"
                      cy="50%"
                      startAngle={180}
                      endAngle={0}
                    >
                      <PolarAngleAxis
                        type="number"
                        domain={[0, 100]}
                        angleAxisId={0}
                        tick={false}
                      />
                      <RadialBar
                        background
                        dataKey="value"
                        cornerRadius={12}
                        label={{
                          position: "insideStart",
                          fill: "#fff",
                          fontWeight: "bold"
                        }}
                      />
                      <Legend
                        iconSize={10}
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        wrapperStyle={{ paddingLeft: "10px" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                        }}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-gray-600 text-sm">
                  Data shows AI adoption rates across major sectors, with Healthcare leading at 72% adoption rate in 2025.
                </p>
              </div>
            </div>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
