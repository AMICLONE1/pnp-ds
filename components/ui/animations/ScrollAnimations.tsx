"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from "framer-motion";


interface StickyScrollItem {
  title: string;
  description: string;
  content: ReactNode;
}

interface StickyScrollProps {
  children?: ReactNode | ((progress: MotionValue<number>) => ReactNode);
  content?: StickyScrollItem[];
  className?: string;
  height?: string;
}

export function StickyScroll({
  children,
  content,
  className = "",
  height,
}: StickyScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update active index based on scroll
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (content) {
      const index = Math.min(
        Math.floor(latest * content.length),
        content.length - 1
      );
      setActiveIndex(index);
    }
  });

  // If content prop is provided, render the content-based layout
  if (content && content.length > 0) {
    const totalHeight = height || `${content.length * 100}vh`;

    if (!mounted) {
      return (
        <div className={className}>
          <div className="text-center">
            <h3 className="text-2xl font-bold">{content[0].title}</h3>
            <p className="text-black">{content[0].description}</p>
          </div>
        </div>
      );
    }

    return (
      <div ref={containerRef} className={`relative ${className}`} style={{ height: totalHeight }}>
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="space-y-8">
              {content.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: activeIndex === index ? 1 : 0.3,
                    y: activeIndex === index ? 0 : 10,
                  }}
                  transition={{ duration: 0.5 }}
                  className={`transition-all ${activeIndex === index ? 'scale-100' : 'scale-95'}`}
                >
                  <h3 className="text-2xl md:text-3xl font-bold text-black mb-2">
                    {item.title}
                  </h3>
                  <p className="text-black text-lg">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Right side - Visual content */}
            <div className="relative h-64 md:h-96">
              {content.map((item, index) => (
                <motion.div
                  key={index}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: activeIndex === index ? 1 : 0,
                    scale: activeIndex === index ? 1 : 0.8,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {item.content}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original children-based implementation
  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ height: height || "300vh" }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {typeof children === "function" ? children(scrollYProgress) : children}
      </div>
    </div>
  );
}

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
}

export function HorizontalScroll({ children, className = "" }: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={className}>
        <div className="flex">{children}</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative h-[300vh] ${className}`}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex">
          {children}
        </motion.div>
      </div>
    </div>
  );
}

interface ScrollProgressProps {
  className?: string;
  color?: string;
}

export function ScrollProgress({ className = "", color = "#FFB800" }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 origin-left z-50 ${className}`}
      style={{
        scaleX: scrollYProgress,
        backgroundColor: color,
      }}
    />
  );
}

interface ScrollFadeProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
}

export function ScrollFade({
  children,
  className = "",
  threshold = 0.2,
  direction = "up",
  delay = 0,
}: ScrollFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Use layoutEffect: false to prevent hydration mismatch with SSR
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
    layoutEffect: false,
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, threshold, 1 - threshold, 1],
    [0, 1, 1, 0]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Direction-based initial offset
  const getInitialTransform = () => {
    switch (direction) {
      case "up": return { y: 30 };
      case "down": return { y: -30 };
      case "left": return { x: 30 };
      case "right": return { x: -30 };
      default: return { y: 30 };
    }
  };

  if (!mounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...getInitialTransform() }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
