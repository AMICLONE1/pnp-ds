"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useTransform, animate } from "framer-motion";

interface NumberMorphProps {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
  format?: boolean;
}

export function NumberMorph({
  value,
  className = "",
  prefix = "",
  suffix = "",
  duration = 2,
  delay = 0,
  format = true,
}: NumberMorphProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [mounted, setMounted] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || hasAnimated.current) return;
    
    const timeout = setTimeout(() => {
      hasAnimated.current = true;
      const controls = animate(0, value, {
        duration,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          setDisplayValue(Math.round(latest));
        },
      });

      return () => controls.stop();
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [value, duration, delay, mounted]);

  const formattedValue = format
    ? displayValue.toLocaleString("en-IN")
    : displayValue.toString();

  return (
    <span className={className}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  onComplete?: () => void;
}

export function CountUp({
  end,
  start = 0,
  duration = 2,
  delay = 0,
  className = "",
  prefix = "",
  suffix = "",
  decimals = 0,
  onComplete,
}: CountUpProps) {
  const [count, setCount] = useState(start);
  const [mounted, setMounted] = useState(false);
  const countRef = useRef(start);
  const hasStarted = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || hasStarted.current) return;
    
    const timer = setTimeout(() => {
      hasStarted.current = true;
      const startTime = Date.now();
      const endTime = startTime + duration * 1000;

      const updateCount = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / (duration * 1000), 1);
        
        // Easing function (ease out cubic)
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * eased;
        
        countRef.current = current;
        setCount(current);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          setCount(end);
          onComplete?.();
        }
      };

      requestAnimationFrame(updateCount);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [end, start, duration, delay, mounted, onComplete]);

  const displayValue = decimals > 0
    ? count.toFixed(decimals)
    : Math.round(count).toLocaleString("en-IN");

  return (
    <span className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}

interface AnimatedDigitProps {
  digit: string;
  className?: string;
}

function AnimatedDigit({ digit, className = "" }: AnimatedDigitProps) {
  return (
    <div className={`relative h-[1em] overflow-hidden ${className}`}>
      <motion.div
        key={digit}
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        exit={{ y: "-100%" }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {digit}
      </motion.div>
    </div>
  );
}

interface RollingNumberProps {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function RollingNumber({
  value,
  className = "",
  prefix = "",
  suffix = "",
}: RollingNumberProps) {
  const [mounted, setMounted] = useState(false);
  const digits = value.toLocaleString("en-IN").split("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span className={className}>
        {prefix}{value.toLocaleString("en-IN")}{suffix}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center ${className}`}>
      {prefix}
      {digits.map((digit, index) => (
        <AnimatedDigit key={`${index}-${digit}`} digit={digit} />
      ))}
      {suffix}
    </span>
  );
}

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: string;
  bgColor?: string;
  children?: React.ReactNode;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className = "",
  color = "#FFB800",
  bgColor = "rgba(255,255,255,0.1)",
  children,
}: ProgressRingProps) {
  const [mounted, setMounted] = useState(false);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  const springProgress = useSpring(0, { stiffness: 50, damping: 20 });
  const strokeDashoffset = useTransform(
    springProgress,
    [0, 100],
    [circumference, 0]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      springProgress.set(progress);
    }
  }, [progress, springProgress, mounted]);

  if (!mounted) {
    return (
      <div className={`relative ${className}`} style={{ width: size, height: size }}>
        {children}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
