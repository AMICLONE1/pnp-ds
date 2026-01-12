"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ===== CURSOR FOLLOWER =====
export function CursorFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && typeof target.closest === 'function' && target.closest('[data-cursor-hover]')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && typeof target.closest === 'function' && target.closest('[data-cursor-hover]')) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-gold rounded-full pointer-events-none z-[9999] mix-blend-difference hidden lg:block"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: isHovering ? 2.5 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-gold/50 rounded-full pointer-events-none z-[9998] hidden lg:block"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.8,
        }}
      />
    </>
  );
}

// ===== SMOOTH SCROLL INDICATOR =====
export function SmoothScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-energy-green to-energy-blue origin-left z-[100]"
      style={{ scaleX }}
    />
  );
}

// ===== TEXT SCRAMBLE EFFECT =====
export function TextScramble({ 
  text, 
  className,
  duration = 1000,
  trigger = true 
}: { 
  text: string; 
  className?: string;
  duration?: number;
  trigger?: boolean;
}) {
  const [displayText, setDisplayText] = useState(text);
  const chars = "!<>-_\\/[]{}—=+*^?#________";
  
  useEffect(() => {
    if (!trigger) return;
    
    let iteration = 0;
    const originalText = text;
    
    const interval = setInterval(() => {
      setDisplayText(
        originalText
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= originalText.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, duration / (text.length * 3));

    return () => clearInterval(interval);
  }, [text, duration, trigger]);

  return <span className={className}>{displayText}</span>;
}

// ===== PARALLAX SECTION =====
export function ParallaxSection({ 
  children, 
  className,
  speed = 0.5 
}: { 
  children: React.ReactNode; 
  className?: string;
  speed?: number;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
    layoutEffect: false,
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

// ===== REVEAL TEXT ON SCROLL =====
export function RevealText({ 
  text, 
  className,
  as = "p",
  delay = 0
}: { 
  text: string; 
  className?: string;
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div";
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const Tag = as;

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.span
        className="block"
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1],
          delay 
        }}
      >
        <Tag>{text}</Tag>
      </motion.span>
    </div>
  );
}

// ===== MORPHING BLOB =====
export function MorphingBlob({ 
  className,
  colors = ["#FFB800", "#4CAF50", "#00BCD4"]
}: { 
  className?: string;
  colors?: string[];
}) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <svg className="w-full h-full" viewBox="0 0 800 800" preserveAspectRatio="none">
        <defs>
          <linearGradient id="blob-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} stopOpacity="0.3">
              <animate 
                attributeName="stop-color" 
                values={`${colors[0]};${colors[1]};${colors[2]};${colors[0]}`} 
                dur="10s" 
                repeatCount="indefinite" 
              />
            </stop>
            <stop offset="100%" stopColor={colors[2]} stopOpacity="0.3">
              <animate 
                attributeName="stop-color" 
                values={`${colors[2]};${colors[0]};${colors[1]};${colors[2]}`} 
                dur="10s" 
                repeatCount="indefinite" 
              />
            </stop>
          </linearGradient>
        </defs>
        <path fill="url(#blob-gradient)">
          <animate
            attributeName="d"
            dur="20s"
            repeatCount="indefinite"
            values="
              M400,400Q500,300,400,200Q300,100,200,200Q100,300,200,400Q300,500,400,400;
              M400,400Q550,250,400,150Q250,50,150,200Q50,350,200,450Q350,550,400,400;
              M400,400Q600,200,400,100Q200,0,100,200Q0,400,200,500Q400,600,400,400;
              M400,400Q500,300,400,200Q300,100,200,200Q100,300,200,400Q300,500,400,400
            "
          />
        </path>
      </svg>
    </div>
  );
}

// ===== NUMBERED SECTION INDICATOR (Inspired by Acron.no) =====
export function SectionIndicator({ 
  current, 
  total,
  className 
}: { 
  current: number; 
  total: number;
  className?: string;
}) {
  return (
    <div className={cn("fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-4", className)}>
      <span className="text-5xl font-heading font-bold text-gold">
        {String(current).padStart(2, '0')}
      </span>
      <div className="w-px h-16 bg-gray-300 relative overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 w-full bg-gold"
          initial={{ height: 0 }}
          animate={{ height: `${(current / total) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <span className="text-lg text-gray-400">
        {String(total).padStart(2, '0')}
      </span>
    </div>
  );
}

// ===== HORIZONTAL SCROLL SECTION =====
export function HorizontalScrollSection({ 
  children,
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={containerRef} className={cn("relative h-[300vh]", className)}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-8 pl-[10vw]">
          {children}
        </motion.div>
      </div>
    </section>
  );
}

// ===== ANIMATED COUNTER =====
export function AnimatedCounter({ 
  value, 
  prefix = "",
  suffix = "",
  duration = 2,
  className 
}: { 
  value: number; 
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const incrementTime = (duration * 1000) / end;

    const timer = setInterval(() => {
      start += Math.ceil(end / (duration * 60));
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// ===== STAGGERED GRID =====
export function StaggeredGrid({ 
  children,
  className,
  staggerDelay = 0.1 
}: { 
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {React.Children.map(children, (child) => (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30, scale: 0.95 },
            visible: { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
              }
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ===== INTERACTIVE CARD (Inspired by Jaeco.fr) =====
export function InteractiveCard({ 
  children,
  className,
  glowColor = "rgba(255, 184, 0, 0.3)"
}: { 
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white border border-gray-100 transition-shadow duration-500",
        isHovered && "shadow-2xl",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute pointer-events-none rounded-full blur-3xl opacity-0"
        style={{
          width: 200,
          height: 200,
          background: glowColor,
          left: mousePosition.x - 100,
          top: mousePosition.y - 100,
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />
      
      {/* Border gradient on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}, transparent 50%)`,
        }}
        animate={{ opacity: isHovered ? 0.5 : 0 }}
      />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

// ===== FLOATING NAVIGATION DOTS (Inspired by Citytour) =====
export function FloatingNavDots({ 
  sections,
  activeSection,
  onNavigate,
  className 
}: { 
  sections: { id: string; label: string }[];
  activeSection: string;
  onNavigate: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3", className)}>
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onNavigate(section.id)}
          className="group relative flex items-center"
        >
          <span className="absolute right-8 px-3 py-1 bg-charcoal text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {section.label}
          </span>
          <motion.div
            className={cn(
              "w-3 h-3 rounded-full border-2 transition-colors",
              activeSection === section.id 
                ? "bg-gold border-gold" 
                : "border-gray-400 hover:border-gold"
            )}
            whileHover={{ scale: 1.3 }}
          />
        </button>
      ))}
    </div>
  );
}

// ===== MARQUEE TEXT =====
export function MarqueeText({ 
  text,
  className,
  speed = 50,
  direction = "left"
}: { 
  text: string;
  className?: string;
  speed?: number;
  direction?: "left" | "right";
}) {
  return (
    <div className={cn("overflow-hidden whitespace-nowrap", className)}>
      <motion.div
        className="inline-flex"
        animate={{ 
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"]
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <span className="px-4">{text}</span>
        <span className="px-4">{text}</span>
        <span className="px-4">{text}</span>
        <span className="px-4">{text}</span>
      </motion.div>
    </div>
  );
}

// ===== SPLIT HERO TEXT =====
export function SplitHeroText({ 
  line1,
  line2,
  highlight,
  className 
}: { 
  line1: string;
  line2: string;
  highlight?: string;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.h1 
        className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold leading-tight"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        <motion.span
          className="block"
          variants={{
            hidden: { y: "100%", opacity: 0 },
            visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
          }}
        >
          {line1}
        </motion.span>
        <motion.span
          className="block"
          variants={{
            hidden: { y: "100%", opacity: 0 },
            visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
          }}
        >
          {highlight && (
            <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
              {highlight}
            </span>
          )}
          {line2}
        </motion.span>
      </motion.h1>
    </div>
  );
}

// ===== VIDEO BACKGROUND WITH OVERLAY =====
export function VideoBackground({ 
  src,
  poster,
  overlay = true,
  className 
}: { 
  src: string;
  poster?: string;
  overlay?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={poster}
        className="absolute w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-forest/80 via-forest/60 to-forest-dark/90" />
      )}
    </div>
  );
}

// ===== FEATURE PILL =====
export function FeaturePill({ 
  icon: Icon,
  text,
  variant = "default",
  className 
}: { 
  icon?: React.ElementType;
  text: string;
  variant?: "default" | "gold" | "green" | "blue";
  className?: string;
}) {
  const variants = {
    default: "bg-white/10 border-white/20 text-white",
    gold: "bg-gold/10 border-gold/30 text-gold",
    green: "bg-energy-green/10 border-energy-green/30 text-energy-green",
    blue: "bg-energy-blue/10 border-energy-blue/30 text-energy-blue",
  };

  return (
    <motion.div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md",
        variants[variant],
        className
      )}
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span className="text-sm font-medium">{text}</span>
    </motion.div>
  );
}

// ===== ANIMATED GRADIENT BORDER =====
export function AnimatedGradientBorder({ 
  children,
  className,
  borderWidth = 2
}: { 
  children: React.ReactNode;
  className?: string;
  borderWidth?: number;
}) {
  return (
    <div className={cn("relative p-[2px] rounded-2xl overflow-hidden", className)} style={{ padding: borderWidth }}>
      <div className="absolute inset-0 bg-gradient-to-r from-gold via-energy-green to-energy-blue animate-gradient-x" />
      <div className="relative bg-white dark:bg-charcoal rounded-2xl h-full">
        {children}
      </div>
    </div>
  );
}

// ===== HOVER CARD WITH IMAGE REVEAL =====
export function HoverRevealCard({ 
  title,
  description,
  image,
  className 
}: { 
  title: string;
  description: string;
  image: string;
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={cn("relative h-80 rounded-2xl overflow-hidden cursor-pointer", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent"
        animate={{ opacity: isHovered ? 0.9 : 0.7 }}
      />
      
      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <motion.h3
          className="text-2xl font-heading font-bold text-white mb-2"
          animate={{ y: isHovered ? -10 : 0 }}
        >
          {title}
        </motion.h3>
        <motion.p
          className="text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
}
