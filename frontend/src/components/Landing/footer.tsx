import { FaInstagram, FaTwitter } from "react-icons/fa";

export const WaterFooter = () => {
  return (
    <footer className="relative bg-blue-950 text-white pt-48 pb-20 overflow-hidden">
      {/* Top Water Waves - Layer 1 */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg
          className="w-full h-[180px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#0ea5e9"
            d="M0,0 C300,80 900,20 1200,100 L1200,0 L0,0 Z"
          >
            <animate
              attributeName="d"
              dur="8s"
              repeatCount="indefinite"
              values="
                M0,0 C300,80 900,20 1200,100 L1200,0 L0,0 Z;
                M0,0 C400,40 800,120 1200,60 L1200,0 L0,0 Z;
                M0,0 C300,80 900,20 1200,100 L1200,0 L0,0 Z"
            />
          </path>
        </svg>
      </div>

      {/* Top Water Waves - Layer 2 (right to left) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg
          className="w-full h-[180px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: "scaleX(-1)", opacity: 0.3 }}
        >
          <path
            fill="#38bdf8"
            d="M0,0 C300,80 900,20 1200,100 L1200,0 L0,0 Z"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="
                M0,0 C300,80 900,20 1200,100 L1200,0 L0,0 Z;
                M0,0 C400,50 800,90 1200,60 L1200,0 L0,0 Z;
                M0,0 C300,80 900,20 1200,100 L1200,0 L0,0 Z"
            />
          </path>
        </svg>
      </div>

      {/* Footer Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center space-y-8">
        {/* Company Name */}
        <div>
          <h2 className="text-3xl font-bold">Digital Dreamers</h2>
          <p className="text-sm opacity-75">Dream it. Code it. Launch it.</p>
        </div>

        {/* Address */}
        <div className="text-sm space-y-1">
          <p>123 Dream Lane, Code City, JS State, 101010</p>
          <p>Email: hello@digitaldreamers.dev</p>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 text-2xl pt-2">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400 transition"
          >
            <FaInstagram />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-400 transition"
          >
            <FaTwitter />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs opacity-50 pt-6">
          © {new Date().getFullYear()} Digital Dreamers. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
