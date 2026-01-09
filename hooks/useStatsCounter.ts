import { useEffect, useRef, useState } from "react";
import { formatNumber } from "@/lib/utils";

export function useStatsCounter() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !statsRef.current) return;

    const counters = statsRef.current.querySelectorAll(".stat-number");
    
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-target") || "0");
      const duration = 1.5;
      const increment = target / (duration * 60);
      let current = 0;
      let animationId: number | null = null;

      const updateCounter = () => {
        if (current < target) {
          current += increment;
          counter.textContent = formatNumber(Math.floor(current));
          animationId = requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = formatNumber(target);
          if (animationId) {
            cancelAnimationFrame(animationId);
          }
        }
      };

      // Check if element is already visible (for inline calculator)
      const rect = counter.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        // Start immediately if visible
        updateCounter();
      } else {
        // Use IntersectionObserver if not visible
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              updateCounter();
              observer.disconnect();
            }
          },
          { threshold: 0.1 }
        );

        observer.observe(counter);
      }
    });
  }, []);

  return statsRef;
}

