"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { 
  Zap, 
  Home, 
  Clock, 
  Shield, 
  TrendingUp, 
  Leaf,
  ArrowRight,
  CheckCircle,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    number: "01",
    title: "Zero Installation",
    subtitle: "Keep your landlord happy",
    description: "No roof access? No problem. No permits, no construction, no technicians. Go solar without touching your building or dealing with any physical installations.",
    icon: Home,
    color: "from-gold to-amber-600",
    benefits: ["No roof modifications", "Perfect for renters", "Works for apartments"],
    image: "/features/no-installation.svg"
  },
  {
    number: "02",
    title: "5-Minute Setup",
    subtitle: "Faster than your coffee break",
    description: "Most users complete signup during their morning coffee. Choose capacity, make payment, and start generating solar credits immediately. It's that simple.",
    icon: Clock,
    color: "from-energy-green to-green-600",
    benefits: ["Instant activation", "No paperwork", "Start saving today"],
    image: "/features/quick-setup.svg"
  },
  {
    number: "03",
    title: "75% Guaranteed",
    subtitle: "Protected even in monsoon",
    description: "We guarantee 75% of forecasted generation. Even during cloudy periods or monsoon season, you're protected against significant shortfalls. Risk-free solar savings.",
    icon: Shield,
    color: "from-energy-blue to-blue-600",
    benefits: ["Weather protection", "Guaranteed returns", "No surprises"],
    image: "/features/guaranteed.svg"
  },
  {
    number: "04",
    title: "₹24,000/Year Savings",
    subtitle: "A vacation's worth annually",
    description: "The average family saves ₹2,000 every month. That's a free vacation every year just from electricity savings. Calculate your exact savings with our calculator.",
    icon: TrendingUp,
    color: "from-purple-500 to-purple-700",
    benefits: ["Monthly bill credits", "Predictable savings", "No hidden fees"],
    image: "/features/savings.svg"
  },
  {
    number: "05",
    title: "Portable Solar",
    subtitle: "Your credits move with you",
    description: "Moving cities? Your solar credits move with you. No hardware to pack, no installations to undo. Truly portable clean energy that follows you anywhere.",
    icon: Zap,
    color: "from-orange-500 to-orange-600",
    benefits: ["Transfer anytime", "No cancellation hassle", "Nationwide coverage"],
    image: "/features/portable.svg"
  },
  {
    number: "06",
    title: "340 Trees Equivalent",
    subtitle: "Real environmental impact",
    description: "You'll offset 7.5 tons of CO₂ annually—that's equivalent to planting 340 trees. Make a real, measurable impact on the environment while saving money.",
    icon: Leaf,
    color: "from-forest to-forest-light",
    benefits: ["Track your impact", "Carbon certificates", "Green credentials"],
    image: "/features/environment.svg"
  },
];

// Feature card component
function FeatureCard({ 
  feature, 
  index, 
  isActive,
  onActivate 
}: { 
  feature: typeof features[0]; 
  index: number;
  isActive: boolean;
  onActivate: () => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={onActivate}
      className={cn(
        "relative group cursor-pointer",
        "p-6 md:p-8 rounded-2xl transition-all duration-500",
        isActive 
          ? "bg-white shadow-2xl shadow-black/10 scale-[1.02]" 
          : "bg-white/50 hover:bg-white hover:shadow-xl"
      )}
    >
      {/* Number indicator */}
      <div className={cn(
        "absolute -top-4 -left-4 w-12 h-12 rounded-xl flex items-center justify-center font-heading font-bold text-lg transition-all duration-300",
        isActive 
          ? `bg-gradient-to-br ${feature.color} text-white shadow-lg` 
          : "bg-gray-100 text-gray-400"
      )}>
        {feature.number}
      </div>
      
      {/* Content */}
      <div className="pt-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl md:text-2xl font-heading font-bold text-charcoal mb-1">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-500">{feature.subtitle}</p>
          </div>
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
            isActive 
              ? `bg-gradient-to-br ${feature.color} text-white` 
              : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
          )}>
            <feature.icon className="w-6 h-6" />
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 leading-relaxed">
          {feature.description}
        </p>
        
        {/* Benefits list */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isActive ? "auto" : 0, 
            opacity: isActive ? 1 : 0 
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-4 border-t border-gray-100 space-y-2">
            {feature.benefits.map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <CheckCircle className="w-4 h-4 text-energy-green" />
                {benefit}
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Expand indicator */}
        <div className={cn(
          "flex items-center gap-1 mt-4 text-sm font-medium transition-colors",
          isActive ? "text-forest" : "text-gray-400"
        )}>
          {isActive ? "Less details" : "More details"}
          <ChevronRight className={cn(
            "w-4 h-4 transition-transform",
            isActive && "rotate-90"
          )} />
        </div>
      </div>
    </motion.div>
  );
}

// Section header
function SectionHeader() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ delay: 0.2 }}
        className="inline-block px-4 py-2 bg-forest/10 text-forest rounded-full text-sm font-semibold mb-4"
      >
        Why Digital Solar
      </motion.span>
      
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-charcoal mb-4">
        Benefits That{" "}
        <span className="bg-gradient-to-r from-gold to-energy-green bg-clip-text text-transparent">
          Actually Matter
        </span>
      </h2>
      
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Traditional solar has barriers. We removed them all. Here&apos;s why thousands of Indian families are choosing Digital Solar.
      </p>
    </motion.div>
  );
}

export function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section 
      id="benefits" 
      className="relative py-24 md:py-32 bg-gradient-to-b from-offwhite to-white overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-energy-green/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <SectionHeader />
        
        <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.number}
              feature={feature}
              index={index}
              isActive={activeIndex === index}
              onActivate={() => setActiveIndex(index)}
            />
          ))}
        </div>
        
        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-6">
            Ready to experience these benefits yourself?
          </p>
          <Link href="/reserve">
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Button
                variant="primary"
                size="lg"
                className="bg-forest hover:bg-forest-light text-white font-semibold px-8 py-6 text-lg group"
              >
                Start Your Solar Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
