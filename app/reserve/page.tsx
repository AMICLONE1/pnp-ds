"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LandingHeader } from "@/components/layout/LandingHeader";
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
import { ProjectListSkeleton } from "@/components/ui/skeletons/ProjectListSkeleton";

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
    <section className="relative bg-gradient-to-br from-white via-gold/5 to-amber-50/30 overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-br from-gold/20 via-gold/10 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-amber-100/30 via-transparent to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,184,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,184,0,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="pt-32 pb-20 md:pt-40 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Enhanced badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-gold/20 via-gold/15 to-gold/20 border border-gold/30 rounded-full text-sm font-semibold mb-8 shadow-lg shadow-gold/10 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sun className="w-4 h-4 text-gold" />
              </motion.div>
              <span className="text-gold font-bold tracking-wide">Solar Projects Available</span>
            </motion.div>

            {/* Enhanced heading */}
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-black mb-6 leading-tight"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Reserve Your{" "}
              <motion.span 
                className="bg-gradient-to-r from-gold via-amber-500 to-gold bg-clip-text text-transparent relative inline-block"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                Solar Capacity
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-gold via-amber-500 to-gold rounded-full opacity-50"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                />
              </motion.span>
            </motion.h1>

            {/* Enhanced description */}
            <motion.p 
              className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed font-medium"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Choose from verified solar projects across India. Start saving on electricity bills with just a few clicks.
            </motion.p>

            {/* Enhanced trust indicators */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 md:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <motion.div 
                className="flex items-center gap-3 px-5 py-3 bg-white/80 backdrop-blur-sm border border-gold/20 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center border border-green-200">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500 font-medium">Guarantee</p>
                  <p className="text-sm font-bold text-black">75% Generation</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center gap-3 px-5 py-3 bg-white/80 backdrop-blur-sm border border-gold/20 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center border border-blue-200">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500 font-medium">Setup Time</p>
                  <p className="text-sm font-bold text-black">5 Minutes</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center gap-3 px-5 py-3 bg-white/80 backdrop-blur-sm border border-gold/20 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center border border-amber-200">
                  <BadgeCheck className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500 font-medium">Verification</p>
                  <p className="text-sm font-bold text-black">Verified Projects</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
          <path
            d="M0,96L48,85.3C96,75,192,53,288,48C384,43,480,53,576,69.3C672,85,768,107,864,106.7C960,107,1056,85,1152,74.7C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="white"
            className="drop-shadow-lg"
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
          ? "border-gray-200 shadow-xl shadow-forest/10 ring-4 ring-forest/10"
          : "border-gray-200 hover:border-gray-200/50 hover:shadow-lg"
      )}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4 z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center"
          >
            <CheckCircle className="w-5 h-5 text-black" />
          </motion.div>
        </div>
      )}

      {/* Top gradient bar */}
      <div className={cn(
        "h-2 w-full transition-all duration-300",
        isSelected
          ? "bg-gradient-to-r from-white via-energy-green to-white"
          : "bg-gradient-to-r from-gray-200 to-gray-300 group-hover:from-white/50 group-hover:to-energy-green/50"
      )} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                isSelected ? "bg-white text-white" : "bg-gray-100 text-black group-hover:bg-white/10 group-hover:text-black"
              )}>
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h3 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xl font-heading font-bold text-black">
                  {project.name}
                </h3>
                <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {project.location}
                </p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="text-right">
            <div style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-3xl font-bold text-black">
              ₹{project.price_per_kw}
            </div>
            <div style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xs text-gray-500">per kW/month</div>
          </div>
        </div>

        {/* Description */}
        <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-black text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Features */}
        <div style={{ fontFamily: "'Montserrat', sans-serif" }} className="space-y-2 mb-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-black">
              <feature.icon className={cn(
                "w-4 h-4",
                isSelected ? "text-black" : "text-gray-400"
              )} />
              <span>{feature.label}</span>
            </div>
          ))}
        </div>

        {/* Credit rate */}
        {project.rate_per_kwh && (
          <div style={{ fontFamily: "'Montserrat', sans-serif" }} className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
            isSelected ? "bg-white/10 text-black" : "bg-gray-100 text-black"
          )}>
            <TrendingUp className="w-4 h-4" />
            ₹{project.rate_per_kwh}/unit credit value
          </div>
        )}

        {/* Dates */}
        {(project.commission_date || project.operational_until) && (
          <div style={{ fontFamily: "'Montserrat', sans-serif" }} className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500">
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
        <div className="bg-gradient-to-r from-white to-white-dark p-6 text-black">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Battery className="w-5 h-5" />
            </div>
            <div>
              <h3 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xl font-heading font-bold">Reserve Capacity</h3>

              <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-sm text-black/70">Choose your solar allocation</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {selectedProject ? (
            <>
              {/* Selected project indicator */}
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg mb-6">
                <CheckCircle className="w-4 h-4 text-black" />
                <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-sm font-medium text-black">{selectedProject.name}</span>
              </div>

              {/* Capacity display */}
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-black mb-1">
                  {capacity}
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-2xl text-gray-400 ml-1">kW</span>
                </div>
                <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-sm text-gray-500">Selected capacity</p>
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
                        ? "bg-white text-white"
                        : "bg-gray-100 text-black hover:bg-gray-200"
                    )}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
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
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }}>1 kW</span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }}>{maxCapacity} kW</span>
                </div>
              </div>

              {/* Cost breakdown */}
              <div className="space-y-3 py-4 border-y border-gray-100">
                <div className="flex justify-between items-center">
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-black">One-time Reservation</span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-lg font-semibold text-black">
                    {formatINR(reservationFee)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-black flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-energy-green" />
                    Est. Monthly Savings
                  </span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-lg font-semibold text-energy-green">
                    {formatINR(savings.monthlySavings)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-gray-500">Annual Savings</span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="font-medium text-energy-green">
                    {formatINR(annualSavings)}/year
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-gray-500">ROI Period</span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="font-medium text-black">
                    ~{roiYears} years
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-gray-500">Credit Rate</span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="font-medium text-gold">
                    ₹{SOLAR_CONSTANTS.creditRatePerUnit}/unit
                  </span>
                </div>
              </div>

              {/* Environmental impact */}
              <div className="mt-4 p-4 bg-gradient-to-r from-energy-green/10 to-white/10 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-4 h-4 text-black" />
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-sm font-medium text-black">Environmental Impact</span>
                </div>
                <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xs text-black">
                  You&apos;ll offset <span className="font-semibold text-black">{savings.co2OffsetTonnes.toFixed(1)} tons</span> of CO₂/year,
                  equivalent to planting <span className="font-semibold text-black">{savings.treesEquivalent} trees</span>
                </p>
              </div>

              {/* CTA */}
              <div className="mt-6">
                <Button
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                  variant="primary"
                  size="lg"
                  className="w-full bg-white hover:bg-white text-black font-semibold py-4 text-lg group shadow-lg shadow-forest/20"
                  onClick={onReserve}
                >
                  {isLoggedIn ? "Reserve Now" : "Sign Up to Reserve"}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                {!isLoggedIn && (
                  <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-center text-xs text-gray-500 mt-3">
                    Already have an account?{" "}
                    <Link style={{ fontFamily: "'Montserrat', sans-serif" }} href="/login?redirect=/reserve" className="text-black hover:underline">
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
                    <span style={{ fontFamily: "'Montserrat', sans-serif" }}>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" />
                    <span style={{ fontFamily: "'Montserrat', sans-serif" }}>Verified Project</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Sun style={{ fontFamily: "'Montserrat', sans-serif" }} className="w-8 h-8 text-gray-400" />
              </div>
              <h4 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-lg font-semibold text-black mb-2">
                Select a Project
              </h4>
              <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-sm text-gray-500">
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
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <benefit.icon className="w-6 h-6 text-black" />
              </div>
              <div>
                <div style={{ fontFamily: "'Montserrat', sans-serif" }} className="font-semibold text-black">{benefit.label}</div>
                <div style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xs text-gray-500">{benefit.description}</div>
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
      // Show skeleton for minimum 10 seconds
      setTimeout(() => {
        setLoading(false);
      }, 10000);
    };

    const getUser = async () => {
      try {
        // Use getSession() to ensure session is refreshed if needed
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (!sessionError && session?.user) {
          setUser(session.user);
        } else {
          // Fallback to getUser() if getSession() fails
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (!userError && user) {
            setUser(user);
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error getting user:", error);
        setUser(null);
      }
    };

    // Set up auth state listener to track session changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    fetchProjects();
    getUser();

    return () => {
      subscription.unsubscribe();
    };
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
    <div className="min-h-screen flex flex-col bg-white">
      {user ? <Header /> : <LandingHeader />}

      {/* Hero */}
      <PageHero />

      {/* Benefits bar */}
      <BenefitsBar />

      {/* Main content */}
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          {loading ? (
            <ProjectListSkeleton />
          ) : (
            <>
              {/* Section header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h2 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-2xl md:text-3xl font-heading font-bold text-black mb-2">
                  Available Projects
                </h2>
                <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-black">
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
                      <h3 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xl font-semibold text-black mb-2">
                        No Projects Available
                      </h3>
                      <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-gray-500 max-w-md mx-auto">
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
                <h3 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xl font-heading font-bold text-black mb-6 flex items-center gap-2">
                  <Info className="w-5 h-5 text-black" />
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
                    <div key={index} className="p-4 bg-white rounded-xl">
                      <h4 style={{ fontFamily: "'Montserrat', sans-serif" }} className="font-semibold text-black mb-2">{faq.q}</h4>
                      <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-sm text-black">{faq.a}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Link
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    href="/help"
                    className="inline-flex items-center gap-1 text-black font-medium hover:underline"
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

