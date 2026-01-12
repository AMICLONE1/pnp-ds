"use client";

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
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
    color: "from-energy-green via-emerald-500 to-teal-500",
    accentColor: "energy-green",
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
    color: "from-forest via-emerald-600 to-green-600",
    accentColor: "forest",
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
    <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12 md:mb-16">
      {categories.map((category, index) => (
        <motion.button
          key={category.id}
          onClick={() => onSelect(index)}
          className={cn(
            "relative px-5 py-3 md:px-7 md:py-3.5 rounded-2xl text-sm md:text-base font-medium transition-all duration-300",
            "flex items-center gap-2.5",
            activeIndex === index
              ? "text-white shadow-xl shadow-black/15"
              : "text-charcoal/70 bg-white hover:bg-white hover:text-charcoal border border-gray-200/80 hover:border-gray-300 hover:shadow-md"
          )}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          {/* Active background */}
          {activeIndex === index && (
            <motion.div
              layoutId="activeCategory"
              className={cn("absolute inset-0 rounded-2xl bg-gradient-to-r", category.color)}
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            />
          )}
          
          {/* Number badge */}
          <span className={cn(
            "relative z-10 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors",
            activeIndex === index 
              ? "bg-white/20 text-white" 
              : "bg-gray-100 text-charcoal/50"
          )}>
            {category.number}
          </span>
          <span className="relative z-10 font-semibold">{category.title}</span>
          
          {/* Active indicator dot */}
          {activeIndex === index && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="relative z-10 w-1.5 h-1.5 rounded-full bg-white/80 ml-1"
            />
          )}
        </motion.button>
      ))}
    </div>
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
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          {/* Category header */}
          <div className="text-center mb-10">
            {/* Animated badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className={cn(
                "inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-semibold mb-6",
                "shadow-lg"
              )}
              style={{
                background: `linear-gradient(135deg, var(--${category.accentColor}, #f59e0b)15, var(--${category.accentColor}, #f59e0b)08)`,
                color: `var(--${category.accentColor}, #f59e0b)`,
                border: `1px solid var(--${category.accentColor}, #f59e0b)30`
              }}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span className="font-bold opacity-70">{category.number}</span>
              <span className="w-1 h-1 rounded-full bg-current opacity-40" />
              <span>{category.title}</span>
            </motion.div>
            
            {/* Main headline */}
            <motion.h3
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-charcoal mb-5"
            >
              {category.tagline.split('.')[0]}
              <span className={cn(
                "bg-gradient-to-r bg-clip-text text-transparent",
                category.color
              )}>
                {category.tagline.includes('.') ? '.' : ''}
              </span>
            </motion.h3>
            
            {/* Description with animated highlight */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              {category.description}
            </motion.p>
            
            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className={cn(
                "mx-auto mt-8 h-1 w-24 rounded-full bg-gradient-to-r",
                category.color
              )}
              style={{ transformOrigin: "center" }}
            />
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
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={() => setIsExpanded(false)}
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={{ y: -8 }}
      className={cn(
        "group relative cursor-pointer",
        "bg-white rounded-2xl md:rounded-3xl",
        "border border-gray-100",
        "transition-all duration-500 ease-out",
        "hover:shadow-2xl hover:shadow-black/[0.08]",
        "overflow-hidden"
      )}
    >
      {/* Gradient border on hover */}
      <div className={cn(
        "absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        "bg-gradient-to-br p-[1.5px]",
        categoryColor
      )}>
        <div className="w-full h-full bg-white rounded-2xl md:rounded-3xl" />
      </div>
      
      {/* Subtle glow effect on hover */}
      <div className={cn(
        "absolute -inset-px rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl",
        "bg-gradient-to-br",
        categoryColor
      )} />
      
      {/* Content container */}
      <div className="relative p-6 md:p-8">
        {/* Icon and number */}
        <div className="flex items-start justify-between mb-6">
          <motion.div 
            className={cn(
              "w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center",
              "bg-gradient-to-br shadow-lg transition-all duration-500",
              "group-hover:shadow-xl group-hover:scale-110",
              categoryColor
            )}
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
          >
            <feature.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </motion.div>
          
          <motion.span
            className="text-5xl md:text-6xl font-heading font-bold text-gray-100/80 group-hover:text-gray-200 transition-colors select-none"
            animate={{ 
              scale: isExpanded ? 1.05 : 1,
              x: isExpanded ? -5 : 0,
              opacity: isExpanded ? 0.6 : 0.5
            }}
            transition={{ duration: 0.3 }}
          >
            0{index + 1}
          </motion.span>
        </div>
        
        {/* Title and subtitle */}
        <div className="mb-4">
          <h4 className="text-xl md:text-2xl font-heading font-bold text-charcoal mb-1 group-hover:text-forest transition-colors">
            {feature.title}
          </h4>
          <p className="text-sm text-gray-500">{feature.subtitle}</p>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 leading-relaxed mb-4">
          {feature.description}
        </p>
        
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
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-700">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Expand indicator */}
        <motion.div 
          className="flex items-center gap-2 mt-4 text-sm font-medium text-gray-400 group-hover:text-forest transition-colors"
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

// Stats banner
function StatsBanner() {
  const stats = [
    { value: "5", suffix: "min", label: "Setup Time", icon: Clock },
    { value: "75", suffix: "%", label: "Guaranteed", icon: Shield },
    { value: "24K", suffix: "+", label: "Annual Savings", icon: Wallet },
    { value: "340", suffix: "", label: "Trees Equivalent", icon: Leaf },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-16 md:mt-20"
    >
      <div className="bg-gradient-to-br from-forest via-forest to-emerald-700 rounded-2xl md:rounded-3xl p-8 md:p-10 lg:p-12 overflow-hidden relative">
        {/* Enhanced background pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.2)_100%)]" />
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }} />
        </div>
        
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring" }}
              className="text-center group"
            >
              {/* Icon */}
              <motion.div
                className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <stat.icon className="w-6 h-6 text-gold" />
              </motion.div>
              
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <motion.span 
                  className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {stat.value}
                </motion.span>
                <span className="text-xl md:text-2xl font-bold text-gold">
                  {stat.suffix}
                </span>
              </div>
              <p className="text-sm md:text-base text-white/70 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Bottom accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent"
          style={{ transformOrigin: "center" }}
        />
      </div>
    </motion.div>
  );
}

// Progress indicator
function ProgressIndicator({ total, current, categories }: { total: number; current: number; categories: typeof benefitCategories }) {
  return (
    <div className="hidden md:flex items-center justify-center gap-3 mt-10">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            "h-2 rounded-full transition-all duration-500 cursor-pointer",
            i === current 
              ? cn("w-10 bg-gradient-to-r shadow-lg", categories[i].color)
              : "w-2 bg-gray-300 hover:bg-gray-400"
          )}
          animate={{ 
            scale: i === current ? 1 : 0.85,
            opacity: i === current ? 1 : 0.4
          }}
          whileHover={{ scale: i === current ? 1 : 1.2 }}
        />
      ))}
    </div>
  );
}

// Main section component
export function BenefitsSection() {
  const [activeCategory, setActiveCategory] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  // Auto-cycle through categories
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCategory((prev) => (prev + 1) % benefitCategories.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  const currentCategory = benefitCategories[activeCategory];

  return (
    <section 
      ref={sectionRef}
      id="benefits" 
      className="relative py-20 md:py-28 lg:py-32 bg-gradient-to-b from-offwhite via-white to-offwhite overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-energy-green/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Main section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isHeaderInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-forest/10 text-forest rounded-full text-sm font-semibold mb-4"
          >
            <Sun className="w-4 h-4" />
            Why Digital Solar
          </motion.span>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-charcoal mb-4">
            Benefits That{" "}
            <span className="bg-gradient-to-r from-gold via-energy-green to-forest bg-clip-text text-transparent">
              Actually Matter
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Traditional solar has barriers. We removed them all. Here&apos;s why thousands of Indian families are choosing Digital Solar.
          </p>
        </motion.div>
        
        {/* Category navigation */}
        <CategoryNav 
          categories={benefitCategories}
          activeIndex={activeCategory}
          onSelect={setActiveCategory}
        />
        
        {/* Category hero content */}
        <CategoryHero 
          category={currentCategory}
          isActive={true}
        />
        
        {/* Feature cards grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {currentCategory.features.map((feature, index) => (
            <FeatureCard
              key={`${currentCategory.id}-${index}`}
              feature={feature}
              index={index}
              categoryColor={currentCategory.color}
              isActive={true}
            />
          ))}
        </div>
        
        {/* Progress indicator */}
        <ProgressIndicator 
          total={benefitCategories.length}
          current={activeCategory}
          categories={benefitCategories}
        />
        
        {/* Stats banner */}
        <StatsBanner />
        
        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 md:mt-20 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest/10 text-forest text-sm font-medium mb-4"
          >
            <Zap className="w-4 h-4" />
            Join 10,000+ families saving with solar
          </motion.div>
          <p className="text-gray-600 mb-8 text-lg">
            Ready to experience these benefits yourself?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/reserve">
              <motion.div 
                whileHover={{ scale: 1.03, y: -2 }} 
                whileTap={{ scale: 0.98 }}
                className="inline-block"
              >
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-forest hover:bg-forest-light text-white font-semibold px-10 py-6 text-lg group shadow-xl shadow-forest/25 rounded-2xl"
                >
                  Start Your Solar Journey
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/#how-it-works">
              <motion.div 
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.98 }}
                className="inline-block"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="font-semibold px-8 py-6 text-lg rounded-2xl border-2"
                >
                  See How It Works
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
