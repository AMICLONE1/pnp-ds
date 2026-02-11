"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface TextRevealProps {
  children: string;
  className?: string;
  highlightColor?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export function TextReveal({
  children,
  className = "",
  highlightColor = "#FFB800",
  as: Component = "p",
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.25"],
    layoutEffect: false,
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const words = children.split(" ");

  if (!mounted) {
    return (
      <div ref={containerRef} className={className}>
        <Component className="inline">{children}</Component>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      <Component className="inline">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          
          return (
            <Word
              key={i}
              progress={smoothProgress}
              range={[start, end]}
              highlightColor={highlightColor}
            >
              {word}
            </Word>
          );
        })}
      </Component>
    </div>
  );
}

interface WordProps {
  children: string;
  progress: any;
  range: [number, number];
  highlightColor: string;
}

function Word({ children, progress, range, highlightColor }: WordProps) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  const color = useTransform(
    progress,
    range,
    ["rgb(156, 163, 175)", highlightColor]
  );

  return (
    <span className="relative mr-2 md:mr-3 inline-block">
      <motion.span
        style={{ opacity, color }}
        className="transition-all duration-200"
      >
        {children}
      </motion.span>
    </span>
  );
}

// Typewriter effect component
interface TypewriterProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
}

export function Typewriter({
  text,
  className = "",
  speed = 50,
  delay = 0,
  onComplete,
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay, mounted]);

  useEffect(() => {
    if (!started || !mounted) return;

    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [displayedText, started, text, speed, onComplete, mounted]);

  if (!mounted) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {displayedText}
      {displayedText.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block w-[3px] h-[1em] bg-current ml-1 align-middle"
        />
      )}
    </span>
  );
}

// Gradient text reveal
interface GradientTextProps {
  children?: string;
  text?: string;
  className?: string;
  gradient?: string;
  colors?: string[];
}

export function GradientText({
  children,
  text,
  className = "",
  gradient = "from-gold via-gold-light to-energy-green",
  colors,
}: GradientTextProps) {
  const content = text || children || "";
  const gradientStyle = colors 
    ? `linear-gradient(90deg, ${colors.join(", ")})`
    : undefined;
  
  return (
    <span
      className={`bg-gradient-to-r ${!colors ? gradient : ""} bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto] ${className}`}
      style={gradientStyle ? { backgroundImage: gradientStyle } : undefined}
    >
      {content}
    </span>
  );
}

// Split text animation
interface SplitTextProps {
  text?: string;
  children?: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function SplitText({
  text,
  children,
  className = "",
  delay = 0,
  staggerDelay = 0.03,
}: SplitTextProps) {
  const [mounted, setMounted] = useState(false);
  const content = text || children || "";
  const letters = content.split("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className={className}>{content}</span>;
  }

  return (
    <span className={className}>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * staggerDelay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
          style={{ transformOrigin: "bottom" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </span>
  );
}
