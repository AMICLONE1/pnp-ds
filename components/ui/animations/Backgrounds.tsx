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
}

export function GradientMesh({
  className = "",
  colors = ["#0D2818", "#1B5E3E", "#FFB800", "#4CAF50"],
  animated = true,
}: GradientMeshProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`absolute inset-0 ${className}`} />;
  }

  return (
    <div className={`absolute inset-0 ${className}`}>
      {colors.map((color, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            width: `${40 + index * 10}%`,
            height: `${40 + index * 10}%`,
            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
            filter: "blur(60px)",
            left: `${(index * 25) % 100}%`,
            top: `${(index * 30) % 100}%`,
          }}
          animate={animated ? {
            x: [0, 50, -30, 0],
            y: [0, -30, 50, 0],
            scale: [1, 1.1, 0.9, 1],
          } : undefined}
          transition={{
            duration: 10 + index * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
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
