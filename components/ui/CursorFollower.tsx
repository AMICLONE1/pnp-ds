"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorFollower() {
  const [isHovering, setIsHovering] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Raw cursor position (instant)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring for smooth following (same config = same speed)
  const springConfig = {
    stiffness: 1200,
    damping: 40,
    mass: 0.6,
  };

  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    setMounted(true);

    const move = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const enter = (e: Event) => {
      const target = e.target;

      if (
        !target ||
        typeof (target as Element).closest !== "function"
      ) {
        return;
      }

      if ((target as Element).closest("[data-cursor-hover]")) {
        setIsHovering(true);
      }
    };

    const leave = (e: Event) => {
      const target = e.target;

      if (
        !target ||
        typeof (target as Element).closest !== "function"
      ) {
        return;
      }

      if ((target as Element).closest("[data-cursor-hover]")) {
        setIsHovering(false);
      }
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseenter", enter, true);
    document.addEventListener("mouseleave", leave, true);

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseenter", enter, true);
      document.removeEventListener("mouseleave", leave, true);
    };
  }, [mouseX, mouseY]);

  // Don't render on server
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-gold rounded-full pointer-events-none z-[9999] mix-blend-difference hidden lg:block"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 2.5 : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-gold/50 rounded-full pointer-events-none z-[9998] hidden lg:block"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
