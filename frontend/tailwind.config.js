import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 10s linear infinite', // Slow spinning animation
      },
    },
  },
  plugins: [],
};

export default config;
