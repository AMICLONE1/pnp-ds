"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    
    const handleScroll = () => {
      // Show CTA after scrolling past hero section
      const heroHeight = window.innerHeight;
      setIsVisible(window.scrollY > heroHeight * 0.5);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg md:hidden"
          aria-label="Sticky call to action"
        >
          <Link href="/reserve" className="block w-full">
            <Button
              className="w-full bg-gold hover:bg-gold-light text-black font-bold py-6 text-lg glow-button focus-visible-ring"
              aria-label="Start saving now"
            >
              Start Saving Now
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
