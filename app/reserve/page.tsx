"use client";

import { Suspense, useEffect, useState, useRef } from "react";
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
    { icon: Zap, label: `${Number(project.available_capacity_kw).toLocaleString()} kW available`, color: "text-gold" },
    { icon: Shield, label: "75% guaranteed generation", color: "text-green-600" },
    { icon: Leaf, label: "100% renewable energy", color: "text-emerald-600" },
  ];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={cn(
        "relative cursor-pointer rounded-3xl border-2 transition-all duration-300",
        "bg-white overflow-hidden group",
        isSelected
          ? "border-gold/50 shadow-2xl shadow-gold/20 ring-4 ring-gold/20"
          : "border-gray-200 hover:border-gold/30 hover:shadow-xl hover:shadow-gold/10"
      )}
    >
      {/* Selected indicator with animation */}
      {isSelected && (
        <motion.div 
          className="absolute top-4 right-4 z-10"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center shadow-lg shadow-gold/30">
              <CheckCircle className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <motion.div
              className="absolute inset-0 rounded-full bg-gold/30 blur-md"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      )}

      {/* Enhanced top gradient bar */}
      <motion.div 
        className={cn(
          "h-3 w-full transition-all duration-300 relative overflow-hidden",
          isSelected
            ? "bg-gradient-to-r from-gold via-amber-400 to-gold"
            : "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 group-hover:from-gold/30 group-hover:via-gold/20 group-hover:to-gold/30"
        )}
      >
        {isSelected && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        )}
      </motion.div>

      <div className="p-6 md:p-8">
        {/* Enhanced Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <motion.div 
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md",
                  isSelected 
                    ? "bg-gradient-to-br from-gold/20 to-amber-100 border-2 border-gold/30" 
                    : "bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200 group-hover:from-gold/10 group-hover:to-amber-50 group-hover:border-gold/20"
                )}
                whileHover={{ rotate: 15, scale: 1.1 }}
              >
                <Sun className={cn(
                  "w-6 h-6 transition-colors",
                  isSelected ? "text-gold" : "text-gray-600 group-hover:text-gold"
                )} />
              </motion.div>
              <div className="flex-1">
                <h3 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-2xl font-heading font-bold text-black mb-1">
                  {project.name}
                </h3>
                <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-sm text-gray-600 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gold" />
                  {project.location}
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Price */}
          <div className="text-right ml-4">
            <motion.div 
              style={{ fontFamily: "'Montserrat', sans-serif" }} 
              className={cn(
                "text-4xl font-bold mb-1 transition-colors",
                isSelected ? "text-gold" : "text-black"
              )}
              animate={isSelected ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              ₹{project.price_per_kw}
            </motion.div>
            <div style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xs text-gray-500 font-medium">
              per kW/month
            </div>
          </div>
        </div>

        {/* Enhanced Description */}
        <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-gray-700 text-sm mb-5 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        {/* Enhanced Features */}
        <div style={{ fontFamily: "'Montserrat', sans-serif" }} className="space-y-3 mb-5">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="flex items-center gap-3 text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={cn(
                "p-2 rounded-lg transition-all",
                isSelected 
                  ? "bg-gold/10" 
                  : "bg-gray-50 group-hover:bg-gold/5"
              )}>
                <feature.icon className={cn(
                  "w-4 h-4 transition-colors",
                  isSelected ? feature.color : "text-gray-500 group-hover:" + feature.color
                )} />
              </div>
              <span className={cn(
                "font-medium transition-colors",
                isSelected ? "text-black" : "text-gray-700 group-hover:text-black"
              )}>
                {feature.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Credit rate */}
        {project.rate_per_kwh && (
          <motion.div 
            style={{ fontFamily: "'Montserrat', sans-serif" }} 
            className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
              isSelected 
                ? "bg-gradient-to-r from-gold/10 via-amber-50/50 to-gold/10 border border-gold/20 text-gold" 
                : "bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 text-gray-700 group-hover:from-gold/5 group-hover:to-amber-50/30 group-hover:border-gold/20 group-hover:text-gold"
            )}
            whileHover={{ scale: 1.02 }}
          >
            <TrendingUp className="w-4 h-4" />
            ₹{project.rate_per_kwh}/unit credit value
          </motion.div>
        )}

        {/* Enhanced Dates */}
        {(project.commission_date || project.operational_until) && (
          <div style={{ fontFamily: "'Montserrat', sans-serif" }} className="mt-5 pt-5 border-t border-gray-100 flex flex-wrap gap-4 text-xs">
            {project.commission_date && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                <Calendar className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-gray-600 font-medium">
                  Since {new Date(project.commission_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            )}
            {project.operational_until && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-gray-600 font-medium">
                  Until {new Date(project.operational_until).getFullYear()}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hover glow effect */}
      {!isSelected && (
        <motion.div
          className="absolute inset-0 rounded-3xl bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          initial={false}
        />
      )}
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
      <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-2xl overflow-hidden">
        {/* Enhanced Header */}
        <div className="relative bg-gradient-to-br from-gold/10 via-amber-50/30 to-gold/5 p-6 md:p-7 text-black border-b border-gold/20">
          <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5 opacity-50" />
          <div className="relative flex items-center gap-3 mb-2">
            <motion.div 
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-amber-100 flex items-center justify-center border border-gold/30 shadow-md"
              whileHover={{ rotate: 10, scale: 1.1 }}
            >
              <Battery className="w-6 h-6 text-gold" />
            </motion.div>
            <div>
              <h3 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-2xl font-heading font-bold">Reserve Capacity</h3>
              <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-sm text-gray-600 font-medium">Choose your solar allocation</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-7">
          {selectedProject ? (
            <>
              {/* Enhanced Selected project indicator */}
              <motion.div 
                className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gold/10 via-amber-50/20 to-gold/10 rounded-xl mb-6 border border-gold/20 shadow-sm"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center shadow-md">
                  <CheckCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-sm font-bold text-black">{selectedProject.name}</span>
              </motion.div>

              {/* Enhanced Capacity display */}
              <div className="text-center mb-8">
                <motion.div 
                  className="text-6xl md:text-7xl font-bold mb-2"
                  key={capacity}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <span className="bg-gradient-to-r from-gold via-amber-500 to-gold bg-clip-text text-transparent">
                    {capacity}
                  </span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-3xl text-gray-400 ml-2">kW</span>
                </motion.div>
                <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-sm text-gray-600 font-medium">Selected capacity</p>
              </div>

              {/* Enhanced Preset buttons */}
              <div className="grid grid-cols-4 gap-2.5 mb-6">
                {presetCapacities.map((preset) => (
                  <motion.button
                    key={preset}
                    onClick={() => setCapacity(Math.min(preset, maxCapacity))}
                    className={cn(
                      "py-3 px-2 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm",
                      capacity === preset
                        ? "bg-gradient-to-br from-gold to-amber-500 text-white shadow-lg shadow-gold/30 scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                    )}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={preset > maxCapacity}
                  >
                    {preset} kW
                  </motion.button>
                ))}
              </div>

              {/* Enhanced Slider */}
              <div className="mb-8">
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max={maxCapacity}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full appearance-none cursor-pointer slider-thumb-centered"
                    style={{
                      background: `linear-gradient(to right, #FFB800 0%, #FFB800 ${((capacity - 1) / (maxCapacity - 1)) * 100}%, #E5E7EB ${((capacity - 1) / (maxCapacity - 1)) * 100}%, #E5E7EB 100%)`
                    }}
                    aria-label="Select solar capacity"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-3 font-medium">
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }}>1 kW</span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }}>{maxCapacity} kW</span>
                </div>
              </div>

              {/* Enhanced Cost breakdown */}
              <div className="space-y-4 py-6 border-y-2 border-gray-100">
                <motion.div 
                  className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-gold/5 to-amber-50/30 border border-gold/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-black font-semibold">One-time Reservation</span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xl font-bold text-gold">
                    {formatINR(reservationFee)}
                  </span>
                </motion.div>
                <motion.div 
                  className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-black font-semibold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Est. Monthly Savings
                  </span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xl font-bold text-green-600">
                    {formatINR(savings.monthlySavings)}
                  </span>
                </motion.div>
                <div className="flex justify-between items-center text-sm px-3">
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-gray-600 font-medium">Annual Savings</span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="font-bold text-green-600">
                    {formatINR(annualSavings)}/year
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm px-3">
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-gray-600 font-medium">ROI Period</span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="font-bold text-black">
                    ~{roiYears.toFixed(1)} years
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm px-3">
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-gray-600 font-medium">Credit Rate</span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="font-bold text-gold">
                    ₹{SOLAR_CONSTANTS.creditRatePerUnit}/unit
                  </span>
                </div>
              </div>

              {/* Enhanced Environmental impact */}
              <motion.div 
                className="mt-6 p-5 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50 rounded-2xl border-2 border-emerald-200 shadow-md"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-md">
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-base font-bold text-emerald-800">Environmental Impact</span>
                </div>
                <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-sm text-emerald-900 leading-relaxed">
                  You&apos;ll offset <span className="font-bold text-emerald-800">{savings.co2OffsetTonnes.toFixed(1)} tons</span> of CO₂/year,
                  equivalent to planting <span className="font-bold text-emerald-800">{savings.treesEquivalent} trees</span>
                </p>
              </motion.div>

              {/* Enhanced CTA */}
              <div className="mt-8">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    variant="primary"
                    size="lg"
                    className="w-full bg-gradient-to-r from-gold via-amber-500 to-gold hover:from-amber-500 hover:via-gold hover:to-amber-500 text-black font-bold py-5 text-lg group shadow-xl shadow-gold/30 hover:shadow-2xl hover:shadow-gold/40 transition-all duration-300"
                    onClick={onReserve}
                  >
                    <Sparkles className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                    {isLoggedIn ? "Reserve Now" : "Sign Up to Reserve"}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>

                {!isLoggedIn && (
                  <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-center text-xs text-gray-600 mt-4 font-medium">
                    Already have an account?{" "}
                    <Link style={{ fontFamily: "'Montserrat', sans-serif" }} href="/login?redirect=/reserve" className="text-gold hover:underline font-semibold">
                      Log in
                    </Link>
                  </p>
                )}
              </div>

              {/* Enhanced Trust badges */}
              <div className="mt-8 pt-6 border-t-2 border-gray-100">
                <div className="flex items-center justify-center gap-6">
                  <motion.div 
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Shield className="w-4 h-4 text-gold" />
                    <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xs text-gray-700 font-semibold">Secure Payment</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    <BadgeCheck className="w-4 h-4 text-gold" />
                    <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xs text-gray-700 font-semibold">Verified Project</span>
                  </motion.div>
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

function ReservePageContent() {
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

              {/* Enhanced FAQ section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16 bg-gradient-to-br from-white via-gold/5 to-amber-50/20 rounded-3xl border-2 border-gold/20 shadow-xl p-8 md:p-10"
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-amber-100 flex items-center justify-center border border-gold/30">
                      <Info className="w-6 h-6 text-gold" />
                    </div>
                    <h3 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-2xl md:text-3xl font-heading font-bold text-black">
                      Frequently Asked Questions
                    </h3>
                  </div>
                  <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-gray-600 ml-[3.75rem]">
                    Everything you need to know about solar reservations
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-5">
                  {[
                    {
                      q: "How does solar reservation work?",
                      a: "You reserve capacity in our solar projects. The energy generated is credited to your electricity bill as savings.",
                      icon: Zap,
                      color: "from-blue-50 to-cyan-50",
                      borderColor: "border-blue-200"
                    },
                    {
                      q: "Do I need any installation?",
                      a: "No! Digital solar requires zero installation. No roof access, no permits, no technicians.",
                      icon: Building2,
                      color: "from-green-50 to-emerald-50",
                      borderColor: "border-green-200"
                    },
                    {
                      q: "What is the 75% guarantee?",
                      a: "We guarantee at least 75% of forecasted generation. You're protected even during monsoon.",
                      icon: Shield,
                      color: "from-amber-50 to-orange-50",
                      borderColor: "border-amber-200"
                    },
                    {
                      q: "Can I change my capacity later?",
                      a: "Yes, you can upgrade or downgrade your capacity anytime without any penalties.",
                      icon: TrendingUp,
                      color: "from-purple-50 to-pink-50",
                      borderColor: "border-purple-200"
                    }
                  ].map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className={cn(
                        "p-5 rounded-2xl border-2 transition-all duration-300 shadow-md hover:shadow-lg",
                        `bg-gradient-to-br ${faq.color} ${faq.borderColor}`
                      )}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                          `bg-gradient-to-br ${faq.color} border ${faq.borderColor}`
                        )}>
                          <faq.icon className="w-5 h-5 text-gray-700" />
                        </div>
                        <h4 style={{ fontFamily: "'Montserrat', sans-serif" }} className="font-bold text-black text-base leading-tight">
                          {faq.q}
                        </h4>
                      </div>
                      <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-sm text-gray-700 leading-relaxed ml-[3.25rem]">
                        {faq.a}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  className="mt-8 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <Link
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    href="/help"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gold/30 rounded-xl text-gold font-semibold hover:bg-gold/10 hover:border-gold/50 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    View all FAQs
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </motion.div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ReservePage() {
  return (
    <Suspense fallback={<ProjectListSkeleton />}>
      <ReservePageContent />
    </Suspense>
  );
}
