"use client";

import { useEffect, useRef, useState } from "react";

export function useHeroAnimation() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !heroRef.current || typeof window === "undefined") return;
    
    // Dynamically import gsap to avoid SSR issues
    import("gsap").then(({ default: gsap }) => {
      if (!heroRef.current) return;
      
      gsap.fromTo(
        heroRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
        }
      );
    });
  }, [mounted]);

  return heroRef;
}

