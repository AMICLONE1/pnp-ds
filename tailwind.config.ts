import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#1B4332",
          light: "#2D6A4F",
          dark: "#0F2D1F",
        },
        gold: {
          DEFAULT: "#D4A03A",
          light: "#E8C468",
          dark: "#B8860B",
        },
        charcoal: "#1A1A1A",
        offwhite: "#FAFAF8",
      },
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

