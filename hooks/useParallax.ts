"use client";

import { useEffect, useState } from "react";

interface UseParallaxOptions {
  speed?: number;
  offset?: number;
}

export function useParallax(options: UseParallaxOptions = {}) {
  const { speed = 0.5, offset = 0 } = options;
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const y = scrollY * speed + offset;

  return { y, scrollY };
}

export function useParallaxElement(
  ref: React.RefObject<HTMLElement>,
  speed = 0.5
) {
  const [transform, setTransform] = useState("translateY(0px)");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      const scrollProgress = (window.scrollY - elementTop) / window.innerHeight;
      const y = scrollProgress * speed * 100;

      setTransform(`translateY(${y}px)`);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ref, speed]);

  return transform;
}
