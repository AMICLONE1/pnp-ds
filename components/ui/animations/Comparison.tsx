"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ComparisonSliderProps {
  beforeContent: ReactNode;
  afterContent: ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  initialPosition?: number;
}

export function ComparisonSlider({
  beforeContent,
  afterContent,
  beforeLabel = "Before",
  afterLabel = "After",
  className = "",
  initialPosition = 50,
}: ComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleStart = () => setIsDragging(true);
  const handleEnd = () => setIsDragging(false);

  useEffect(() => {
    if (!mounted) return;
    
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [mounted]);

  if (!mounted) {
    return <div className={className} />;
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none cursor-ew-resize ${className}`}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* After (right) content - full width background */}
      <div className="relative w-full">
        {afterContent}
      </div>

      {/* Before (left) content - clipped */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <div className="relative h-full" style={{ width: `${100 / (sliderPosition / 100)}%` }}>
          {beforeContent}
        </div>
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-6 bg-gray-400 rounded-full" />
            <div className="w-0.5 h-6 bg-gray-400 rounded-full" />
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-sm font-medium text-white">
        {beforeLabel}
      </div>
      <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-sm font-medium text-white">
        {afterLabel}
      </div>
    </div>
  );
}

interface BeforeAfterCardProps {
  beforeTitle: string;
  afterTitle: string;
  beforeItems: { text: string; positive?: boolean }[];
  afterItems: { text: string; positive?: boolean }[];
  className?: string;
}

export function BeforeAfterCard({
  beforeTitle,
  afterTitle,
  beforeItems,
  afterItems,
  className = "",
}: BeforeAfterCardProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"before" | "after">("before");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={className} />;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Tab buttons */}
      <div className="flex mb-6 p-1 bg-white/5 rounded-xl">
        <button
          onClick={() => setActiveTab("before")}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            activeTab === "before"
              ? "bg-red-500/20 text-red-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {beforeTitle}
        </button>
        <button
          onClick={() => setActiveTab("after")}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            activeTab === "after"
              ? "bg-green-500/20 text-green-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {afterTitle}
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === "before" ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: activeTab === "before" ? 20 : -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {(activeTab === "before" ? beforeItems : afterItems).map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-3 p-4 rounded-xl ${
                item.positive !== false
                  ? "bg-green-500/10 border border-green-500/20"
                  : "bg-red-500/10 border border-red-500/20"
              }`}
            >
              <span className={item.positive !== false ? "text-green-400" : "text-red-400"}>
                {item.positive !== false ? "✓" : "✗"}
              </span>
              <span className="text-white">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface FeatureComparisonProps {
  features: {
    name?: string;
    feature?: string; // Alias for name
    digital: string | boolean;
    rooftop: string | boolean;
  }[];
  className?: string;
  leftLabel?: string;
  rightLabel?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function FeatureComparison({ 
  features: rawFeatures, 
  className = "",
  leftLabel = "Digital Solar ☀️",
  rightLabel = "Rooftop Solar 🏠",
  leftIcon,
  rightIcon,
}: FeatureComparisonProps) {
  const [mounted, setMounted] = useState(false);

  // Normalize features to ensure name exists
  const features = rawFeatures.map(f => ({
    ...f,
    name: f.name || f.feature || "",
  }));

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={className} />;
  }

  return (
    <div className={`overflow-hidden rounded-2xl border border-white/10 ${className}`}>
      {/* Header */}
      <div className="grid grid-cols-3 bg-white/5 border-b border-white/10">
        <div className="p-4 font-medium text-gray-400">Feature</div>
        <div className="p-4 font-medium text-center text-gold border-x border-white/10 flex items-center justify-center gap-2">
          {leftIcon}
          {leftLabel}
        </div>
        <div className="p-4 font-medium text-center text-gray-400 flex items-center justify-center gap-2">
          {rightIcon}
          {rightLabel}
        </div>
      </div>

      {/* Rows */}
      {features.map((feature, index) => (
        <motion.div
          key={feature.name}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
          className={`grid grid-cols-3 ${
            index !== features.length - 1 ? "border-b border-white/10" : ""
          }`}
        >
          <div className="p-4 text-white">{feature.name}</div>
          <div className="p-4 text-center border-x border-white/10">
            {typeof feature.digital === "boolean" ? (
              <span className={feature.digital ? "text-green-400" : "text-red-400"}>
                {feature.digital ? "✓" : "✗"}
              </span>
            ) : (
              <span className="text-green-400">{feature.digital}</span>
            )}
          </div>
          <div className="p-4 text-center">
            {typeof feature.rooftop === "boolean" ? (
              <span className={feature.rooftop ? "text-green-400" : "text-red-400"}>
                {feature.rooftop ? "✓" : "✗"}
              </span>
            ) : (
              <span className="text-gray-400">{feature.rooftop}</span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
