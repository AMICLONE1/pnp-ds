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
            <p className="text-gray-600">{content[0].description}</p>
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
                  <h3 className="text-2xl md:text-3xl font-bold text-charcoal mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-lg">
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


interface StickyTextFillProps {
  texts: string[];
  className?: string;
  height?: string;
  textClassName?: string;
  backgroundColor?: string;
  fadeDirection?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'none';
}

function TextFillItem({
  text,
  index,
  totalTexts,
  scrollYProgress,
  textClassName,
  fadeDirection = 'none',
}: {
  text: string;
  index: number;
  totalTexts: number;
  scrollYProgress: MotionValue<number>;
  textClassName: string;
  fadeDirection?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'none';
}) {
  // Calculate progress for each text segment
  const segmentStart = index / totalTexts;
  const segmentEnd = (index + 1) / totalTexts;

  // Opacity: show only when in this segment
  const opacity = useTransform(
    scrollYProgress,
    [
      Math.max(0, segmentStart - 0.05),
      segmentStart + 0.05,
      segmentEnd - 0.15,
      segmentEnd - 0.05,
    ],
    [0, 1, 1, 0]
  );

  // Clip path progress for fill effect (0 to 1 within segment)
  const fillProgress = useTransform(
    scrollYProgress,
    [segmentStart, segmentEnd],
    [0, 1]
  );

  // Convert fillProgress to clip-path percentage
  const clipPath = useTransform(
    fillProgress,
    (progress) => `inset(0 ${100 - progress * 100}% 0 0)`
  );

  // Different fade animations based on direction
  let y = useTransform(scrollYProgress, [segmentStart, segmentEnd], [0, 0]);
  let x = useTransform(scrollYProgress, [segmentStart, segmentEnd], [0, 0]);
  let scale = useTransform(scrollYProgress, [segmentStart, segmentEnd], [1, 1]);

  switch (fadeDirection) {
    case 'up':
      y = useTransform(
        scrollYProgress,
        [
          Math.max(0, segmentStart - 0.05),
          segmentStart + 0.05,
          segmentEnd - 0.15,
          segmentEnd - 0.05,
        ],
        [100, 0, 0, -100]
      );
      break;
    case 'down':
      y = useTransform(
        scrollYProgress,
        [
          Math.max(0, segmentStart - 0.05),
          segmentStart + 0.05,
          segmentEnd - 0.15,
          segmentEnd - 0.05,
        ],
        [-100, 0, 0, 100]
      );
      break;
    case 'left':
      x = useTransform(
        scrollYProgress,
        [
          Math.max(0, segmentStart - 0.05),
          segmentStart + 0.05,
          segmentEnd - 0.15,
          segmentEnd - 0.05,
        ],
        [100, 0, 0, -100]
      );
      break;
    case 'right':
      x = useTransform(
        scrollYProgress,
        [
          Math.max(0, segmentStart - 0.05),
          segmentStart + 0.05,
          segmentEnd - 0.15,
          segmentEnd - 0.05,
        ],
        [-100, 0, 0, 100]
      );
      break;
    case 'scale':
      scale = useTransform(
        scrollYProgress,
        [
          Math.max(0, segmentStart - 0.05),
          segmentStart + 0.05,
          segmentEnd - 0.15,
          segmentEnd - 0.05,
        ],
        [0.6, 1, 1, 0.6]
      );
      break;
  }
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity, y, x, scale }}
    >
      <div className="relative inline-block">
        {/* Base text with stroke only */}
        <h2
          className={`text-5xl md:text-7xl lg:text-8xl font-bold text-center px-4 ${textClassName}`}
          style={{
            WebkitTextFillColor: "transparent",
            WebkitTextStroke: "2px white",
            margin: 0,
          }}
        >
          {text}
        </h2>
        {/* Filled text overlay */}
        <motion.h2
          className={`absolute top-0 left-0 right-0 text-5xl md:text-7xl lg:text-8xl font-bold text-center px-4 ${textClassName}`}
          style={{
            WebkitTextFillColor: "white",
            clipPath,
            margin: 0,
            pointerEvents: "none",
          }}
        >
          {text}
        </motion.h2>
      </div>
    </motion.div>
  );
}

export function StickyTextFill({
  texts,
  className = "",
  height = "300vh",
  textClassName = "",
  backgroundColor = "bg-charcoal",
  fadeDirection = 'none',
}: StickyTextFillProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  return (
    <div
      ref={containerRef}
      className={`w-full ${className} ${backgroundColor}`}
      style={{
        height,
        position: 'relative'
      }}
    >
      <div
        className="sticky top-0 left-0 w-full h-screen flex items-center justify-center overflow-hidden"
        style={{
          position: 'sticky',
          top: 0,
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {texts.map((text, index) => (
            <TextFillItem
              key={index}
              text={text}
              index={index}
              totalTexts={texts.length}
              scrollYProgress={scrollYProgress}
              textClassName={textClassName}
              fadeDirection={fadeDirection}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
