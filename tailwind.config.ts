import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // New "Clean Sky × Fresh Energy" Palette
        primary: {
          DEFAULT: "#2F80ED", // Sky Blue
          soft: "#EAF2FF",    // Sky Mist
          deep: "#1C5ED5",    // Royal Blue
        },
        solar: {
          DEFAULT: "#F2C94C", // Sun Yellow
          soft: "#FFF4CC",    // Light Sun
        },
        eco: {
          DEFAULT: "#27AE60", // Mint Green
          soft: "#EAFBF1",    // Mint Wash
        },
        slate: {
          DEFAULT: "#1F2937", // Primary Text
          black: "#1F2937",   // Primary Text
          gray: "#6B7280",    // Secondary Text
        },
        cloud: {
          white: "#F9FAFB",   // App Background
          pure: "#FFFFFF",    // Card Surface
        },
        border: "#E5E7EB",    // Soft Gray

        // System Status Colors
        success: "#22C55E",   // Fresh Green
        warning: "#F59E0B",   // Amber
        error: "#EF4444",     // Soft Red
        info: "#38BDF8",      // Sky Blue

        // Legacy support (for gradual migration)
        forest: {
          DEFAULT: "#1F2937",
          light: "#27AE60",
          dark: "#1C5ED5",
        },
        gold: {
          DEFAULT: "#F2C94C",
          light: "#FFF4CC",
          dark: "#F59E0B",
        },
        charcoal: "#1F2937",
        offwhite: "#F9FAFB",
        energy: {
          blue: "#38BDF8",
          green: "#27AE60",
        },
      },
      fontFamily: {
        heading: ["Space Grotesk", "Inter", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        hero: ["5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "hero-lg": ["6rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "hero-xl": ["8rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
        "3xl": "4rem",
        "4xl": "6rem",
        "5xl": "8rem",
      },
      maxWidth: {
        "container-sm": "640px",
        "container-md": "768px",
        "container-lg": "1024px",
        "container-xl": "1280px",
        "container-2xl": "1440px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.5s ease-out",
        "fade-in-left": "fadeInLeft 0.5s ease-out",
        "fade-in-right": "fadeInRight 0.5s ease-out",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "bounce-in": "bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "gradient-shift": "gradientShift 3s ease infinite",
        // New animations for redesign
        "gradient-x": "gradientX 3s ease infinite",
        "gradient-xy": "gradientXY 15s ease infinite",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-fast": "float 4s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
        "wiggle": "wiggle 0.5s ease-in-out",
        "text-reveal": "textReveal 0.8s cubic-bezier(0.77, 0, 0.175, 1)",
        "marquee": "marquee 30s linear infinite",
        "marquee-reverse": "marquee 30s linear infinite reverse",
        "aurora": "aurora 10s ease-in-out infinite",
        "spotlight": "spotlight 2s ease-in-out infinite",
        "blob": "blob 7s infinite",
        "morph": "morph 8s ease-in-out infinite",
        "rotate-y": "rotateY 10s linear infinite",
        "slide-in-bottom": "slideInBottom 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-left": "slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-right": "slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "accordion-down": "accordionDown 0.2s ease-out",
        "accordion-up": "accordionUp 0.2s ease-out",
        "number-scroll": "numberScroll 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInLeft: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        bounceIn: {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px rgba(255, 184, 0, 0.5)" },
          "50%": { opacity: "0.8", boxShadow: "0 0 40px rgba(255, 184, 0, 0.8)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        // New keyframes for redesign
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        gradientXY: {
          "0%, 100%": { backgroundPosition: "0% 0%" },
          "25%": { backgroundPosition: "100% 0%" },
          "50%": { backgroundPosition: "100% 100%" },
          "75%": { backgroundPosition: "0% 100%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(255, 184, 0, 0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(255, 184, 0, 0.6)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        textReveal: {
          "0%": { clipPath: "inset(0 100% 0 0)" },
          "100%": { clipPath: "inset(0 0 0 0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        aurora: {
          "0%, 100%": { 
            backgroundPosition: "50% 50%, 50% 50%",
            backgroundSize: "300% 300%, 200% 200%"
          },
          "25%": { 
            backgroundPosition: "0% 100%, 100% 0%",
            backgroundSize: "200% 200%, 300% 300%"
          },
          "50%": { 
            backgroundPosition: "100% 0%, 0% 100%",
            backgroundSize: "300% 300%, 200% 200%"
          },
          "75%": { 
            backgroundPosition: "50% 100%, 50% 0%",
            backgroundSize: "200% 200%, 300% 300%"
          },
        },
        spotlight: {
          "0%": { opacity: "0", transform: "scale(0.5)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        morph: {
          "0%, 100%": { borderRadius: "60% 40% 30% 70%/60% 30% 70% 40%" },
          "50%": { borderRadius: "30% 60% 70% 40%/50% 60% 30% 60%" },
        },
        rotateY: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
        slideInBottom: {
          "0%": { opacity: "0", transform: "translateY(100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        accordionDown: {
          "0%": { height: "0" },
          "100%": { height: "var(--radix-accordion-content-height)" },
        },
        accordionUp: {
          "0%": { height: "var(--radix-accordion-content-height)" },
          "100%": { height: "0" },
        },
        numberScroll: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        "glass-lg": "0 16px 64px 0 rgba(31, 38, 135, 0.5)",
        glow: "0 0 20px rgba(255, 184, 0, 0.5)",
        "glow-lg": "0 0 40px rgba(255, 184, 0, 0.8)",
        "glow-forest": "0 0 30px rgba(13, 40, 24, 0.4)",
        "glow-energy": "0 0 30px rgba(76, 175, 80, 0.4)",
        "inner-glow": "inset 0 0 20px rgba(255, 184, 0, 0.2)",
        "card-hover": "0 20px 40px -12px rgba(0, 0, 0, 0.25)",
        "elevation-1": "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        "elevation-2": "0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)",
        "elevation-3": "0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10)",
        "elevation-4": "0 15px 25px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.05)",
        "elevation-5": "0 20px 40px rgba(0,0,0,0.2)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
        "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
        "out-back": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "bounce": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      scale: {
        "102": "1.02",
        "103": "1.03",
        "98": "0.98",
        "97": "0.97",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-mesh": "linear-gradient(135deg, rgba(13, 40, 24, 0.1) 0%, transparent 50%, rgba(255, 184, 0, 0.1) 100%)",
        "hero-pattern": "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;