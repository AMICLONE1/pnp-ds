"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/**
 * Optimized scroll handler using requestAnimationFrame
 * Prevents jank by throttling scroll events and using passive listeners
 */
export function useOptimizedScroll(callback: (scrollY: number) => void) {
  const rafId = useRef<number>();
  const ticking = useRef(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      lastScrollY.current = window.scrollY;
      
      if (!ticking.current) {
        ticking.current = true;
        rafId.current = requestAnimationFrame(() => {
          callback(lastScrollY.current);
          ticking.current = false;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial call
    callback(window.scrollY);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [callback]);
}

/**
 * Scroll progress from 0 to 1 for the entire page
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  
  const handleScroll = useCallback((scrollY: number) => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const newProgress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;
    setProgress(newProgress);
  }, []);
  
  useOptimizedScroll(handleScroll);
  
  return progress;
}

/**
 * Check if element is in viewport with optional margin
 */
export function useInViewport(
  ref: React.RefObject<HTMLElement>,
  options: {
    rootMargin?: string;
    threshold?: number;
    triggerOnce?: boolean;
  } = {}
) {
  const { rootMargin = "0px", threshold = 0, triggerOnce = true } = options;
  const [inView, setInView] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    if (triggerOnce && hasTriggered.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        
        if (isIntersecting) {
          setInView(true);
          if (triggerOnce) {
            hasTriggered.current = true;
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, rootMargin, threshold, triggerOnce]);

  return inView;
}

/**
 * Parallax effect based on scroll position
 * @param speed - Multiplier for parallax effect (negative = opposite direction)
 */
export function useParallaxScroll(speed: number = 0.5) {
  const [offset, setOffset] = useState(0);
  
  const handleScroll = useCallback((scrollY: number) => {
    setOffset(scrollY * speed);
  }, [speed]);
  
  useOptimizedScroll(handleScroll);
  
  return offset;
}

/**
 * Debounce function for expensive operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function that uses RAF
 */
export function throttleRAF<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  let lastArgs: Parameters<T> | null = null;
  
  return (...args: Parameters<T>) => {
    lastArgs = args;
    
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        if (lastArgs) func(...lastArgs);
        rafId = null;
      });
    }
  };
}

/**
 * Check for reduced motion preference
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

/**
 * Safe client-side only effect
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
}
