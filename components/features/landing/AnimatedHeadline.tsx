"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AnimatedHeadlineProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function AnimatedHeadline({
  children,
  delay = 0,
  className = "",
}: AnimatedHeadlineProps) {
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: delay / 1000,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  if (!mounted || prefersReducedMotion) {
    return <h1 className={className}>{children}</h1>;
  }

  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      variants={variants}
      className={className}
    >
      {children}
    </motion.h1>
  );
}
