"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Sun, Zap, Leaf } from "lucide-react";

// ============================================
// ANIMATED SUN RAYS (Canvas - lightweight)
// ============================================
function SunRaysCanvas({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const progressRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const unsubscribe = scrollProgress.on("change", (v) => {
      progressRef.current = v;
    });
    return unsubscribe;
  }, [scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      const { width, height } = canvas;
      const progress = progressRef.current;
      timeRef.current += 0.005;

      // Clear
      ctx.clearRect(0, 0, width, height);

      // Draw subtle sun rays from center
      const centerX = width / 2;
      const centerY = height / 2;
      const rayCount = 12;
      const maxRadius = Math.max(width, height) * 0.8;

      ctx.save();
      
      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2 + timeRef.current * 0.2;
        const rayWidth = 0.02 + progress * 0.03;
        
        // Create gradient for each ray
        const gradient = ctx.createLinearGradient(
          centerX, centerY,
          centerX + Math.cos(angle) * maxRadius,
          centerY + Math.sin(angle) * maxRadius
        );
        
        const alpha = 0.03 + progress * 0.04;
        gradient.addColorStop(0, `rgba(255, 184, 0, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(255, 184, 0, ${alpha * 0.5})`);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, maxRadius, angle - rayWidth, angle + rayWidth);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      ctx.restore();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
    />
  );
}

// ============================================
// FLOATING SOLAR ELEMENTS
// ============================================
function FloatingSolarElements({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.2, 0.8, 1], [0.3, 0.6, 0.6, 0.3]);

  const elements = [
    { Icon: Sun, x: '8%', y: '25%', size: 32, delay: 0, color: '#FFB800' },
    { Icon: Zap, x: '92%', y: '30%', size: 28, delay: 0.5, color: '#4CAF50' },
    { Icon: Leaf, x: '85%', y: '70%', size: 26, delay: 1, color: '#4CAF50' },
    { Icon: Sun, x: '12%', y: '75%', size: 24, delay: 1.5, color: '#FFB800' },
  ];

  return (
    <motion.div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity }}>
      {elements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: el.x, top: el.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.4,
            scale: 1,
            y: [0, -15, 0],
          }}
          transition={{
            opacity: { delay: el.delay, duration: 0.5 },
            scale: { delay: el.delay, duration: 0.5 },
            y: { delay: el.delay, duration: 4 + i, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <el.Icon size={el.size} color={el.color} strokeWidth={1.5} />
        </motion.div>
      ))}
    </motion.div>
  );
}

// ============================================
// CENTRAL SUN GLOW
// ============================================
function CentralSunGlow({ progress }: { progress: MotionValue<number> }) {
  const scale = useTransform(progress, [0, 0.5, 1], [0.8, 1.1, 0.9]);
  const opacity = useTransform(progress, [0, 0.3, 0.7, 1], [0.1, 0.25, 0.25, 0.1]);

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ scale, opacity }}
    >
      {/* Outer glow */}
      <div 
        className="w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,184,0,0.15) 0%, rgba(255,184,0,0.05) 40%, transparent 70%)',
        }}
      />
    </motion.div>
  );
}

// ============================================
// ENERGY SAVINGS COUNTER
// ============================================
function SavingsIndicator({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(progress, [0, 0.2, 0.8, 1], [20, 0, 0, -20]);

  return (
    <motion.div
      className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-6 pointer-events-none"
      style={{ opacity, y }}
    >
      {[
        { label: 'Setup Time', value: '5 min' },
        { label: 'Monthly Savings', value: '₹2,000+' },
        { label: 'CO₂ Offset', value: '7.5 tons/yr' },
      ].map((stat, i) => (
        <motion.div
          key={stat.label}
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.15 }}
        >
          <div className="text-gold font-bold text-lg">{stat.value}</div>
          <div className="text-white/50 text-xs">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ============================================
// TEXT FILL ITEM (Solar themed)
// ============================================
function SolarTextFillItem({
  text,
  index,
  totalTexts,
  scrollYProgress,
}: {
  text: string;
  index: number;
  totalTexts: number;
  scrollYProgress: MotionValue<number>;
}) {
  const segmentStart = index / totalTexts;
  const segmentEnd = (index + 1) / totalTexts;

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

  const fillProgress = useTransform(
    scrollYProgress,
    [segmentStart + 0.05, segmentEnd - 0.1],
    [0, 1]
  );

  const clipPath = useTransform(
    fillProgress,
    (progress) => `inset(0 ${100 - progress * 100}% 0 0)`
  );

  const y = useTransform(
    scrollYProgress,
    [
      Math.max(0, segmentStart - 0.05),
      segmentStart + 0.05,
      segmentEnd - 0.15,
      segmentEnd - 0.05,
    ],
    [60, 0, 0, -60]
  );

  // Subtle glow that follows fill
  const glowOpacity = useTransform(fillProgress, [0, 0.5, 1], [0, 0.4, 0.2]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity, y }}
    >
      <div className="relative inline-block max-w-6xl px-4">
        {/* Glow behind text */}
        <motion.div
          className="absolute inset-0 blur-3xl -z-10"
          style={{
            opacity: glowOpacity,
            background: 'linear-gradient(90deg, rgba(255,184,0,0.2), rgba(76,175,80,0.15))',
            transform: 'scale(1.2)',
          }}
        />
        
        {/* Base text - outlined */}
        <h2
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center leading-tight"
          style={{
            WebkitTextFillColor: "transparent",
            WebkitTextStroke: "1.5px rgba(255,255,255,0.4)",
            margin: 0,
          }}
        >
          {text}
        </h2>
        
        {/* Filled text - gold gradient */}
        <motion.h2
          className="absolute top-0 left-0 right-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center leading-tight"
          style={{
            background: 'linear-gradient(90deg, #FFB800, #FFC933)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
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

// ============================================
// MAIN EXPORT
// ============================================
interface EnhancedStickyTextFillProps {
  texts: string[];
  className?: string;
  height?: string;
  textClassName?: string;
  backgroundColor?: string;
  fadeDirection?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'none';
}

export function EnhancedStickyTextFill({
  texts,
  className = "",
  height = "300vh",
  backgroundColor = "bg-charcoal",
}: EnhancedStickyTextFillProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={containerRef}
      className={`w-full ${className} ${backgroundColor}`}
      style={{ height, position: 'relative' }}
    >
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal to-forest/20" />
        
        {/* Sun rays */}
        <SunRaysCanvas scrollProgress={scrollYProgress} />
        
        {/* Central glow */}
        <CentralSunGlow progress={scrollYProgress} />
        
        {/* Floating solar icons */}
        <FloatingSolarElements progress={scrollYProgress} />
        
        {/* Text content */}
        <div className="relative w-full h-full flex items-center justify-center z-10">
          {texts.map((text, index) => (
            <SolarTextFillItem
              key={index}
              text={text}
              index={index}
              totalTexts={texts.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
        
        {/* Savings indicators */}
        <SavingsIndicator progress={scrollYProgress} />
        
        {/* Minimal scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="w-5 h-8 rounded-full border border-white/30 flex justify-center pt-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              className="w-1 h-2 rounded-full bg-gold"
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
