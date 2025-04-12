// import { FaInstagram, FaTwitter } from "react-icons/fa";

// export const WaterFooter = () => {
//   return (
//     <footer className="relative bg-[#e3e3e3] text-white pt-48 pb-20 overflow-hidden">
//       {/* Top Water Waves - Layer 1 */}
//       <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0">
//         <svg
//           className="w-full h-[180px]"
//           viewBox="0 0 1200 120"
//           preserveAspectRatio="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             fill="#800080"
//             d="M0,0 C300,80 900,20 1200,100 L1200,0 L0,0 Z"
//           >
//             <animate
//               attributeName="d"
//               dur="8s"
//               repeatCount="indefinite"
//               values="
//                 M0,0 C300,80 900,20 1200,100 L1200,0 L0,0 Z;
//                 M0,0 C400,40 800,120 1200,60 L1200,0 L0,0 Z;
//                 M0,0 C300,80 900,20 1200,100 L1200,0 L0,0 Z"
//             />
//           </path>
//         </svg>
//       </div>

//       {/* Top Water Waves - Layer 2 (right to left) */}
//       <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0">
//         <svg
//           className="w-full h-[180px]"
//           viewBox="0 0 1200 120"
//           preserveAspectRatio="none"
//           xmlns="http://www.w3.org/2000/svg"
//           style={{ transform: "scaleX(-1)", opacity: 0.3 }}
//         >
//           <path
//             fill="#800080"
//             d="M0,0 C300,80 900,20 1200,100 L1200,0 L0,0 Z"
//           >
//             <animate
//               attributeName="d"
//               dur="10s"
//               repeatCount="indefinite"
//               values="
//                 M0,0 C300,80 900,20 1200,100 L1200,0 L0,0 Z;
//                 M0,0 C400,50 800,90 1200,60 L1200,0 L0,0 Z;
//                 M0,0 C300,80 900,20 1200,100 L1200,0 L0,0 Z"
//             />
//           </path>
//         </svg>
//       </div>

//       {/* Footer Content */}
//       <div className="relative z-10 max-w-6xl mx-auto px-6 text-center space-y-8">
//         {/* Company Name */}
//         <div>
//           <h2 className="text-3xl font-bold">Skill Static</h2>
//           <p className="text-sm opacity-75">Dream it. Code it. Launch it.</p>
//         </div>

//         {/* Address */}
//         <div className="text-sm space-y-1">
//           <p>Vill. bhalsi post office chhiachhi, tehsil Nalagarh</p>
//           <p>Email: hello@digitaldreamers.dev</p>
//         </div>

//         {/* Social Links */}
//         <div className="flex justify-center gap-6 text-2xl pt-2">
//           <a
//             href="https://instagram.com"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="hover:text-pink-400 transition"
//           >
//             <FaInstagram />
//           </a>
//           <a
//             href="https://twitter.com"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="hover:text-sky-400 transition"
//           >
//             <FaTwitter />
//           </a>
//         </div>

//         {/* Copyright */}
//         <p className="text-xs opacity-50 pt-6">
//           © {new Date().getFullYear()} QAI. All rights reserved.
//         </p>
//       </div>
//     </footer>
//   );
// };

// import { FaFacebookF, FaLinkedinIn, FaYoutube, FaWhatsapp } from "react-icons/fa";
// import { motion } from "framer-motion";

// export default function Footer() {
//   return (
//     <footer className="bg-[#e3e3e3] py-10 px-6 shadow-md relative">
//       <div className="max-w-7xl mx-auto grid md:grid-cols-4 grid-cols-1 gap-8">
//         {/* Logo & Animated PNG */}
//         <div className="relative">
//           <div className="mb-4 font-bold text-lg flex items-center gap-2">
//             <span className="text-purple-500 text-2xl">QAI</span>
            
//           </div>
    
//         </div>

//         {/* Our Company */}
//         <div>
//           <h4 className="font-semibold mb-5">Our Company</h4>
//           <ul className="space-y-1 text-gray-600">
//             <li>Blog</li>
//             <li>Podcast</li>
//             <li>Careers</li>
//             <li>Newsroom</li>
//           </ul>
//         </div>

      

//         {/* Contact */}
//         <div>
//           <h4 className="font-semibold mb-2">Contact</h4>
//           <ul className="space-y-1 text-gray-600">
//             <li>FAQs</li>
//             <li>Contact</li>
//             <li>About Us</li>
//           </ul>
//         </div>
//       </div>

//       {/* Bottom Row */}
//       <div className=" mt-8 pt-4  text-center text-gray-500 text-sm"> 
//         <div className="flex justify-center gap-4 mt-2 text-gray-600 text-lg ">
//         <p className="pr-10 size-0.1">©2025 QAI. All rights reserved</p>
//           <div className="hover:text-blue-400"><FaFacebookF /></div>
//           <div className="hover:text-blue-700"><FaLinkedinIn /></div>
//           <div className="hover:text-red-600"><FaYoutube /></div>
//           <div className="hover:text-green-400"><FaWhatsapp /></div>
//         </div>
//       </div>
//     </footer>
//   );
// }

import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#e0b0ff] text-black px-6 py-10 md:py-14 relative overflow-hidden">
      {/* //e0b0ff  */}
      {/* border-[1px] border-black/5 bg-gradient-to-br from-black/50 to-black/70 */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-10">
        
        {/* Rotating PNG on the left */}
        

        {/* Social Media Centered */}
        <div className="flex flex-col items-center gap-4 order-3 md:order-none">
          <p className="text-sm text-black">Connect with us</p>
          <div className="flex gap-5 text-xl">
            <a href="#" className="hover:text-blue-400 transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-sky-400 transition"><FaTwitter /></a>
            <a href="#" className="hover:text-pink-400 transition"><FaInstagram /></a>
            <a href="#" className="hover:text-blue-500 transition"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Logo and Address on the right */}
        <div className="flex flex-col items-end text-right gap-2">
          <img src="/logo.png" alt="Logo" className="w-28 md:w-36" />
          <address className="text-sm text-black not-italic">
            Skill static Inc.<br />
            Vill. chhiachhi ,<br />
            Nalagarh, IN
          </address>
        </div>
      </div>
      <div>
        
      </div>
      

      {/* Optional: bottom border line glow */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-sm opacity-40" />
    </footer>
  );
}
