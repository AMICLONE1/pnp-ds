"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useInView } from "react-intersection-observer";
import gsap from "gsap";

interface ScrollAnimationProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
}

export function ScrollAnimation({
  children,
  delay = 0,
  direction = "up",
}: ScrollAnimationProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const directions = {
      up: { y: 50, x: 0 },
      down: { y: -50, x: 0 },
      left: { y: 0, x: 50 },
      right: { y: 0, x: -50 },
      fade: { y: 0, x: 0 },
    };

    const { x, y } = directions[direction];

    if (inView) {
      gsap.fromTo(
        elementRef.current,
        {
          opacity: 0,
          x,
          y,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.8,
          delay,
          ease: "power3.out",
        }
      );
    }
  }, [inView, direction, delay]);

  return (
    <div ref={ref}>
      <div ref={elementRef}>{children}</div>
    </div>
  );
}

