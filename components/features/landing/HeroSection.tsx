"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence, useAnimationControls } from "framer-motion";
import { useRef, useState, useEffect, Suspense, useMemo, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { 
  ArrowRight, 
  Play, 
  Sparkles, 
  Users, 
  TrendingUp, 
  Leaf, 
  Shield,
  ChevronDown,
  Zap,
  Sun,
  Battery,
  Bolt,
  CircleDollarSign,
  CheckCircle2,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SOLAR_CONSTANTS } from "@/lib/solar-constants";

// Dynamically import Three.js canvas to prevent SSR issues
const Hero3DScene = dynamic(() => import("./Hero3DScene"), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest-light to-forest-dark" />
});

// Stats data
const heroStats = [
  { icon: Users, value: "1,247+", label: "Families Saving", color: "text-gold" },
  { icon: TrendingUp, value: "₹1.8Cr", label: "Saved This Month", color: "text-energy-green" },
  { icon: Leaf, value: "500 MT", label: "CO₂ Offset", color: "text-energy-blue" },
  { icon: Shield, value: "75%", label: "Guaranteed", color: "text-purple-400" },
];

// ============================================
// ENERGY WAVE ANIMATION
// ============================================
function EnergyWaves() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/20"
          initial={{ width: 100, height: 100, opacity: 0.6 }}
          animate={{
            width: [100, 800],
            height: [100, 800],
            opacity: [0.4, 0],
          }}
          transition={{
            duration: 4,
            delay: i * 1.3,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// FLOATING ICONS ANIMATION
// ============================================
function FloatingIcons() {
  const icons = [
    { Icon: Sun, color: "#FFB800", x: "10%", y: "20%", delay: 0 },
    { Icon: Bolt, color: "#4CAF50", x: "85%", y: "15%", delay: 0.5 },
    { Icon: Battery, color: "#00BCD4", x: "75%", y: "70%", delay: 1 },
    { Icon: Leaf, color: "#4CAF50", x: "15%", y: "75%", delay: 1.5 },
    { Icon: Zap, color: "#FFB800", x: "90%", y: "45%", delay: 2 },
    { Icon: CircleDollarSign, color: "#4CAF50", x: "5%", y: "50%", delay: 2.5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, color, x, y, delay }, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ delay: 2 + delay, duration: 0.5 }}
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon size={40 + i * 5} color={color} strokeWidth={1} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================
// MORPHING BLOB ANIMATION
// ============================================
function MorphingBlob({ className, color = "#FFB800" }: { className?: string; color?: string }) {
  return (
    <motion.div
      className={cn("absolute rounded-full blur-3xl", className)}
      style={{ background: color }}
      animate={{
        borderRadius: [
          "60% 40% 30% 70%/60% 30% 70% 40%",
          "30% 60% 70% 40%/50% 60% 30% 60%",
          "60% 40% 30% 70%/60% 30% 70% 40%",
        ],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// ============================================
// GLITCH TEXT EFFECT
// ============================================
function GlitchText({ text, className }: { text: string; className?: string }) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={cn("relative inline-block", className)}>
      <span className="relative z-10">{text}</span>
      {isGlitching && (
        <>
          <span 
            className="absolute top-0 left-0 text-red-500/50 z-0"
            style={{ transform: "translate(-2px, -1px)" }}
          >
            {text}
          </span>
          <span 
            className="absolute top-0 left-0 text-cyan-500/50 z-0"
            style={{ transform: "translate(2px, 1px)" }}
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
}

// ============================================
// TYPEWRITER EFFECT
// ============================================
function TypewriterText({ 
  texts, 
  className,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000 
}: { 
  texts: string[]; 
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}) {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, textIndex, isDeleting, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-[3px] h-[1em] bg-gold ml-1 align-middle"
      />
    </span>
  );
}

// ============================================
// ANIMATED NUMBER TICKER
// ============================================
function NumberTicker({ 
  value, 
  direction = "up",
  className 
}: { 
  value: number; 
  direction?: "up" | "down";
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "up" ? 0 : value);
  const springValue = useSpring(motionValue, { damping: 60, stiffness: 100 });
  const [displayValue, setDisplayValue] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isInView]);

  useEffect(() => {
    if (isInView) {
      motionValue.set(direction === "up" ? value : 0);
    }
  }, [isInView, motionValue, value, direction]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <span ref={ref} className={className}>
      {displayValue.toLocaleString()}
    </span>
  );
}

// ============================================
// ROTATING WORDS
// ============================================
function RotatingWords({ words, className }: { words: string[]; className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <span className={cn("relative inline-block overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="inline-block"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ============================================
// MAGNETIC BUTTON
// ============================================
function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// PULSE RING ANIMATION
// ============================================
function PulseRing({ className, color = "#FFB800" }: { className?: string; color?: string }) {
  return (
    <div className={cn("relative", className)}>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{ border: `2px solid ${color}` }}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: [1, 2], opacity: [0.5, 0] }}
          transition={{
            duration: 2,
            delay: i * 0.6,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// ANIMATED GRADIENT BORDER
// ============================================
function GradientBorder({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative p-[2px] rounded-2xl overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, #FFB800, #4CAF50, #00BCD4, #FFB800)",
          backgroundSize: "300% 100%",
        }}
        animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative bg-forest-dark rounded-2xl">
        {children}
      </div>
    </div>
  );
}

// ============================================
// SHIMMERING TEXT
// ============================================
function ShimmeringText({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span
      className={cn("relative inline-block bg-clip-text text-transparent", className)}
      style={{
        backgroundImage: "linear-gradient(90deg, #FFB800 0%, #FFF 50%, #FFB800 100%)",
        backgroundSize: "200% 100%",
      }}
      animate={{ backgroundPosition: ["100% 0%", "-100% 0%"] }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
    >
      {text}
    </motion.span>
  );
}

// ============================================
// FLOATING CARD STACK
// ============================================
function FloatingCardStack() {
  const cards = [
    { icon: Sun, label: "Solar Power", value: "100kW", color: "#FFB800" },
    { icon: Leaf, label: "CO₂ Saved", value: "50 MT", color: "#4CAF50" },
    { icon: Zap, label: "Energy", value: "450 kWh", color: "#00BCD4" },
  ];

  return (
    <div className="relative h-48 w-48">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4"
          initial={{ y: i * 10, rotate: -5 + i * 5, scale: 1 - i * 0.05 }}
          animate={{
            y: [i * 10, i * 10 - 5, i * 10],
            rotate: [-5 + i * 5, -3 + i * 5, -5 + i * 5],
          }}
          transition={{
            duration: 3,
            delay: i * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ zIndex: cards.length - i }}
        >
          <card.icon size={24} color={card.color} />
          <p className="text-white/60 text-xs mt-2">{card.label}</p>
          <p className="text-white font-bold text-lg">{card.value}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================
// ANIMATED CHECK LIST
// ============================================
function AnimatedCheckList({ items, delay = 0 }: { items: string[]; delay?: number }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <motion.li
          key={item}
          className="flex items-center gap-3 text-white/80"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + i * 0.15, duration: 0.4 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + i * 0.15 + 0.2, type: "spring" }}
          >
            <CheckCircle2 className="w-5 h-5 text-energy-green" />
          </motion.div>
          <span>{item}</span>
        </motion.li>
      ))}
    </ul>
  );
}

// ============================================
// STAR RATING ANIMATION
// ============================================
function StarRating({ rating = 5, delay = 0 }: { rating?: number; delay?: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ 
            opacity: i < rating ? 1 : 0.3, 
            scale: 1, 
            rotate: 0 
          }}
          transition={{ delay: delay + i * 0.1, type: "spring" }}
        >
          <Star 
            className={cn(
              "w-5 h-5",
              i < rating ? "text-gold fill-gold" : "text-gray-500"
            )} 
          />
        </motion.div>
      ))}
    </div>
  );
}

// ============================================
// ORIGINAL COMPONENTS (preserved)
// ============================================

// Floating particles component
function FloatingParticles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gold/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Animated background with gradient mesh
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f14] via-[#0D2818] to-[#061610]" />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,184,0,0.15) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(76,175,80,0.15) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0,188,212,0.1) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

// Mouse follower spotlight
function MouseSpotlight() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const spotlightX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const spotlightY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-0 hidden lg:block"
      style={{
        x: spotlightX,
        y: spotlightY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <div 
        className="w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,184,0,0.08) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />
    </motion.div>
  );
}

// Animated text with split characters
function SplitText({ 
  text, 
  className, 
  delay = 0,
  staggerDelay = 0.03 
}: { 
  text: string; 
  className?: string; 
  delay?: number;
  staggerDelay?: number;
}) {
  const words = text.split(" ");
  
  return (
    <span className={cn("inline-block", className)}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-[0.25em]">
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className="inline-block"
              initial={{ y: 100, opacity: 0, rotateX: -90 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              transition={{
                duration: 0.6,
                delay: delay + (wordIndex * word.length + charIndex) * staggerDelay,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
}

// Animated counter
function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const end = value;
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * end));
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// Glowing badge
function GlowingBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
      className="inline-block mb-8"
    >
      <motion.div
        className="relative inline-flex items-center gap-3 px-5 py-2.5 rounded-full"
        whileHover={{ scale: 1.02 }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-gold/20 via-energy-green/20 to-gold/20 rounded-full blur-xl" />
        
        <div className="relative inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <Sun className="w-5 h-5 text-gold" />
            <motion.div
              className="absolute inset-0"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sun className="w-5 h-5 text-gold" />
            </motion.div>
          </motion.div>
          <span className="text-sm font-medium text-white">India&apos;s #1 Digital Solar Platform</span>
          <span className="px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-gold to-gold-light text-charcoal rounded-full shadow-lg shadow-gold/20">
            NEW
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Interactive savings calculator card with SundayGrids-style calculation
function InteractiveSavingsCard() {
  const [avgBill, setAvgBill] = useState(2500);
  const [savingsPercent, setSavingsPercent] = useState(75);
  const [isBillFocused, setIsBillFocused] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  // Calculate all values based on bill and savings percentage
  const calculations = useMemo(() => {
    // Monthly savings target
    const monthlySavings = (avgBill * savingsPercent) / 100;
    
    // Energy needed to generate these savings (kWh)
    // savings = energy * credit rate => energy = savings / credit rate
    const energyNeededKwh = monthlySavings / SOLAR_CONSTANTS.creditRatePerUnit;
    
    // Solar capacity needed (in Watts)
    // energy = capacity * generation per kW per day * days
    // capacity = energy / (generation per kW per day * days)
    const monthlyGenerationPerKw = SOLAR_CONSTANTS.avgGenerationPerKwPerDay * SOLAR_CONSTANTS.daysPerMonth;
    const capacityNeededKw = energyNeededKwh / monthlyGenerationPerKw;
    const capacityNeededWatts = Math.round(capacityNeededKw * 1000);
    
    // Annual and lifetime savings
    const annualSavings = monthlySavings * 12;
    const lifetimeSavings = annualSavings * SOLAR_CONSTANTS.projectLifespan;
    
    // One-time reservation fee
    const reservationFee = capacityNeededWatts * SOLAR_CONSTANTS.reservationFeePerWatt;
    
    // CO2 offset per year (in tonnes)
    const annualEnergyKwh = energyNeededKwh * 12;
    const co2OffsetKg = annualEnergyKwh * SOLAR_CONSTANTS.co2PerKwh;
    const co2OffsetTonnes = co2OffsetKg / 1000;
    
    // Return on Investment (years to recover reservation fee)
    const roiYears = reservationFee / annualSavings;
    
    return {
      monthlySavings: Math.round(monthlySavings * 100) / 100,
      energyProducedKwh: Math.round(energyNeededKwh * 100) / 100,
      reservedSolarWatts: capacityNeededWatts,
      reservedSolarKw: Math.round(capacityNeededKw * 100) / 100,
      annualSavings: Math.round(annualSavings * 100) / 100,
      lifetimeSavings: Math.round(lifetimeSavings * 100) / 100,
      reservationFee: Math.round(reservationFee * 100) / 100,
      co2OffsetTonnes: Math.round(co2OffsetTonnes * 100) / 100,
      roiYears: Math.round(roiYears * 10) / 10,
    };
  }, [avgBill, savingsPercent]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX((y - centerY) / 25);
    setRotateY((centerX - x) / 25);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
      className="relative max-w-sm mx-auto"
    >
      {/* Subtle glow */}
      <div 
        className="absolute -inset-1 rounded-2xl opacity-40 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,184,0,0.3) 0%, rgba(76,175,80,0.3) 100%)",
          filter: "blur(20px)",
        }}
      />
      
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX * 0.3}deg) rotateY(${rotateY * 0.3}deg)`,
        }}
        className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-5 overflow-hidden transition-transform duration-150"
      >
        {/* Card shine effect */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${50 + rotateY * 3}% ${50 - rotateX * 3}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
          }}
        />
        
        {/* Project Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Sun className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-energy-green rounded-full border-2 border-forest-dark" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Vedvyas</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gold font-medium">100 kW</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-energy-green/20 text-energy-green font-medium">LIVE</span>
              </div>
            </div>
          </div>
          <div className="text-right bg-white/5 rounded-lg px-2.5 py-1.5">
            <p className="text-[8px] text-white/40 uppercase tracking-wide">Credit Rate</p>
            <p className="text-gold font-bold text-sm">₹7<span className="text-[9px] text-white/40">/unit</span></p>
          </div>
        </div>
        
        {/* Enhanced Inputs */}
        <div className="space-y-4 mb-4">
          {/* Bill Input - Enhanced */}
          <div>
            <label className="text-[10px] text-white/60 font-medium mb-1.5 flex items-center gap-1.5">
              <CircleDollarSign className="w-3 h-3" />
              Monthly Electricity Bill
            </label>
            <div className={cn(
              "relative flex items-center rounded-xl border-2 transition-all duration-200 overflow-hidden",
              isBillFocused 
                ? "border-gold/60 bg-gradient-to-r from-gold/10 to-transparent shadow-lg shadow-gold/10" 
                : "border-white/15 bg-white/5 hover:border-white/25"
            )}>
              <div className="pl-3.5 pr-1 py-3 flex items-center">
                <span className="text-gold font-bold text-lg">₹</span>
              </div>
              <input
                type="number"
                value={avgBill}
                onChange={(e) => setAvgBill(Math.max(0, Math.min(100000, Number(e.target.value) || 0)))}
                onFocus={() => setIsBillFocused(true)}
                onBlur={() => setIsBillFocused(false)}
                placeholder="2500"
                className="flex-1 bg-transparent text-white font-bold text-xl py-2.5 outline-none 
                           [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <div className="pr-3 text-white/30 text-[10px]">/month</div>
            </div>
            {/* Quick presets */}
            <div className="flex gap-1.5 mt-2">
              {[1000, 2500, 5000, 10000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAvgBill(preset)}
                  className={cn(
                    "flex-1 py-1 px-2 text-[10px] font-medium rounded-md transition-all",
                    avgBill === preset 
                      ? "bg-gold/20 text-gold border border-gold/30" 
                      : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
                  )}
                >
                  ₹{(preset/1000).toFixed(preset >= 1000 ? 0 : 1)}k
                </button>
              ))}
            </div>
          </div>
          
          {/* Savings Slider - Enhanced */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] text-white/60 font-medium flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3" />
                Target Savings
              </label>
              <div className="flex items-center gap-1.5 bg-energy-green/20 rounded-full px-2.5 py-1">
                <span className="text-energy-green font-bold text-sm">{savingsPercent}%</span>
              </div>
            </div>
            <div className="relative pt-1 pb-2">
              {/* Track background with gradient */}
              <div className="absolute top-1 left-0 right-0 h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-energy-green via-energy-blue to-gold rounded-full transition-all duration-150"
                  style={{ width: `${((savingsPercent - 10) / 90) * 100}%` }}
                />
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={savingsPercent}
                onChange={(e) => setSavingsPercent(Number(e.target.value))}
                className="relative w-full h-2 bg-transparent rounded-full appearance-none cursor-pointer z-10
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                           [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                           [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-energy-green/40
                           [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2
                           [&::-webkit-slider-thumb]:border-energy-green [&::-webkit-slider-thumb]:transition-transform
                           [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:active:scale-95"
              />
              {/* Tick marks */}
              <div className="flex justify-between mt-1 px-0.5">
                {[10, 25, 50, 75, 100].map((tick) => (
                  <span 
                    key={tick} 
                    className={cn(
                      "text-[8px] transition-colors",
                      savingsPercent >= tick ? "text-energy-green" : "text-white/30"
                    )}
                  >
                    {tick}%
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Savings - Prominent */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-forest-dark/60 to-forest/40 border border-gold/20 mb-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap className="w-3.5 h-3.5 text-gold" />
            <span className="text-white/60 text-[10px]">Monthly Savings</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-heading font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
              {formatCurrency(calculations.monthlySavings)}
            </span>
          </div>
          <p className="text-energy-green text-[10px] flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {formatCurrency(calculations.annualSavings)}/year
          </p>
        </div>
        
        {/* Stats Grid - Compact */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="p-2 rounded-lg bg-white/5 text-center">
            <Sun className="w-3 h-3 text-gold mx-auto mb-0.5" />
            <p className="text-white font-bold text-xs">{(calculations.reservedSolarWatts / 1000).toFixed(1)}kW</p>
            <p className="text-white/40 text-[9px]">Solar</p>
          </div>
          <div className="p-2 rounded-lg bg-white/5 text-center">
            <Bolt className="w-3 h-3 text-energy-blue mx-auto mb-0.5" />
            <p className="text-white font-bold text-xs">{calculations.energyProducedKwh.toFixed(0)}</p>
            <p className="text-white/40 text-[9px]">kWh/mo</p>
          </div>
          <div className="p-2 rounded-lg bg-white/5 text-center">
            <Leaf className="w-3 h-3 text-energy-green mx-auto mb-0.5" />
            <p className="text-white font-bold text-xs">{calculations.co2OffsetTonnes.toFixed(1)}T</p>
            <p className="text-white/40 text-[9px]">CO₂/yr</p>
          </div>
        </div>
        
        {/* Reservation Fee & CTA - Compact */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-forest-dark/60 to-forest/40 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-white/50 text-[9px]">One-time Fee</p>
              <p className="text-white font-bold text-sm">{formatCurrency(calculations.reservationFee)}</p>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-[9px]">Payback</p>
              <p className="text-energy-green font-bold text-sm">{calculations.roiYears}y</p>
            </div>
          </div>
          <Link href={`/reserve?capacity=${calculations.reservedSolarKw}&project=vedvyas`} className="block">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-energy-green to-energy-green/90 text-white font-bold text-sm rounded-lg
                         shadow-md shadow-energy-green/20 flex items-center justify-center gap-1.5 group"
            >
              Get Started Free
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// Stat pill with animation
function StatPill({ 
  icon: Icon, 
  value, 
  label, 
  color, 
  delay 
}: { 
  icon: React.ElementType; 
  value: string; 
  label: string; 
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      whileHover={{ scale: 1.05, y: -3 }}
      className="group"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/15 hover:border-white/30 transition-all cursor-default">
        <Icon className={cn("w-4 h-4", color)} />
        <span className="font-semibold text-white text-sm">{value}</span>
        <span className="text-white/60 text-sm hidden sm:inline">{label}</span>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
    layoutEffect: false,
  });
  
  // Reduced parallax effects for better UX
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.7], [0, 50]);

  // Rotating words for dynamic headline
  const savingsWords = ["Save More", "Go Green", "Cut Bills", "Own Solar"];
  const benefitWords = ["cleaner", "cheaper", "smarter", "better"];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Three.js Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<AnimatedBackground />}>
          <Hero3DScene />
        </Suspense>
      </div>
      
      {/* Gradient overlay */}
      <AnimatedBackground />
      
      {/* Floating particles */}
      <FloatingParticles />
      
      {/* Energy Waves */}
      <EnergyWaves />
      
      {/* Floating Icons */}
      <FloatingIcons />
      
      {/* Morphing Blobs */}
      <MorphingBlob 
        className="w-96 h-96 -top-20 -left-20 opacity-20" 
        color="rgba(255, 184, 0, 0.3)" 
      />
      <MorphingBlob 
        className="w-80 h-80 -bottom-20 -right-20 opacity-15" 
        color="rgba(76, 175, 80, 0.3)" 
      />
      
      {/* Mouse spotlight */}
      <MouseSpotlight />
      
      <motion.div 
        style={{ opacity, y }}
        className="relative z-10 container mx-auto px-4 lg:px-8 py-24 md:py-32"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-white">
            <GlowingBadge />
            
            {/* Trust Badge with Star Rating */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex items-center gap-3 mb-4"
            >
              <StarRating rating={5} delay={0.5} />
              <span className="text-white/60 text-sm">Trusted by 1,200+ families</span>
            </motion.div>
            
            {/* Main Headline with Enhanced Animations */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] tracking-tight mb-6">
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  Stop Paying
                </motion.div>
              </div>
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  <ShimmeringText text="Full Price" className="font-bold" />
                </motion.div>
              </div>
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  for Electricity
                </motion.div>
              </div>
            </h1>
            
            {/* Dynamic Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-xl md:text-2xl text-gray-300 mb-4 max-w-lg"
            >
              Go Solar in <span className="text-gold font-semibold">60 Seconds</span>. 
              <br className="hidden md:block" />
              No Roof Required. No Installation.
            </motion.p>
            
            {/* Typewriter Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mb-6"
            >
              <span className="text-lg text-gray-400">
                Make your energy{" "}
                <TypewriterText 
                  texts={benefitWords} 
                  className="text-energy-green font-semibold"
                />
              </span>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-base text-gray-400 mb-6 max-w-lg"
            >
              The average family saves{" "}
              <span className="text-gold font-medium">
                ₹<NumberTicker value={24000} className="text-gold font-medium" />
              </span>{" "}
              per year with Digital Solar.
            </motion.p>
            
            {/* Animated Benefits Checklist */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="mb-8"
            >
              <AnimatedCheckList 
                items={[
                  "No rooftop required",
                  "Zero maintenance costs", 
                  "75% guaranteed savings"
                ]}
                delay={1.5}
              />
            </motion.div>
            
            {/* Stats with Gradient Border */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              {heroStats.map((stat, index) => (
                <StatPill
                  key={stat.label}
                  {...stat}
                  delay={1.9 + index * 0.1}
                />
              ))}
            </motion.div>
            
            {/* CTAs with Magnetic Effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <MagneticButton>
                <Link href="/reserve">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="relative w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-charcoal font-bold shadow-2xl shadow-gold/30 group overflow-hidden"
                    >
                      {/* Button shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      />
                      <span className="relative z-10 flex items-center">
                        Start Saving Today
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </motion.div>
                </Link>
              </MagneticButton>
              
              <MagneticButton>
                <Link href="/#how-it-works">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto text-lg px-8 py-6 border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold group"
                    >
                      <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                      See How It Works
                    </Button>
                  </motion.div>
                </Link>
              </MagneticButton>
            </motion.div>
          </div>
          
          {/* Right Content - Interactive Card with Gradient Border */}
          <div className="hidden lg:block">
            <GradientBorder className="max-w-sm mx-auto">
              <div className="p-1">
                <InteractiveSavingsCard />
              </div>
            </GradientBorder>
          </div>
        </div>
        
        {/* Mobile Calculator Card */}
        <div className="lg:hidden mt-8">
          <GradientBorder>
            <div className="p-1">
              <InteractiveSavingsCard />
            </div>
          </GradientBorder>
        </div>
      </motion.div>
      
      {/* Scroll Indicator with Pulse Ring */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.button
          onClick={() => {
            const element = document.getElementById('stats-section');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="relative flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <PulseRing className="w-10 h-10 absolute -top-2" color="rgba(255,184,0,0.5)" />
          <span className="text-sm font-medium">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </section>
  );
}
