"use client";

import React from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

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
  const prefersReducedMotion = useReducedMotion();

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

  if (prefersReducedMotion) {
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
