"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion, useAnimation, useReducedMotion } from "framer-motion";

interface UseScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade" | "scale";
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    triggerOnce = true,
    delay = 0,
    direction = "up",
  } = options;

  const prefersReducedMotion = useReducedMotion();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold,
    triggerOnce,
  });

  useEffect(() => {
    if (prefersReducedMotion) {
      controls.set({ opacity: 1, y: 0, x: 0, scale: 1 });
      return;
    }

    const animationVariants = {
      up: { opacity: 0, y: 50 },
      down: { opacity: 0, y: -50 },
      left: { opacity: 0, x: -50 },
      right: { opacity: 0, x: 50 },
      fade: { opacity: 0 },
      scale: { opacity: 0, scale: 0.8 },
    };

    const finalVariants = {
      up: { opacity: 1, y: 0 },
      down: { opacity: 1, y: 0 },
      left: { opacity: 1, x: 0 },
      right: { opacity: 1, x: 0 },
      fade: { opacity: 1 },
      scale: { opacity: 1, scale: 1 },
    };

    if (inView) {
      controls.start({
        ...finalVariants[direction],
        transition: {
          duration: 0.6,
          delay: delay / 1000,
          ease: [0.16, 1, 0.3, 1],
        },
      });
    } else if (!triggerOnce) {
      controls.start(animationVariants[direction]);
    }
  }, [inView, direction, delay, triggerOnce, prefersReducedMotion, controls]);

  return { ref, controls, inView };
}

export function useStaggerAnimation(itemCount: number, delay = 100) {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : delay / 1000,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return { ref, containerVariants, itemVariants, inView };
}
