"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect } from "react";
import { 
  Users, 
  Leaf, 
  TrendingUp, 
  IndianRupee,
  Zap,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    icon: Users,
    value: 1247,
    suffix: "+",
    prefix: "",
    label: "Families Saving",
    description: "Active users on our platform",
    color: "gold",
    trend: "+12% this month"
  },
  {
    icon: Leaf,
    value: 500,
    suffix: " MT",
    prefix: "",
    label: "CO₂ Offset",
    description: "Environmental impact made",
    color: "energy-green",
    trend: "Growing daily"
  },
  {
    icon: TrendingUp,
    value: 45,
    suffix: "%",
    prefix: "",
    label: "Average Savings",
    description: "On monthly electricity bills",
    color: "energy-blue",
    trend: "Consistent returns"
  },
  {
    icon: IndianRupee,
    value: 50,
    suffix: "Cr+",
    prefix: "₹",
    label: "Total Saved",
    description: "Cumulative savings by users",
    color: "forest",
    trend: "Since launch"
  },
];

// Animated counter hook
function useAnimatedCounter(value: number, duration: number = 2) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest));
  
  useEffect(() => {
    const controls = animate(count, value, { duration, ease: "easeOut" });
    return controls.stop;
  }, [count, value, duration]);
  
  return rounded;
}

// Individual stat card
function StatCard({ 
  stat, 
  index 
}: { 
  stat: typeof stats[0]; 
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const animatedValue = useAnimatedCounter(isInView ? stat.value : 0);
  
  const colors = {
    gold: {
      bg: "bg-gold/10",
      iconBg: "bg-gold",
      text: "text-gold",
      border: "border-gold/20",
      glow: "shadow-gold/20"
    },
    "energy-green": {
      bg: "bg-energy-green/10",
      iconBg: "bg-energy-green",
      text: "text-energy-green",
      border: "border-energy-green/20",
      glow: "shadow-energy-green/20"
    },
    "energy-blue": {
      bg: "bg-energy-blue/10",
      iconBg: "bg-energy-blue",
      text: "text-energy-blue",
      border: "border-energy-blue/20",
      glow: "shadow-energy-blue/20"
    },
    forest: {
      bg: "bg-forest/10",
      iconBg: "bg-forest",
      text: "text-forest",
      border: "border-forest/20",
      glow: "shadow-forest/20"
    }
  };
  
  const colorScheme = colors[stat.color as keyof typeof colors];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group"
    >
      <div className={cn(
        "relative h-full p-6 md:p-8 rounded-2xl bg-white border transition-all duration-300",
        colorScheme.border,
        "hover:shadow-2xl",
        `hover:${colorScheme.glow}`
      )}>
        {/* Background gradient on hover */}
        <div className={cn(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          colorScheme.bg
        )} />
        
        <div className="relative z-10">
          {/* Icon */}
          <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110",
            colorScheme.iconBg
          )}>
            <stat.icon className="w-7 h-7 text-white" />
          </div>
          
          {/* Value */}
          <div className="flex items-baseline gap-1 mb-2">
            <span className={cn("text-4xl md:text-5xl font-heading font-bold", colorScheme.text)}>
              {stat.prefix}
              <motion.span>{animatedValue}</motion.span>
              {stat.suffix}
            </span>
          </div>
          
          {/* Label */}
          <h3 className="text-lg font-semibold text-charcoal mb-1">
            {stat.label}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-gray-500 mb-3">
            {stat.description}
          </p>
          
          {/* Trend indicator */}
          <div className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            colorScheme.bg,
            colorScheme.text
          )}>
            <TrendingUp className="w-3 h-3" />
            {stat.trend}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Live indicator
function LiveIndicator() {
  return (
    <div className="flex items-center gap-2 text-sm">
      <motion.div
        className="w-2 h-2 rounded-full bg-energy-green"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="text-gray-500">Live data</span>
    </div>
  );
}

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      id="stats-section"
      ref={ref}
      className="relative py-24 md:py-32 bg-gradient-to-b from-offwhite to-white overflow-hidden"
    >
      {/* Background patterns */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="stats-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stats-grid)" className="text-charcoal" />
          </svg>
        </div>
        
        {/* Decorative blurs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-energy-green/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-energy-green/10 text-energy-green rounded-full text-sm font-semibold"
            >
              Real Impact
            </motion.span>
            <LiveIndicator />
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-charcoal mb-4">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-forest to-energy-green bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join India&apos;s fastest-growing solar community. Real numbers, real impact, real savings.
          </p>
        </motion.div>
        
        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
        
        {/* Bottom banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.6 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-r from-forest to-forest-light overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="banner-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#banner-pattern)" />
              </svg>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
              <div className="text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-heading font-bold mb-2">
                  Ready to be part of this community?
                </h3>
                <p className="text-white/80">
                  Start saving today with zero installation required.
                </p>
              </div>
              
              <motion.a
                href="/reserve"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 px-6 py-3 bg-gold hover:bg-gold-light text-charcoal font-semibold rounded-xl transition-colors flex items-center gap-2 group"
              >
                Join Now
                <Zap className="w-4 h-4 group-hover:animate-pulse" />
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
