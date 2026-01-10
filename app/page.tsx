"use client";

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Zap,
  Leaf,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  BarChart3,
  Users,
  Award,
  Play,
  Sparkles,
  Sun,
  Building2,
  Home,
  IndianRupee,
  ChevronDown,
} from "lucide-react";
import dynamic from "next/dynamic";
import { EnergyWave } from "@/components/features/landing/AnimatedSVG";
import { ScrollAnimation } from "@/components/features/landing/ScrollAnimation";
import { UtilityCompatibilityChecker } from "@/components/features/landing/UtilityCompatibilityChecker";
import { InlineCalculator } from "@/components/features/landing/InlineCalculator";
import { LiveStatsTicker } from "@/components/features/landing/LiveStatsTicker";
import { StickyCTA } from "@/components/features/landing/StickyCTA";
import { GlassCard } from "@/components/features/landing/GlassCard";

// Import new animation components
import {
  Typewriter,
  GradientText,
  SplitText,
  StickyScroll,
  ScrollProgress,
  ScrollFade,
  CardTilt,
  MagneticButton,
  FloatingElement,
  GlowingBorder,
  AuroraBackground,
  GradientMesh,
  Spotlight,
  GridPattern,
  DotPattern,
  FAQAccordion,
  FeatureComparison,
  TestimonialCarousel,
  LogoMarquee,
  StatCard,
} from "@/components/ui/animations";

// Lazy load heavy components with proper SSR handling
const Hero3D = dynamic(
  () => import("@/components/features/landing/Hero3D").then(mod => mod.Hero3D),
  { ssr: false }
);

const ParticleSystem = dynamic(
  () => import("@/components/features/landing/ParticleSystem").then(mod => mod.ParticleSystem),
  { ssr: false }
);

import { useHeroAnimation } from "@/hooks/useHeroAnimation";
import { useStatsCounter } from "@/hooks/useStatsCounter";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// FAQ Data
const faqData = [
  {
    question: "What is Digital Solar and how does it work?",
    answer: "Digital Solar allows you to access clean solar energy without installing panels on your property. You reserve capacity from community solar projects, and the energy generated creates credits that automatically offset your electricity bills.",
    category: "Getting Started"
  },
  {
    question: "Do I need to own my home to participate?",
    answer: "No! Digital Solar is perfect for renters, apartment dwellers, and anyone who can't install panels. As long as you pay an electricity bill, you can participate and save.",
    category: "Eligibility"
  },
  {
    question: "How much can I save on my electricity bills?",
    answer: "Most users save between ₹500-2,000 per month depending on their capacity reservation. Our calculator can give you a personalized estimate based on your current usage.",
    category: "Savings"
  },
  {
    question: "Is there any installation required?",
    answer: "Zero installation required. No technicians visiting your home, no permits, no hardware. Everything is managed digitally through our platform.",
    category: "Getting Started"
  },
  {
    question: "How do solar credits appear on my bill?",
    answer: "Credits are automatically applied to your utility bill each month. You'll see them as a line item showing the energy generated from your reserved capacity, reducing your total bill.",
    category: "Billing"
  },
  {
    question: "What happens if the solar project generates less energy than expected?",
    answer: "We guarantee 75% of forecasted generation. This means even during cloudy periods or monsoon season, you're protected against significant shortfalls.",
    category: "Guarantees"
  },
  {
    question: "Can I change my capacity reservation later?",
    answer: "Yes! You can increase your capacity at any time. Decreasing capacity or cancelling follows our 30-day notice policy with pro-rated refunds.",
    category: "Flexibility"
  },
  {
    question: "Which utilities are supported?",
    answer: "We currently support major utilities across Maharashtra, Karnataka, Tamil Nadu, and Gujarat. Use our compatibility checker to see if your utility is supported.",
    category: "Eligibility"
  },
];

// Testimonial Data
const testimonialData = [
  {
    content: "I've been saving over ₹1,800 every month since joining PowerNet Pro. As someone living in an apartment, I never thought I could go solar. This is revolutionary!",
    author: "Priya Sharma",
    role: "Apartment Resident",
    location: "Mumbai",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    savings: "₹1,800/month"
  },
  {
    content: "The setup took literally 5 minutes. No technicians, no roof inspections, nothing. Just sign up and start saving. Wish I knew about this years ago.",
    author: "Rajesh Kumar",
    role: "IT Professional",
    location: "Bangalore",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
    savings: "₹2,100/month"
  },
  {
    content: "Finally, clean energy that works for tenants! I've moved twice since joining and my solar credits follow me. Best green decision I've made.",
    author: "Ananya Patel",
    role: "Tenant",
    location: "Pune",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
    savings: "₹1,500/month"
  },
  {
    content: "As a small business owner, every rupee counts. Digital Solar has reduced our electricity costs by 35%. The team support is exceptional too.",
    author: "Mohammed Ismail",
    role: "Business Owner",
    location: "Chennai",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed",
    savings: "₹4,200/month"
  },
];

// Partner Logos - using inline SVG data URIs
const partnerLogos = [
  { name: "TATA Power", logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40' viewBox='0 0 120 40'%3E%3Crect fill='%23FFB800' width='120' height='40' rx='4'/%3E%3Ctext x='60' y='25' fill='%23000' font-family='Arial,sans-serif' font-size='14' font-weight='bold' text-anchor='middle'%3ETATA%3C/text%3E%3C/svg%3E" },
  { name: "Adani Green", logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40' viewBox='0 0 120 40'%3E%3Crect fill='%234CAF50' width='120' height='40' rx='4'/%3E%3Ctext x='60' y='25' fill='%23FFF' font-family='Arial,sans-serif' font-size='14' font-weight='bold' text-anchor='middle'%3EAdani%3C/text%3E%3C/svg%3E" },
  { name: "NTPC", logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40' viewBox='0 0 120 40'%3E%3Crect fill='%231a1a2e' width='120' height='40' rx='4'/%3E%3Ctext x='60' y='25' fill='%23FFF' font-family='Arial,sans-serif' font-size='14' font-weight='bold' text-anchor='middle'%3ENTPC%3C/text%3E%3C/svg%3E" },
  { name: "ReNew Power", logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40' viewBox='0 0 120 40'%3E%3Crect fill='%2300BCD4' width='120' height='40' rx='4'/%3E%3Ctext x='60' y='25' fill='%23FFF' font-family='Arial,sans-serif' font-size='14' font-weight='bold' text-anchor='middle'%3EReNew%3C/text%3E%3C/svg%3E" },
  { name: "Azure Power", logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40' viewBox='0 0 120 40'%3E%3Crect fill='%232196F3' width='120' height='40' rx='4'/%3E%3Ctext x='60' y='25' fill='%23FFF' font-family='Arial,sans-serif' font-size='14' font-weight='bold' text-anchor='middle'%3EAzure%3C/text%3E%3C/svg%3E" },
  { name: "Hero Future", logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40' viewBox='0 0 120 40'%3E%3Crect fill='%239C27B0' width='120' height='40' rx='4'/%3E%3Ctext x='60' y='25' fill='%23FFF' font-family='Arial,sans-serif' font-size='14' font-weight='bold' text-anchor='middle'%3EHero%3C/text%3E%3C/svg%3E" },
];

// Sticky scroll content
const stickyScrollContent = [
  {
    title: "Choose Your Capacity",
    description: "Select how much solar capacity you want - from 1kW to 10kW. Our intelligent calculator recommends the perfect size based on your monthly consumption.",
    content: (
      <div className="flex items-center justify-center h-full">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gold to-gold-light animate-pulse flex items-center justify-center">
            <Sun className="w-16 h-16 text-white" />
          </div>
          <div className="absolute -top-4 -right-4 bg-forest text-white px-3 py-1 rounded-full text-sm font-bold">
            1-10 kW
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Make Payment",
    description: "Secure one-time payment via UPI, cards, or net banking. Your capacity is reserved instantly and you start generating credits from day one.",
    content: (
      <div className="flex items-center justify-center h-full">
        <div className="relative">
          <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-forest to-forest-light flex items-center justify-center">
            <IndianRupee className="w-16 h-16 text-gold" />
          </div>
          <div className="absolute -bottom-4 -left-4 bg-gold text-charcoal px-3 py-1 rounded-full text-sm font-bold">
            Secure Pay
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Solar Generates Energy",
    description: "Your reserved capacity in our solar projects generates clean energy every day. Track real-time generation through your personalized dashboard.",
    content: (
      <div className="flex items-center justify-center h-full">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-energy-green flex items-center justify-center">
            <Zap className="w-16 h-16 text-energy-green animate-pulse" />
          </div>
          <div className="absolute -top-2 -right-8 bg-energy-green text-white px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
            Live Tracking
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Credits Applied Automatically",
    description: "Every month, your generated solar credits are automatically applied to your electricity bill. Watch your savings grow without lifting a finger.",
    content: (
      <div className="flex items-center justify-center h-full">
        <div className="relative">
          <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-energy-blue to-blue-600 flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <div className="absolute -bottom-4 -right-4 bg-gold text-charcoal px-3 py-1 rounded-full text-sm font-bold">
            Auto-Applied
          </div>
        </div>
      </div>
    ),
  },
];

// Feature comparison data
const comparisonFeatures = [
  { feature: "Installation Required", digital: "No", rooftop: "Yes" },
  { feature: "Works for Renters", digital: "Yes", rooftop: "No" },
  { feature: "Setup Time", digital: "5 minutes", rooftop: "2-4 weeks" },
  { feature: "Upfront Cost", digital: "Low", rooftop: "High" },
  { feature: "Maintenance", digital: "None", rooftop: "Required" },
  { feature: "Portability", digital: "Full", rooftop: "None" },
  { feature: "Scalability", digital: "Easy", rooftop: "Limited" },
  { feature: "Weather Risk", digital: "75% Guaranteed", rooftop: "On You" },
];

export default function HomePage() {
  const heroRef = useHeroAnimation();
  const statsRef = useStatsCounter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />
      
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gold focus:text-charcoal focus:rounded-lg focus:font-semibold focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {/* HERO SECTION */}
        <section 
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
          aria-label="Hero section"
        >
          {/* Aurora Background Effect */}
          <AuroraBackground className="absolute inset-0" />
          
          {/* Particle System Background */}
          <ParticleSystem />
          
          {/* 3D Background */}
          <Hero3D />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-forest/30 to-forest-dark/80" />
          
          {/* Grid Pattern Overlay */}
          <GridPattern className="absolute inset-0 opacity-10" />

          {/* Content */}
          <motion.div 
            style={{ opacity: mounted ? heroOpacity : 1, scale: mounted ? heroScale : 1 }}
            className="relative z-10 container mx-auto px-4 py-16 md:py-24"
          >
            <div ref={heroRef} className="max-w-6xl mx-auto text-center text-white">
              {/* Floating Badge */}
              <FloatingElement amplitude={10} duration={4}>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8"
                >
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-sm font-medium">India&apos;s #1 Digital Solar Platform</span>
                  <span className="bg-gold text-charcoal text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>
                </motion.div>
              </FloatingElement>

              {/* Main Headline */}
              <div className="mb-6">
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-balance leading-tight"
                >
                  Save{" "}
                  <span className="relative inline-block">
                    <GradientText 
                      text="₹2,000/month" 
                      colors={["#FFB800", "#FFD54F", "#4CAF50"]}
                      className="font-extrabold"
                    />
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1, duration: 0.8 }}
                      className="absolute -bottom-2 left-0 w-full h-2 bg-gold/30 rounded-full origin-left"
                    />
                  </span>
                  <br />
                  on Electricity
                </motion.h1>
              </div>
              
              {/* Subheadline with Typewriter Effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mb-8"
              >
                <p className="text-xl md:text-2xl lg:text-3xl text-gray-100 font-medium">
                  <Typewriter 
                    text="No Installation. No Hassle. Just Savings." 
                    delay={1000}
                    speed={50}
                  />
                </p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.5 }}
                className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto"
              >
                Reserve solar capacity from community projects. Credits automatically applied to your bills.
              </motion.p>

              {/* Inline Calculator with Glow Effect */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8, type: "spring", stiffness: 100 }}
                className="mb-10"
              >
                <GlowingBorder color="gold" animated>
                  <div className="bg-forest/80 backdrop-blur-xl rounded-2xl p-1">
                    <InlineCalculator />
                  </div>
                </GlowingBorder>
              </motion.div>

              {/* Animated Stats Pills */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 2.2,
                    },
                  },
                }}
                className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10 text-sm md:text-base"
              >
                {[
                  { icon: Users, text: "1,000+ Users", color: "text-gold" },
                  { icon: TrendingUp, text: "₹50Cr+ Saved", color: "text-energy-green" },
                  { icon: Award, text: "ISO Certified", color: "text-energy-blue" },
                  { icon: Shield, text: "Bank-Grade Security", color: "text-purple-400" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 20, scale: 0.8 },
                      visible: { opacity: 1, y: 0, scale: 1 },
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="group"
                  >
                    <CardTilt maxTilt={10}>
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3 rounded-full hover:bg-white/20 transition-colors">
                        <item.icon className={`h-5 w-5 ${item.color}`} aria-hidden="true" />
                        <span className="font-semibold">{item.text}</span>
                      </div>
                    </CardTilt>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTAs with Magnetic Effect */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
              >
                <MagneticButton strength={0.3}>
                  <Link href="/reserve" aria-label="Start saving now">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full sm:w-auto text-lg md:text-xl px-10 py-7 group bg-gold hover:bg-gold-light text-charcoal font-bold shadow-2xl transition-all transform hover:scale-105 glow-gold"
                    >
                      Start Saving Now
                      <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" aria-hidden="true" />
                    </Button>
                  </Link>
                </MagneticButton>
                <MagneticButton strength={0.3}>
                  <Link href="/signup" aria-label="Watch demo">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto text-lg md:text-xl px-10 py-7 border-2 border-white/50 text-white hover:bg-white/10 backdrop-blur-sm font-semibold group"
                    >
                      <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                      Watch 60s Demo
                    </Button>
                  </Link>
                </MagneticButton>
              </motion.div>
            </div>
          </motion.div>

          {/* Animated Wave */}
          <EnergyWave />
          
          {/* Live Stats Ticker */}
          <LiveStatsTicker />
          
          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="absolute bottom-28 left-1/2 transform -translate-x-1/2 z-20"
          >
            <motion.button
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
              aria-label="Scroll down"
            >
              <span className="text-sm font-medium">Scroll to explore</span>
              <ChevronDown className="w-6 h-6 animate-bounce" />
            </motion.button>
          </motion.div>
        </section>

        {/* STATS SECTION */}
        <section className="py-24 bg-white relative overflow-hidden">
          <DotPattern className="absolute inset-0 opacity-30" />
          <div className="container mx-auto px-4 relative z-10">
            <ScrollFade direction="up">
              <div className="text-center mb-16">
                <SplitText 
                  text="Trusted by Thousands"
                  className="text-4xl md:text-5xl font-heading font-bold text-charcoal"
                  delay={0.05}
                />
                <p className="text-xl text-gray-600 mt-4">Join India&apos;s fastest-growing solar community</p>
              </div>
            </ScrollFade>
            
            <div ref={statsRef} className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                { value: 1000, suffix: "+", label: "Residential Owners", color: "forest", icon: Home },
                { value: 500, suffix: " MT", label: "Carbon Reduced", color: "gold", icon: Leaf },
                { value: 45, suffix: "%", label: "Higher Returns", color: "energy-green", icon: TrendingUp },
                { value: 50, suffix: "Cr+", prefix: "₹", label: "Total Savings", color: "energy-blue", icon: IndianRupee },
              ].map((stat, index) => (
                <ScrollFade key={index} direction="up" delay={index * 0.1}>
                  <CardTilt maxTilt={8}>
                    <StatCard
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      label={stat.label}
                      icon={<stat.icon className="w-6 h-6" />}
                      accentColor={stat.color === "forest" ? "#0D2818" : stat.color === "gold" ? "#FFB800" : stat.color === "energy-green" ? "#4CAF50" : "#00BCD4"}
                    />
                  </CardTilt>
                </ScrollFade>
              ))}
            </div>
          </div>
        </section>

        {/* PARTNER LOGOS */}
        <section className="py-12 bg-gray-50 border-y border-gray-200 overflow-hidden">
          <div className="container mx-auto px-4">
            <p className="text-center text-gray-500 mb-8 text-sm font-medium uppercase tracking-wider">
              Partnering with India&apos;s leading energy companies
            </p>
            <LogoMarquee 
              logos={partnerLogos}
              speed={30}
            />
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 bg-white relative overflow-hidden">
          <Spotlight className="absolute top-0 left-1/2 -translate-x-1/2" />
          <div className="container mx-auto px-4">
            <ScrollFade direction="up">
              <div className="text-center mb-16">
                <span className="inline-block bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Customer Stories
                </span>
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
                  What Our Users Say
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Real savings from real people across India
                </p>
              </div>
            </ScrollFade>
            
            <TestimonialCarousel testimonials={testimonialData} />
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-gradient-to-br from-forest via-forest-light to-forest-dark relative">
          <div className="py-16 text-center text-white relative z-10">
            <ScrollFade direction="up">
              <span className="inline-block bg-gold/20 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Simple Process
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                From sign-up to savings in just 4 simple steps
              </p>
            </ScrollFade>
          </div>
          
          <StickyScroll content={stickyScrollContent} />
        </section>

        {/* COMPARISON */}
        <section className="py-24 bg-white relative overflow-hidden">
          <GridPattern className="absolute inset-0 opacity-5" />
          <div className="container mx-auto px-4 relative z-10">
            <ScrollFade direction="up">
              <div className="text-center mb-16">
                <span className="inline-block bg-forest/10 text-forest px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Compare Options
                </span>
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
                  Digital Solar vs Rooftop Solar
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  See why Digital Solar is the smarter choice for most Indians
                </p>
              </div>
            </ScrollFade>

            <div className="max-w-4xl mx-auto">
              <ScrollFade direction="up" delay={0.2}>
                <FeatureComparison
                  features={comparisonFeatures}
                  leftLabel="Digital Solar"
                  rightLabel="Rooftop Solar"
                  leftIcon={<Sun className="w-5 h-5 text-gold" />}
                  rightIcon={<Building2 className="w-5 h-5 text-gray-500" />}
                />
              </ScrollFade>
            </div>
          </div>
        </section>

        {/* UTILITY COMPATIBILITY */}
        <section className="py-24 bg-gradient-to-b from-white to-offwhite relative">
          <div className="container mx-auto px-4">
            <ScrollFade direction="up">
              <UtilityCompatibilityChecker />
            </ScrollFade>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="py-24 bg-white relative overflow-hidden" aria-label="Benefits">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-forest/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-energy-blue/5 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <ScrollFade direction="up">
              <div className="text-center mb-16">
                <span className="inline-block bg-energy-green/10 text-energy-green px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Why Choose Us
                </span>
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
                  Benefits of Digital Solar
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  The smarter way to go solar without the hassles
                </p>
              </div>
            </ScrollFade>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[
                {
                  icon: Zap,
                  title: "No Installation",
                  description: "Participate in solar energy without installing panels. Perfect for renters and apartment dwellers.",
                  gradient: "from-forest to-forest-light",
                  delay: 0,
                },
                {
                  icon: TrendingUp,
                  title: "Lower Bills",
                  description: "Save money on electricity bills with automatic credit applications every month. Average savings: ₹500-2000/month.",
                  gradient: "from-energy-green to-green-600",
                  delay: 0.1,
                },
                {
                  icon: Leaf,
                  title: "Environmental Impact",
                  description: "Track your CO₂ offset and contribute to India's renewable energy goals. Every kW matters.",
                  gradient: "from-energy-blue to-blue-600",
                  delay: 0.2,
                },
                {
                  icon: Clock,
                  title: "Quick Setup",
                  description: "Get started in under 5 minutes. No complex paperwork or lengthy approval processes.",
                  gradient: "from-purple-500 to-purple-600",
                  delay: 0.3,
                },
                {
                  icon: Shield,
                  title: "Secure & Reliable",
                  description: "Bank-grade security for payments and data. Trusted by thousands of users across India.",
                  gradient: "from-forest to-forest-dark",
                  delay: 0.4,
                },
                {
                  icon: BarChart3,
                  title: "Flexible Capacity",
                  description: "Choose capacity that works for you. Start small with 1 kW and scale up anytime.",
                  gradient: "from-gold to-gold-light",
                  delay: 0.5,
                },
              ].map((benefit, index) => (
                <ScrollFade key={index} direction="up" delay={benefit.delay}>
                  <CardTilt maxTilt={8}>
                    <GlassCard className="p-6 h-full group" hover>
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <benefit.icon className="h-8 w-8 text-white" aria-hidden="true" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-charcoal">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                    </GlassCard>
                  </CardTilt>
                </ScrollFade>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST SECTION */}
        <section className="py-24 bg-gradient-to-br from-forest to-forest-dark text-white relative overflow-hidden">
          <GradientMesh className="absolute inset-0 opacity-20" />
          
          <div className="container mx-auto px-4 relative z-10">
            <ScrollFade direction="up">
              <div className="max-w-4xl mx-auto text-center">
                <span className="inline-block bg-gold/20 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  Built for India
                </span>
                <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                  Built for the Indian Energy Ecosystem
                </h2>
                <p className="text-xl text-gray-100 mb-12 max-w-2xl mx-auto">
                  Compliant, secure, and designed for scale. Making clean energy accessible to everyone.
                </p>

                <div className="grid md:grid-cols-4 gap-6 mb-12">
                  {[
                    { icon: CheckCircle, title: "Regulatory Compliant", desc: "MERC/CERC aligned" },
                    { icon: Shield, title: "ISO 27001 Ready", desc: "Security certified" },
                    { icon: Award, title: "Make in India", desc: "Proudly Indian" },
                    { icon: Users, title: "Startup India", desc: "Recognized startup" },
                  ].map((item, index) => (
                    <ScrollFade key={index} direction="up" delay={index * 0.1}>
                      <CardTilt maxTilt={8}>
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
                          <item.icon className="h-8 w-8 text-gold mx-auto mb-4" />
                          <h3 className="font-semibold mb-2">{item.title}</h3>
                          <p className="text-sm text-gray-200">{item.desc}</p>
                        </div>
                      </CardTilt>
                    </ScrollFade>
                  ))}
                </div>
              </div>
            </ScrollFade>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-24 bg-white relative overflow-hidden">
          <DotPattern className="absolute inset-0 opacity-20" />
          <div className="container mx-auto px-4 relative z-10">
            <ScrollFade direction="up">
              <div className="text-center mb-16">
                <span className="inline-block bg-energy-blue/10 text-energy-blue px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Got Questions?
                </span>
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Everything you need to know about Digital Solar
                </p>
              </div>
            </ScrollFade>

            <div className="max-w-3xl mx-auto">
              <ScrollFade direction="up" delay={0.2}>
                <FAQAccordion items={faqData} searchable />
              </ScrollFade>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-32 relative overflow-hidden">
          <AuroraBackground className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-gold/90 via-gold to-gold-dark/90" />
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <ScrollFade direction="up">
              <FloatingElement amplitude={5} duration={6}>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-forest rounded-2xl mb-8 shadow-2xl">
                  <Sun className="w-10 h-10 text-gold" />
                </div>
              </FloatingElement>
              
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 text-charcoal">
                Ready to Start Saving?
              </h2>
              <p className="text-xl md:text-2xl text-charcoal/80 mb-10 max-w-2xl mx-auto">
                Join thousands of Indians already saving on their electricity bills with Digital Solar.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MagneticButton strength={0.3}>
                  <Link href="/reserve">
                    <Button
                      variant="primary"
                      size="lg"
                      className="text-xl px-10 py-7 group bg-forest hover:bg-forest-light text-white shadow-2xl"
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                    </Button>
                  </Link>
                </MagneticButton>
                <MagneticButton strength={0.3}>
                  <Link href="/help">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-xl px-10 py-7 border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white"
                    >
                      Visit Help Center
                    </Button>
                  </Link>
                </MagneticButton>
              </div>
              
              <p className="mt-8 text-sm text-charcoal/60">
                No credit card required • 5-minute setup • Cancel anytime
              </p>
            </ScrollFade>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCTA />
    </div>
  );
}
