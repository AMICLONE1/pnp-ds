"use client";

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  Zap,
  Home,
  Clock,
  Shield,
  TrendingUp,
  Leaf,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Sun,
  Sparkles,
  Building2,
  Wallet,
  Globe2,
  BadgeCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Define benefit categories (inspired by Acron's navigation structure)
const benefitCategories = [
  {
    id: "convenience",
    number: "01",
    title: "Convenience",
    tagline: "Solar without the hassle.",
    subtitle: "Zero installation, maximum simplicity.",
    description: "No roof, no permits, no technicians. We removed every barrier that made solar complicated. Just choose your capacity and start saving.",
    color: "from-gold via-amber-500 to-orange-500",
    accentColor: "gold",
    features: [
      {
        icon: Home,
        title: "Zero Installation",
        subtitle: "Keep your landlord happy",
        description: "No roof access needed. No permits, no construction, no technicians visiting your home.",
        benefits: ["No roof modifications needed", "Perfect for renters & apartments", "No HOA approval required"]
      },
      {
        icon: Clock,
        title: "5-Minute Setup",
        subtitle: "Faster than your coffee",
        description: "Complete signup during your morning coffee. Choose capacity, pay, and start generating credits immediately.",
        benefits: ["Instant activation", "Zero paperwork", "Start saving today"]
      }
    ]
  },
  {
    id: "savings",
    number: "02",
    title: "Savings",
    tagline: "More money. Every month.",
    subtitle: "Real savings on every electricity bill.",
    description: "The average family saves ₹2,000 monthly. That's an extra vacation every year, just from switching to digital solar.",
    color: "from-gray-200 via-gray-300 to-gray-400",
    accentColor: "gray-300",
    features: [
      {
        icon: TrendingUp,
        title: "₹24,000/Year Savings",
        subtitle: "A vacation's worth annually",
        description: "Average families save ₹2,000 every month. Calculate your exact savings with our calculator.",
        benefits: ["Monthly bill credits", "Predictable savings", "No hidden fees"]
      },
      {
        icon: Shield,
        title: "75% Guaranteed",
        subtitle: "Protected even in monsoon",
        description: "We guarantee 75% of forecasted generation. Protected against weather and shortfalls.",
        benefits: ["Weather protection", "Guaranteed returns", "Risk-free solar"]
      }
    ]
  },
  {
    id: "flexibility",
    number: "03",
    title: "Flexibility",
    tagline: "Your energy. Your way.",
    subtitle: "Solar that moves with your life.",
    description: "Moving cities? Changing homes? Your solar credits follow you. Truly portable clean energy for the modern Indian household.",
    color: "from-energy-blue via-blue-500 to-indigo-500",
    accentColor: "energy-blue",
    features: [
      {
        icon: Zap,
        title: "Portable Solar",
        subtitle: "Your credits move with you",
        description: "Moving cities? Your solar credits move with you. No hardware to pack, no installations to undo.",
        benefits: ["Transfer anytime", "No cancellation hassle", "Nationwide coverage"]
      },
      {
        icon: Globe2,
        title: "Flexible Capacity",
        subtitle: "Scale up or down easily",
        description: "Need more power? Less? Adjust your solar capacity anytime without any physical changes.",
        benefits: ["Easy upgrades", "Downgrade anytime", "No lock-in period"]
      }
    ]
  },
  {
    id: "impact",
    number: "04",
    title: "Impact",
    tagline: "Power that gives back.",
    subtitle: "Real environmental impact, measured.",
    description: "You'll offset 7.5 tons of CO₂ annually—equivalent to planting 340 trees. Make a measurable difference while saving money.",
    color: "from-gray-200 via-gray-300 to-gray-500",
    accentColor: "gray-400",
    features: [
      {
        icon: Leaf,
        title: "340 Trees Equivalent",
        subtitle: "Real environmental impact",
        description: "You'll offset 7.5 tons of CO₂ annually—that's equivalent to planting 340 trees every year.",
        benefits: ["Track your impact", "Carbon certificates", "Green credentials"]
      },
      {
        icon: BadgeCheck,
        title: "Verified Green Energy",
        subtitle: "100% renewable source",
        description: "Every unit of electricity you offset comes from verified solar projects across India.",
        benefits: ["Certified renewable", "Transparent tracking", "Support Indian solar"]
      }
    ]
  }
];

// Navigation pill for category selection
function CategoryNav({
  categories,
  activeIndex,
  onSelect
}: {
  categories: typeof benefitCategories;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-10 lg:mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {categories.map((category, index) => (
        <motion.button
          key={category.id}
          onClick={() => onSelect(index)}
          className={cn(
            "relative px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-full text-xs sm:text-sm md:text-base font-medium transition-all duration-500",
            "flex items-center gap-2",
            activeIndex === index
              ? "text-black shadow-lg z-10"
              : "text-gray-700 bg-white/60 hover:bg-white/80 hover:text-black border border-gray-200/40"
          )}
          whileHover={{ scale: activeIndex === index ? 1 : 1.04 }}
          whileTap={{ scale: 0.96 }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {/* Active background */}
          {activeIndex === index && (
            <motion.div
              layoutId="activeCategory"
              className={cn("absolute inset-0 rounded-full bg-gradient-to-r", category.color)}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                mass: 1
              }}
            />
          )}

          <span className={cn(
            "relative z-10 font-bold transition-colors duration-300",
            activeIndex === index ? "text-black/90" : "text-gray-600"
          )}>
            {category.number}
          </span>
          <span className="relative z-10">{category.title}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}

// Main category display with hero-style layout
function CategoryHero({ category, isActive }: { category: typeof benefitCategories[0]; isActive: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          ref={ref}
          key={category.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1]
          }}
          className="mb-12"
        >
          {/* Category header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4",
                `bg-${category.accentColor}/10 text-${category.accentColor}`
              )}
              style={{
                backgroundColor: `rgba(255, 184, 0, 0.2)`,
                color: `#FFB800`
              }}
            >
              <Sparkles className="w-4 h-4" />
              {category.number} · {category.title}
            </motion.div>

            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-black mb-3 md:mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {category.tagline.split('.')[0]}
              <span className={cn(
                "bg-gradient-to-r bg-clip-text text-transparent",
                category.color
              )}>
                {category.tagline.includes('.') ? '.' + category.tagline.split('.')[1] : ''}
              </span>
            </motion.h3>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
              className="text-base sm:text-lg md:text-xl text-black/80 max-w-2xl mx-auto"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {category.description}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Feature card with enhanced design
function FeatureCard({
  feature,
  index,
  categoryColor,
  isActive
}: {
  feature: typeof benefitCategories[0]['features'][0];
  index: number;
  categoryColor: string;
  isActive: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.9, rotateY: -10 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1, rotateY: 0 } : { opacity: 0, y: 40, scale: 0.9, rotateY: -10 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: isActive ? index * 0.08 : 0,
        mass: 0.8
      }}
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={() => setIsExpanded(false)}
      onClick={() => setIsExpanded(!isExpanded)}
      style={{ perspective: 1000 }}
      className={cn(
        "group relative cursor-pointer",
        "bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-md rounded-2xl md:rounded-3xl",
        "border border-white/40 shadow-lg shadow-black/5",
        "transition-all duration-500 ease-out",
        "hover:shadow-2xl hover:shadow-blue-500/10 hover:from-white hover:to-blue-50/50 hover:border-blue-200/50",
        "overflow-hidden"
      )}
    >
      {/* Enhanced gradient border on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "absolute inset-0 rounded-2xl md:rounded-3xl",
          "bg-gradient-to-br p-[1.5px]",
          categoryColor
        )}>
        <div className="w-full h-full bg-white/95 rounded-2xl md:rounded-3xl" />
      </motion.div>

      {/* Content container */}
      <div className="relative p-5 sm:p-6 md:p-8">
        {/* Icon and number */}
        <motion.div
          className="flex items-start justify-between mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <motion.div
            className={cn(
              "w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center",
              "bg-gradient-to-br shadow-lg",
              categoryColor
            )}
            whileHover={{ scale: 1.15, rotate: 5 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <feature.icon className="w-7 h-7 md:w-8 md:h-8 text-black" />
          </motion.div>

          <motion.span
            className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-black/15 group-hover:text-blue-600/20 transition-colors"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            animate={{
              scale: isExpanded ? 1.2 : 1,
              x: isExpanded ? -15 : 0,
              opacity: isExpanded ? 0.8 : 0.3
            }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
          >
            0{index + 1}
          </motion.span>
        </motion.div>

        {/* Title and subtitle */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <h4 className="text-xl md:text-2xl font-heading font-bold text-black mb-1 group-hover:text-blue-600 transition-colors duration-300" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {feature.title}
          </h4>
          <p className="text-sm text-black/60 group-hover:text-black/70 transition-colors duration-300" style={{ fontFamily: "'Montserrat', sans-serif" }}>{feature.subtitle}</p>
        </motion.div>

        {/* Description */}
        <motion.p
          className="text-black/75 leading-relaxed mb-4 group-hover:text-black/85 transition-colors duration-300"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {feature.description}
        </motion.p>

        {/* Benefits list - animated expansion */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="pt-4 border-t border-gray-100 space-y-3">
            {feature.benefits.map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ x: -15, opacity: 0 }}
                animate={isExpanded ? { x: 0, opacity: 1 } : { x: -15, opacity: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className="flex items-center gap-3 text-sm"
              >
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                  "bg-gradient-to-br",
                  categoryColor
                )}>
                  <CheckCircle className="w-3 h-3 text-black" />
                </div>
                <span className="text-black">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Expand indicator */}
        <motion.div
          className="flex items-center gap-2 mt-4 text-sm font-medium text-black/50 group-hover:text-gold transition-colors"
          animate={{ x: isExpanded ? 5 : 0 }}
        >
          <span>{isExpanded ? "Less details" : "More details"}</span>
          <ChevronRight className={cn(
            "w-4 h-4 transition-transform duration-300",
            isExpanded && "rotate-90"
          )} />
        </motion.div>
      </div>

      {/* Bottom gradient accent */}
      <motion.div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r",
          categoryColor
        )}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ transformOrigin: "left" }}
      />
    </motion.div>
  );
}

// Progress indicator
function ProgressIndicator({ total, current, duration }: { total: number; current: number; duration: number }) {
  return (
    <div className="flex items-center justify-center gap-3 mt-10">
      <div className="flex items-center gap-3 bg-gradient-to-r from-gray-100 via-white to-gray-100 backdrop-blur-sm px-6 py-3 rounded-full shadow-[0_8px_30px_-6px_rgba(0,0,0,0.15),inset_0_1px_0_0_rgba(255,255,255,0.8)] border border-gray-200/80">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              "relative rounded-full overflow-hidden transition-all duration-500 ease-out cursor-pointer",
              i === current
                ? "w-10 h-3 bg-gray-200 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.4)]"
                : "w-3 h-3 bg-gray-300 hover:bg-gray-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
            )}
            animate={{ scale: i === current ? 1 : 0.9, opacity: i === current ? 1 : 0.6 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.15, opacity: 0.9 }}
          >
            {i === current && (
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                key={current}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const SLIDE_DURATION = 5000;

// Main section component
export function BenefitsSection() {
  const [activeCategory, setActiveCategory] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setActiveCategory(prev => (prev + 1) % benefitCategories.length);
    }, SLIDE_DURATION);
  }, []);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [activeCategory, startTimer]);

  const handleSelect = useCallback((index: number) => {
    setActiveCategory(index);
  }, []);

  const currentCategory = benefitCategories[activeCategory];

  return (
    <section
      ref={sectionRef}
      id="benefits"
      className="relative py-12 sm:py-16 md:py-14 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #f0f6f0 0%, #fafbfa 50%, #ffffff 100%)"
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top gradient accent */}
        <motion.div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-gold/15 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Bottom gradient accent */}
        <motion.div
          className="absolute -bottom-40 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-green-100/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Left accent */}
        <motion.div
          className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-100/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Main section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-8 md:mb-12 lg:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold/20 to-amber-100/20 text-gold rounded-full text-sm font-semibold mb-4 shadow-sm border border-gold/10"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <Sun className="w-4 h-4" />
            Why Digital Solar
          </motion.div>

          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-3 md:mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Benefits That{" "}
            <span className="bg-gradient-to-r from-gold via-amber-500 to-gold bg-clip-text text-transparent">
              Actually Matter
            </span>
          </motion.h2>

          <motion.p
            className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Traditional solar has barriers. We removed them all. Here&apos;s why thousands of Indian families are choosing Digital Solar.
          </motion.p>
        </motion.div>

        {/* Category navigation */}
        <CategoryNav
          categories={benefitCategories}
          activeIndex={activeCategory}
          onSelect={handleSelect}
        />

        {/* Category hero content */}
        <CategoryHero
          category={currentCategory}
          isActive={true}
        />

        {/* Feature cards grid with unique styling */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          {currentCategory.features.map((feature, index) => (
            <FeatureCard
              key={`${currentCategory.id}-${index}`}
              feature={feature}
              index={index}
              categoryColor={currentCategory.color}
              isActive={true}
            />
          ))}
        </motion.div>

        {/* Progress indicator */}
        <ProgressIndicator
          total={benefitCategories.length}
          current={activeCategory}
          duration={SLIDE_DURATION}
        />

        {/* Stats banner */}
        {/* <StatsBanner /> */}

      </div>
    </section>
  );
}