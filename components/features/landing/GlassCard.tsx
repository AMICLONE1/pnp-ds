"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export function GlassCard({
  children,
  className = "",
  hover = true,
  delay = 0,
}: GlassCardProps) {
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  const variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: delay / 1000,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const allVariants = {
    ...variants,
    ...(hover && !prefersReducedMotion && mounted
      ? {
          hover: {
            y: -8,
            transition: { duration: 0.3 },
          },
        }
      : {}),
  };

  // Always render motion.div to prevent hydration mismatch
  // During SSR, render without animation (initial={false} means no initial animation)
  // After mount, enable animations if not reduced motion
  return (
    <motion.div
      initial={mounted && !prefersReducedMotion ? "hidden" : false}
      animate={mounted && !prefersReducedMotion ? "visible" : false}
      whileInView={mounted && !prefersReducedMotion ? "visible" : undefined}
      viewport={mounted && !prefersReducedMotion ? { once: true, margin: "-100px" } : undefined}
      whileHover={mounted && hover && !prefersReducedMotion ? "hover" : undefined}
      variants={mounted && !prefersReducedMotion ? allVariants : undefined}
      className={`glass-card rounded-2xl ${className}`}
      suppressHydrationWarning
    >
      {children}
    </motion.div>
  );
}
