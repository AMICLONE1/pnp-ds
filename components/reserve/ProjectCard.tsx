"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Zap,
  TrendingUp,
  Calendar,
  Sun,
  Shield,
  Leaf,
  CheckCircle,
  Clock,
} from "lucide-react";

export interface Project {
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

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onSelect: () => void;
}

export function ProjectCard({ project, isSelected, onSelect }: ProjectCardProps) {
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
                <h3 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-2xl font-heading font-bold text-black mb-0.5">
                  {project.name}
                </h3>
                <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[11px] font-semibold text-amber-600 mb-1">
                  Currently not operational (Coming Soon)
                </p>
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
