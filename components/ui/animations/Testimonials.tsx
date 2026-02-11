"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Play, Star } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  id?: string;
  quote?: string;
  content?: string; // Alias for quote
  author: string;
  role?: string;
  location?: string;
  avatar?: string;
  rating?: number;
  savings?: string;
  video?: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function TestimonialCarousel({
  testimonials: rawTestimonials,
  className = "",
  autoPlay = true,
  autoPlayInterval = 5000,
}: TestimonialCarouselProps) {
  // Normalize testimonials to ensure id and quote exist
  const testimonials = rawTestimonials.map((t, i) => ({
    ...t,
    id: t.id || `testimonial-${i}`,
    quote: t.quote || t.content || "",
  }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!autoPlay || isPaused || !mounted) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isPaused, testimonials.length, mounted]);

  const next = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  if (!mounted) {
    return <div className={className} />;
  }

  const current = testimonials[currentIndex];

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main testimonial */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-white-dark p-8 md:p-12 min-h-[400px] shadow-2xl">
        <Quote className="absolute top-6 right-6 h-16 w-16 text-gold/20" />
        
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
            {/* Rating */}
            {current.rating && (
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < current.rating! ? "text-gold fill-gold" : "text-black"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Quote */}
            <p className="text-xl md:text-2xl lg:text-3xl text-black leading-relaxed mb-8 font-light">
              &ldquo;{current.quote}&rdquo;
            </p>

            {/* Author info */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {current.avatar ? (
                  <Image
                    src={current.avatar}
                    alt={current.author}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gold/30"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-black font-bold text-xl">
                    {current.author.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-black text-lg">{current.author}</p>
                  <p className="text-gray-400 text-sm">
                    {current.role && `${current.role}`}
                    {current.location && ` • ${current.location}`}
                  </p>
                </div>
              </div>

              {current.savings && (
                <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
                  <span className="text-green-400 font-semibold">{current.savings} saved</span>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="absolute bottom-8 right-8 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prev}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-black" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={next}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-black" />
          </motion.button>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-gold w-8" : "bg-white/30 w-2 hover:bg-white/50"
            }`}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>
    </div>
  );
}

interface LogoMarqueeProps {
  logos: { src?: string; alt?: string; name?: string; logo?: string }[];
  className?: string;
  speed?: number;
}

export function LogoMarquee({ logos, className = "", speed = 30 }: LogoMarqueeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={className} />;
  }

  // Normalize logo data
  const normalizedLogos = logos.map(l => ({
    src: l.src || l.logo || "",
    alt: l.alt || l.name || "",
  }));

  // Quadruple logos for seamless loop
  const allLogos = [...normalizedLogos, ...normalizedLogos, ...normalizedLogos, ...normalizedLogos];
  const logoWidth = 160; // Approximate width including gap
  const totalWidth = logoWidth * normalizedLogos.length;

  return (
    <div className={`overflow-hidden relative ${className}`}>
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex gap-16 items-center"
        animate={{
          x: [0, -totalWidth],
        }}
        transition={{
          x: {
            duration: speed,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {allLogos.map((logo, index) => (
          <div
            key={index}
            className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
          >
{/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-10 md:h-12 w-auto object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: ReactNode;
  className?: string;
  delay?: number;
  prefix?: string;
  suffix?: string;
  accentColor?: string;
}

export function StatCard({ 
  value, 
  label, 
  icon, 
  className = "", 
  delay = 0,
  prefix = "",
  suffix = "",
  accentColor = "#FFB800",
}: StatCardProps) {
  const [mounted, setMounted] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animate the number counting up
  useEffect(() => {
    if (!mounted) return;
    
    const duration = 2000;
    const startTime = Date.now();
    const numericValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(easeOut * numericValue));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, mounted]);

  if (!mounted) {
    return <div className={`p-6 rounded-2xl bg-white shadow-lg border border-gray-100 ${className}`} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`p-6 rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 ${className}`}
    >
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: `${accentColor}20` }}
      >
        {icon && <div style={{ color: accentColor }}>{icon}</div>}
      </div>
      <div 
        className="text-4xl md:text-5xl font-bold mb-2"
        style={{ color: accentColor }}
      >
        {prefix}{displayValue.toLocaleString('en-IN')}{suffix}
      </div>
      <div className="text-black text-sm font-medium">{label}</div>
    </motion.div>
  );
}
