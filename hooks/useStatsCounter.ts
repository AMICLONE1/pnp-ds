import { useEffect, useRef } from "react";

export function useStatsCounter() {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!statsRef.current) return;

    const counters = statsRef.current.querySelectorAll(".stat-number");
    
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-target") || "0");
      const duration = 2;
      const increment = target / (duration * 60);
      let current = 0;

      const updateCounter = () => {
        if (current < target) {
          current += increment;
          counter.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            updateCounter();
            observer.disconnect();
          }
        },
        { threshold: 0.5 }
      );

      observer.observe(counter);
    });
  }, []);

  return statsRef;
}

