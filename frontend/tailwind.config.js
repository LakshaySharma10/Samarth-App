/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: "#2997FF",
        gray: {
          DEFAULT: "#86868b",
          100: "#94928d",
          200: "#afafaf",
          300: "#42424570",
        },
        zinc: "#101010",
      },
      animation: {
        grid: "grid 15s linear infinite",
      },
      keyframes: {
        grid: {
          "0%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        'retro-grid-light': 'repeating-linear-gradient(to right, rgba(0,0,0,0.3) 1px, transparent 0), repeating-linear-gradient(to bottom, rgba(0,0,0,0.3) 1px, transparent 0)',
        'retro-grid-dark': 'repeating-linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 0), repeating-linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 0)',
      },
      backgroundSize: {
        'grid-size': '60px 60px',
      },
    },
  },
  plugins: [],
};