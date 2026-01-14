"use client";

import { useRef, useState, useEffect, ReactNode, useCallback, memo } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion, useIsClient } from "@/hooks/useOptimizedScroll";

// ============================================
// OPTIMIZED SCROLL FADE
// Uses CSS transforms for GPU acceleration
// ============================================
interface ScrollFadeProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "fade";
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

export const ScrollFadeOptimized = memo(function ScrollFadeOptimized({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className,
  once = true,
  threshold = 0.1,
}: ScrollFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const prefersReducedMotion = useReducedMotion();
  const isClient = useIsClient();

  // Direction-based initial state
  const initialState = {
    up: { opacity: 0, y: 50 },
    down: { opacity: 0, y: -50 },
    left: { opacity: 0, x: -50 },
    right: { opacity: 0, x: 50 },
    fade: { opacity: 0 },
  }[direction];

  const animateState = {
    up: { opacity: 1, y: 0 },
    down: { opacity: 1, y: 0 },
    left: { opacity: 1, x: 0 },
    right: { opacity: 1, x: 0 },
    fade: { opacity: 1 },
  }[direction];

  // Disable animations if reduced motion is preferred
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // SSR fallback
  if (!isClient) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={initialState}
      animate={isInView ? animateState : initialState}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Custom easing for smooth feel
      }}
      className={className}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
});

// ============================================
// STAGGER CHILDREN
// Animate children in sequence
// ============================================
interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggerContainer = memo(function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
});

export const StaggerItem = memo(function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
});

// ============================================
// PARALLAX SECTION (Optimized)
// ============================================
interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down";
}

export const ParallaxSectionOptimized = memo(function ParallaxSectionOptimized({
  children,
  className,
  speed = 0.3, // Reduced default speed for smoother effect
  direction = "up",
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isClient = useIsClient();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const multiplier = direction === "up" ? -1 : 1;
  
  // Use spring for smoother parallax
  const rawY = useTransform(
    scrollYProgress,
    [0, 1],
    [50 * speed * multiplier, -50 * speed * multiplier]
  );
  
  const y = useSpring(rawY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (prefersReducedMotion || !isClient) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div style={{ y, willChange: "transform" }}>
        {children}
      </motion.div>
    </div>
  );
});

// ============================================
// REVEAL ON SCROLL
// Text/Element reveal effect
// ============================================
interface RevealOnScrollProps {
  children: ReactNode;
  width?: "fit-content" | "100%";
  className?: string;
}

export const RevealOnScroll = memo(function RevealOnScroll({
  children,
  width = "fit-content",
  className,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      style={{ position: "relative", width, overflow: "hidden" }}
      className={className}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
});

// ============================================
// SCALE ON SCROLL
// Scale element based on scroll position
// ============================================
interface ScaleOnScrollProps {
  children: ReactNode;
  className?: string;
}

export const ScaleOnScroll = memo(function ScaleOnScroll({
  children,
  className,
}: ScaleOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isClient = useIsClient();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  if (prefersReducedMotion || !isClient) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ scale, opacity, willChange: "transform, opacity" }}>
        {children}
      </motion.div>
    </div>
  );
});

// ============================================
// SMOOTH SCROLL PROGRESS INDICATOR
// ============================================
export const SmoothScrollProgressOptimized = memo(function SmoothScrollProgressOptimized() {
  const { scrollYProgress } = useScroll();
  const isClient = useIsClient();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (!isClient) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-energy-green to-gold origin-left z-50"
      style={{ scaleX, willChange: "transform" }}
    />
  );
});

// ============================================
// HORIZONTAL SCROLL (Optimized)
// ============================================
interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
}

export const HorizontalScrollOptimized = memo(function HorizontalScrollOptimized({
  children,
  className,
}: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isClient = useIsClient();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);
  
  const smoothX = useSpring(x, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (prefersReducedMotion || !isClient) {
    return (
      <div className={cn("overflow-x-auto", className)}>
        <div className="flex">{children}</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("relative h-[300vh]", className)}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div 
          style={{ x: smoothX, willChange: "transform" }} 
          className="flex"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
});

// ============================================
// COUNT UP ANIMATION (Optimized)
// ============================================
interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export const CountUpOptimized = memo(function CountUpOptimized({
  end,
  start = 0,
  duration = 2,
  prefix = "",
  suffix = "",
  className,
  decimals = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(start);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    
    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      
      setCount(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isInView, start, end, duration, prefersReducedMotion]);

  const formattedCount = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.round(count).toLocaleString();

  return (
    <span ref={ref} className={className}>
      {prefix}{formattedCount}{suffix}
    </span>
  );
});
