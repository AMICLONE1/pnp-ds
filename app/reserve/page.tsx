"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { SOLAR_CONSTANTS, calculateSolarSavings, formatINR } from "@/lib/solar-constants";
import { 
  MapPin, 
  Zap, 
  TrendingUp, 
  Calendar, 
  Sun, 
  Shield, 
  Leaf, 
  ArrowRight,
  CheckCircle,
  Sparkles,
  Battery,
  ChevronRight,
  Info,
  Clock,
  Users,
  Building2,
  BadgeCheck
} from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";

interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  state: string;
  price_per_kw: number;
  available_capacity_kw: number;
  image_url?: string;
  commission_date?: string;
  operational_until?: string;
  rate_per_kwh?: number;
}

export const dynamic = 'force-dynamic';

// Hero section for the page
function PageHero() {
  return (
    <section className="relative bg-gradient-to-br from-forest via-forest to-forest-dark overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-energy-green/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="pt-28 pb-16 md:pt-32 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold/20 text-gold rounded-full text-sm font-semibold mb-6"
            >
              <Sun className="w-4 h-4" />
              Solar Projects Available
            </motion.span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
              Reserve Your{" "}
              <span className="bg-gradient-to-r from-gold via-amber-400 to-gold bg-clip-text text-transparent">
                Solar Capacity
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Choose from verified solar projects across India. Start saving on electricity bills with just a few clicks.
            </p>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gold" />
                <span>75% Generation Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold" />
                <span>5-Minute Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-gold" />
                <span>Verified Projects</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
          <path 
            d="M0,96L48,85.3C96,75,192,53,288,48C384,43,480,53,576,69.3C672,85,768,107,864,106.7C960,107,1056,85,1152,74.7C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" 
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}

// Project card component
function ProjectCard({ 
  project, 
  isSelected, 
  onSelect 
}: { 
  project: Project; 
  isSelected: boolean; 
  onSelect: () => void;
}) {
  const features = [
    { icon: Zap, label: `${Number(project.available_capacity_kw).toLocaleString()} kW available` },
    { icon: Shield, label: "75% guaranteed generation" },
    { icon: Leaf, label: "100% renewable energy" },
  ];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={onSelect}
      className={cn(
        "relative cursor-pointer rounded-2xl border-2 transition-all duration-300",
        "bg-white overflow-hidden group",
        isSelected 
          ? "border-forest shadow-xl shadow-forest/10 ring-4 ring-forest/10" 
          : "border-gray-200 hover:border-forest/50 hover:shadow-lg"
      )}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4 z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-8 h-8 rounded-full bg-forest flex items-center justify-center"
          >
            <CheckCircle className="w-5 h-5 text-white" />
          </motion.div>
        </div>
      )}
      
      {/* Top gradient bar */}
      <div className={cn(
        "h-2 w-full transition-all duration-300",
        isSelected 
          ? "bg-gradient-to-r from-forest via-energy-green to-forest" 
          : "bg-gradient-to-r from-gray-200 to-gray-300 group-hover:from-forest/50 group-hover:to-energy-green/50"
      )} />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                isSelected ? "bg-forest text-white" : "bg-gray-100 text-gray-600 group-hover:bg-forest/10 group-hover:text-forest"
              )}>
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-charcoal">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {project.location}
                </p>
              </div>
            </div>
          </div>
          
          {/* Price */}
          <div className="text-right">
            <div className="text-3xl font-bold text-forest">
              ₹{project.price_per_kw}
            </div>
            <div className="text-xs text-gray-500">per kW/month</div>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
        
        {/* Features */}
        <div className="space-y-2 mb-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
              <feature.icon className={cn(
                "w-4 h-4",
                isSelected ? "text-forest" : "text-gray-400"
              )} />
              <span>{feature.label}</span>
            </div>
          ))}
        </div>
        
        {/* Credit rate */}
        {project.rate_per_kwh && (
          <div className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
            isSelected ? "bg-forest/10 text-forest" : "bg-gray-100 text-gray-700"
          )}>
            <TrendingUp className="w-4 h-4" />
            ₹{project.rate_per_kwh}/unit credit value
          </div>
        )}
        
        {/* Dates */}
        {(project.commission_date || project.operational_until) && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500">
            {project.commission_date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Since {new Date(project.commission_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </div>
            )}
            {project.operational_until && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Until {new Date(project.operational_until).getFullYear()}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Capacity selector component
function CapacitySelector({
  selectedProject,
  capacity,
  setCapacity,
  monthlyFee,
  estimatedSavings,
  onReserve,
  isLoggedIn
}: {
  selectedProject: Project | null;
  capacity: number;
  setCapacity: (val: number) => void;
  monthlyFee: number;
  estimatedSavings: number;
  onReserve: () => void;
  isLoggedIn: boolean;
}) {
  const maxCapacity = selectedProject 
    ? Math.min(100, Math.floor(selectedProject.available_capacity_kw || 100)) 
    : 100;
  
  const presetCapacities = [5, 10, 25, 50];
  
  // Use shared solar constants for calculations
  const savings = calculateSolarSavings(capacity);
  const annualSavings = savings.annualSavings;
  const co2Offset = savings.co2OffsetTonnes / 12; // Convert to monthly
  const treesEquivalent = Math.round(savings.treesEquivalent / 12);
  const reservationFee = savings.reservationFee;
  const roiYears = savings.roiYears;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="sticky top-24"
    >
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-forest to-forest-dark p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Battery className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold">Reserve Capacity</h3>
              <p className="text-sm text-white/70">Choose your solar allocation</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {selectedProject ? (
            <>
              {/* Selected project indicator */}
              <div className="flex items-center gap-2 px-3 py-2 bg-forest/5 rounded-lg mb-6">
                <CheckCircle className="w-4 h-4 text-forest" />
                <span className="text-sm font-medium text-forest">{selectedProject.name}</span>
              </div>
              
              {/* Capacity display */}
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-charcoal mb-1">
                  {capacity}
                  <span className="text-2xl text-gray-400 ml-1">kW</span>
                </div>
                <p className="text-sm text-gray-500">Selected capacity</p>
              </div>
              
              {/* Preset buttons */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {presetCapacities.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setCapacity(Math.min(preset, maxCapacity))}
                    className={cn(
                      "py-2 px-3 rounded-lg text-sm font-medium transition-all",
                      capacity === preset
                        ? "bg-forest text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {preset} kW
                  </button>
                ))}
              </div>
              
              {/* Slider */}
              <div className="mb-6">
                <input
                  type="range"
                  min="1"
                  max={maxCapacity}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-forest"
                  aria-label="Select solar capacity"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>1 kW</span>
                  <span>{maxCapacity} kW</span>
                </div>
              </div>
              
              {/* Cost breakdown */}
              <div className="space-y-3 py-4 border-y border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">One-time Reservation</span>
                  <span className="text-lg font-semibold text-charcoal">
                    {formatINR(reservationFee)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-energy-green" />
                    Est. Monthly Savings
                  </span>
                  <span className="text-lg font-semibold text-energy-green">
                    {formatINR(savings.monthlySavings)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Annual Savings</span>
                  <span className="font-medium text-energy-green">
                    {formatINR(annualSavings)}/year
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">ROI Period</span>
                  <span className="font-medium text-forest">
                    ~{roiYears} years
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Credit Rate</span>
                  <span className="font-medium text-gold">
                    ₹{SOLAR_CONSTANTS.creditRatePerUnit}/unit
                  </span>
                </div>
              </div>
              
              {/* Environmental impact */}
              <div className="mt-4 p-4 bg-gradient-to-r from-energy-green/10 to-forest/10 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-4 h-4 text-forest" />
                  <span className="text-sm font-medium text-forest">Environmental Impact</span>
                </div>
                <p className="text-xs text-gray-600">
                  You&apos;ll offset <span className="font-semibold text-forest">{savings.co2OffsetTonnes.toFixed(1)} tons</span> of CO₂/year, 
                  equivalent to planting <span className="font-semibold text-forest">{savings.treesEquivalent} trees</span>
                </p>
              </div>
              
              {/* CTA */}
              <div className="mt-6">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full bg-forest hover:bg-forest-dark text-white font-semibold py-4 text-lg group shadow-lg shadow-forest/20"
                  onClick={onReserve}
                >
                  {isLoggedIn ? "Reserve Now" : "Sign Up to Reserve"}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                {!isLoggedIn && (
                  <p className="text-center text-xs text-gray-500 mt-3">
                    Already have an account?{" "}
                    <Link href="/login?redirect=/reserve" className="text-forest hover:underline">
                      Log in
                    </Link>
                  </p>
                )}
              </div>
              
              {/* Trust badges */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" />
                    <span>Verified Project</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Sun className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-charcoal mb-2">
                Select a Project
              </h4>
              <p className="text-sm text-gray-500">
                Choose a solar project from the list to configure your capacity
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Benefits section
function BenefitsBar() {
  const benefits = [
    { icon: Clock, label: "5-min setup", description: "Quick & easy" },
    { icon: Shield, label: "75% guaranteed", description: "Protected returns" },
    { icon: Zap, label: "Zero installation", description: "No roof needed" },
    { icon: Users, label: "10,000+ users", description: "Trusted platform" },
  ];

  return (
    <div className="bg-gradient-to-r from-offwhite to-white py-8 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-forest/10 flex items-center justify-center flex-shrink-0">
                <benefit.icon className="w-6 h-6 text-forest" />
              </div>
              <div>
                <div className="font-semibold text-charcoal">{benefit.label}</div>
                <div className="text-xs text-gray-500">{benefit.description}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-200" />
                <div>
                  <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
              </div>
              <div>
                <div className="h-8 w-16 bg-gray-200 rounded mb-1" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="h-4 w-full bg-gray-200 rounded mb-2" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 h-96 animate-pulse" />
    </div>
  );
}

export default function ReservePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [capacity, setCapacity] = useState(5);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  // Get URL params from hero section
  const urlCapacity = searchParams.get('capacity');
  const urlProject = searchParams.get('project');

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch("/api/projects");
      const result = await response.json();
      if (result.success) {
        setProjects(result.data);
        
        // Check if URL has project param - select that project
        if (urlProject && result.data.length > 0) {
          const targetProject = result.data.find((p: Project) => 
            p.name.toLowerCase().includes(urlProject.toLowerCase()) || p.id === urlProject
          );
          if (targetProject) {
            setSelectedProject(targetProject);
          } else {
            setSelectedProject(result.data[0]);
          }
        } else if (result.data.length > 0) {
          // Auto-select first project if available
          setSelectedProject(result.data[0]);
        }
      }
      setLoading(false);
    };

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchProjects();
    getUser();
  }, [supabase, urlProject]);

  // Set capacity from URL params (from hero calculator)
  useEffect(() => {
    if (urlCapacity) {
      const cap = parseFloat(urlCapacity);
      if (!isNaN(cap) && cap >= 1 && cap <= 100) {
        setCapacity(cap);
      }
    }
  }, [urlCapacity]);

  const handleReserve = () => {
    if (!selectedProject) return;

    if (!user) {
      router.push("/signup?redirect=/reserve");
      return;
    }

    // Use shared calculation for reservation fee
    const savings = calculateSolarSavings(capacity);
    router.push(
      `/reserve/payment?project=${selectedProject.id}&capacity=${capacity}&amount=${savings.reservationFee}`
    );
  };

  // Use shared solar constants for all calculations
  const savings = calculateSolarSavings(capacity);
  const reservationFee = savings.reservationFee;
  const estimatedSavings = savings.monthlySavings;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero */}
      <PageHero />
      
      {/* Benefits bar */}
      <BenefitsBar />
      
      {/* Main content */}
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {/* Section header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-charcoal mb-2">
                  Available Projects
                </h2>
                <p className="text-gray-600">
                  {projects.length} verified solar project{projects.length !== 1 ? 's' : ''} available for reservation
                </p>
              </motion.div>
              
              {/* Main grid */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Projects list */}
                <div className="lg:col-span-2 space-y-4">
                  <AnimatePresence>
                    {projects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        isSelected={selectedProject?.id === project.id}
                        onSelect={() => setSelectedProject(project)}
                      />
                    ))}
                  </AnimatePresence>
                  
                  {projects.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <Sun className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-charcoal mb-2">
                        No Projects Available
                      </h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        We&apos;re adding new solar projects soon. Check back later or contact us for updates.
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Capacity selector */}
                <div className="lg:col-span-1">
                  <CapacitySelector
                    selectedProject={selectedProject}
                    capacity={capacity}
                    setCapacity={setCapacity}
                    monthlyFee={estimatedSavings}
                    estimatedSavings={estimatedSavings}
                    onReserve={handleReserve}
                    isLoggedIn={!!user}
                  />
                </div>
              </div>
              
              {/* FAQ section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16 bg-white rounded-2xl border border-gray-200 p-8"
              >
                <h3 className="text-xl font-heading font-bold text-charcoal mb-6 flex items-center gap-2">
                  <Info className="w-5 h-5 text-forest" />
                  Frequently Asked Questions
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      q: "How does solar reservation work?",
                      a: "You reserve capacity in our solar projects. The energy generated is credited to your electricity bill as savings."
                    },
                    {
                      q: "Do I need any installation?",
                      a: "No! Digital solar requires zero installation. No roof access, no permits, no technicians."
                    },
                    {
                      q: "What is the 75% guarantee?",
                      a: "We guarantee at least 75% of forecasted generation. You're protected even during monsoon."
                    },
                    {
                      q: "Can I change my capacity later?",
                      a: "Yes, you can upgrade or downgrade your capacity anytime without any penalties."
                    }
                  ].map((faq, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-semibold text-charcoal mb-2">{faq.q}</h4>
                      <p className="text-sm text-gray-600">{faq.a}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Link 
                    href="/help" 
                    className="inline-flex items-center gap-1 text-forest font-medium hover:underline"
                  >
                    View all FAQs
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

