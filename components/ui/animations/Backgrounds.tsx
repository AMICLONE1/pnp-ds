"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface AuroraBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  intensity?: "subtle" | "medium" | "strong";
}

export function AuroraBackground({
  className = "",
  children,
  intensity = "medium",
}: AuroraBackgroundProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const opacityMap = {
    subtle: 0.3,
    medium: 0.5,
    strong: 0.7,
  };

  const opacity = opacityMap[intensity];

  if (!mounted) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest-light to-forest-dark" />
        {children}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest-light to-forest-dark" />
      
      {/* Aurora blobs */}
      <motion.div
        className="absolute inset-0"
        style={{ opacity }}
      >
        {/* Gold blob */}
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,184,0,0.4) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            x: ["-20%", "30%", "-20%"],
            y: ["-20%", "20%", "-20%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Green blob */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full right-0 bottom-0"
          style={{
            background: "radial-gradient(circle, rgba(76,175,80,0.3) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            x: ["20%", "-30%", "20%"],
            y: ["20%", "-20%", "20%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Cyan blob */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full top-1/2 left-1/2"
          style={{
            background: "radial-gradient(circle, rgba(0,188,212,0.2) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{
            x: ["-50%", "-30%", "-70%", "-50%"],
            y: ["-50%", "-70%", "-30%", "-50%"],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
      
      {/* Grain overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

interface GradientMeshProps {
  className?: string;
  colors?: string[];
  animated?: boolean;
  variant?: "default" | "aurora" | "waves" | "spotlight";
  intensity?: "subtle" | "medium" | "strong";
  speed?: "slow" | "normal" | "fast";
}

export function GradientMesh({
  className = "",
  colors = ["#0D2818", "#1B5E3E", "#FFB800", "#4CAF50", "#00BCD4"],
  animated = true,
  variant = "default",
  intensity = "medium",
  speed = "normal",
}: GradientMeshProps) {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mouse tracking for interactive variant
  useEffect(() => {
    if (!mounted || variant !== "spotlight") return;

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mounted, variant]);

  if (!mounted) {
    return <div className={`absolute inset-0 ${className}`} />;
  }

  // Intensity mappings
  const opacityMap = {
    subtle: 0.15,
    medium: 0.3,
    strong: 0.5,
  };

  // Speed mappings (in seconds)
  const speedMap = {
    slow: { base: 20, variance: 8 },
    normal: { base: 12, variance: 5 },
    fast: { base: 6, variance: 3 },
  };

  const opacity = opacityMap[intensity];
  const { base: baseDuration, variance } = speedMap[speed];

  // Generate blob configurations
  const blobs = colors.map((color, index) => {
    const size = 35 + Math.random() * 30;
    const startX = (index * 20 + Math.random() * 15) % 90;
    const startY = (index * 25 + Math.random() * 20) % 85;
    
    return {
      color,
      size,
      startX,
      startY,
      duration: baseDuration + index * variance + Math.random() * variance,
    };
  });

  // Aurora variant - horizontal waves
  if (variant === "aurora") {
    return (
      <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
        {colors.map((color, index) => (
          <motion.div
            key={index}
            className="absolute w-full"
            style={{
              height: "120%",
              background: `linear-gradient(180deg, transparent 0%, ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 50%, transparent 100%)`,
              filter: "blur(80px)",
              top: "-10%",
            }}
            animate={{
              x: ["-100%", "100%"],
              scaleY: [1, 1.3, 0.8, 1.1, 1],
              opacity: [opacity * 0.5, opacity, opacity * 0.7, opacity],
            }}
            transition={{
              x: {
                duration: baseDuration + index * 3,
                repeat: Infinity,
                ease: "linear",
              },
              scaleY: {
                duration: baseDuration * 0.7,
                repeat: Infinity,
                ease: "easeInOut",
              },
              opacity: {
                duration: baseDuration * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />
        ))}
      </div>
    );
  }

  // Waves variant - flowing organic shapes
  if (variant === "waves") {
    return (
      <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            {colors.map((color, index) => (
              <linearGradient key={`grad-${index}`} id={`wave-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity={opacity} />
                <stop offset="50%" stopColor={color} stopOpacity={opacity * 0.5} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            ))}
            <filter id="wave-blur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
            </filter>
          </defs>
          {colors.map((color, index) => (
            <motion.ellipse
              key={index}
              cx="50%"
              cy="50%"
              rx="60%"
              ry="40%"
              fill={`url(#wave-gradient-${index})`}
              filter="url(#wave-blur)"
              animate={{
                cx: ["30%", "70%", "50%", "30%"],
                cy: ["40%", "60%", "30%", "40%"],
                rx: ["50%", "70%", "55%", "50%"],
                ry: ["35%", "45%", "40%", "35%"],
                rotate: [0, 45, -30, 0],
              }}
              transition={{
                duration: baseDuration + index * variance,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5,
              }}
              style={{ transformOrigin: "center" }}
            />
          ))}
        </svg>
      </div>
    );
  }

  // Spotlight variant - follows mouse
  if (variant === "spotlight") {
    return (
      <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
        {/* Static background blobs */}
        {blobs.slice(0, 3).map((blob, index) => (
          <motion.div
            key={`static-${index}`}
            className="absolute rounded-full"
            style={{
              width: `${blob.size}%`,
              height: `${blob.size}%`,
              background: `radial-gradient(circle, ${blob.color}${Math.round(opacity * 0.5 * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
              filter: "blur(60px)",
              left: `${blob.startX}%`,
              top: `${blob.startY}%`,
            }}
            animate={animated ? {
              scale: [1, 1.1, 0.95, 1],
              opacity: [0.5, 0.7, 0.5],
            } : undefined}
            transition={{
              duration: blob.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        {/* Mouse-following spotlight */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "50%",
            height: "50%",
            background: `radial-gradient(circle, ${colors[0]}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, ${colors[1]}${Math.round(opacity * 0.5 * 255).toString(16).padStart(2, '0')} 40%, transparent 70%)`,
            filter: "blur(80px)",
          }}
          animate={{
            left: `${mousePosition.x * 100 - 25}%`,
            top: `${mousePosition.y * 100 - 25}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 20,
          }}
        />
      </div>
    );
  }

  // Default variant - enhanced floating blobs
  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Primary blobs */}
      {blobs.map((blob, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            width: `${blob.size}%`,
            height: `${blob.size}%`,
            background: `radial-gradient(ellipse at center, ${blob.color}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, ${blob.color}${Math.round(opacity * 0.3 * 255).toString(16).padStart(2, '0')} 40%, transparent 70%)`,
            filter: "blur(50px)",
            left: `${blob.startX}%`,
            top: `${blob.startY}%`,
          }}
          animate={animated ? {
            x: [0, 80 - index * 15, -60 + index * 10, 40, 0],
            y: [0, -50 + index * 10, 70 - index * 15, -30, 0],
            scale: [1, 1.15, 0.9, 1.05, 1],
            rotate: [0, 90, 180, 270, 360],
          } : undefined}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
        />
      ))}
      
      {/* Accent glow spots */}
      {colors.slice(0, 3).map((color, index) => (
        <motion.div
          key={`accent-${index}`}
          className="absolute rounded-full mix-blend-screen"
          style={{
            width: "20%",
            height: "20%",
            background: `radial-gradient(circle, ${color}${Math.round(opacity * 0.8 * 255).toString(16).padStart(2, '0')} 0%, transparent 60%)`,
            filter: "blur(40px)",
          }}
          animate={animated ? {
            left: [`${20 + index * 30}%`, `${40 + index * 20}%`, `${10 + index * 35}%`, `${20 + index * 30}%`],
            top: [`${30 + index * 20}%`, `${50 + index * 15}%`, `${20 + index * 25}%`, `${30 + index * 20}%`],
            scale: [0.8, 1.2, 1, 0.8],
            opacity: [opacity * 0.5, opacity, opacity * 0.7, opacity * 0.5],
          } : undefined}
          transition={{
            duration: baseDuration * 0.8 + index * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Noise overlay for texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

interface SpotlightProps {
  className?: string;
  size?: number;
}

export function Spotlight({ className = "", size = 400 }: SpotlightProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="pointer-events-none absolute"
        style={{
          width: size,
          height: size,
          left: mousePosition.x - size / 2,
          top: mousePosition.y - size / 2,
          background: "radial-gradient(circle, rgba(255,184,0,0.15) 0%, transparent 70%)",
          filter: "blur(30px)",
          transition: "left 0.1s, top 0.1s",
        }}
      />
    </div>
  );
}

interface GridPatternProps {
  className?: string;
  size?: number;
  color?: string;
}

export function GridPattern({
  className = "",
  size = 40,
  color = "rgba(255,255,255,0.03)",
}: GridPatternProps) {
  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(${color} 1px, transparent 1px),
          linear-gradient(90deg, ${color} 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
}

interface DotPatternProps {
  className?: string;
  size?: number;
  spacing?: number;
  color?: string;
}

export function DotPattern({
  className = "",
  size = 2,
  spacing = 20,
  color = "rgba(255,255,255,0.1)",
}: DotPatternProps) {
  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{
        backgroundImage: `radial-gradient(${color} ${size}px, transparent ${size}px)`,
        backgroundSize: `${spacing}px ${spacing}px`,
      }}
    />
  );
}
