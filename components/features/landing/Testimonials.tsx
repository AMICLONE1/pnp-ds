"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { GlassCard } from "./GlassCard";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  location?: string;
  since: string;
  source?: string;
  verified?: boolean;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Solar power is abundant but not very accessible. But now with PowerNetPro, I pay for a part of my power bill without having to install panels by myself. No hassles, no fossils.",
    author: "Sandeep",
    role: "Customer",
    location: "Mumbai",
    since: "2020",
    source: "The Better India",
    verified: true,
  },
  {
    quote:
      "Tapped into solar power produced miles away to pay for energy with panels mounted on sites across India. A digital platform is a win-win situation.",
    author: "Suraj",
    role: "Customer",
    location: "Delhi",
    since: "2021",
    source: "Scroll",
    verified: true,
  },
  {
    quote:
      "As a renter, I never thought I could go solar. PowerNetPro made it possible. My bills have reduced by 40% and I feel good about my environmental impact.",
    author: "Priya",
    role: "Customer",
    location: "Bangalore",
    since: "2022",
    verified: true,
  },
  {
    quote:
      "The best part is I can monitor my solar generation in real-time. It's transparent, reliable, and the savings are real. Highly recommend!",
    author: "Rahul",
    role: "Customer",
    location: "Pune",
    since: "2023",
    verified: true,
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const { ref: headerRef, controls: headerControls } = useScrollAnimation({ direction: "fade" });

  // Auto-rotate carousel
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-white relative" aria-label="Customer testimonials">
      <div className="container mx-auto px-4">
        <motion.div
          ref={headerRef}
          animate={headerControls}
          initial="hidden"
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6 text-black">
            Trusted by Real People
          </h2>
          <p className="text-xl text-black max-w-2xl mx-auto">
            Join 1,000+ homeowners saving ₹50,000+ annually
          </p>
        </motion.div>

        {/* Featured Testimonial Carousel */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <GlassCard className="p-8 md:p-12">
                  <div className="absolute top-4 right-4">
                    <Quote className="h-12 w-12 text-black/20" aria-hidden="true" />
                  </div>
                  <p className="text-xl md:text-2xl text-black mb-8 leading-relaxed relative z-10">
                    &quot;{testimonials[currentIndex].quote}&quot;
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 border-t border-white/20 gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-bold text-xl text-black">{testimonials[currentIndex].author}</p>
                        {testimonials[currentIndex].verified && (
                          <div className="flex items-center gap-1 text-success">
                            <CheckCircle className="h-5 w-5" aria-label="Verified customer" />
                            <span className="text-sm font-medium">Verified</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-black">
                        {testimonials[currentIndex].role} since {testimonials[currentIndex].since}
                        {testimonials[currentIndex].location && ` • ${testimonials[currentIndex].location}`}
                      </p>
                    </div>
                    {testimonials[currentIndex].source && (
                      <div className="text-xs text-gray-500 italic bg-white/20 px-3 py-1 rounded-full">
                        {testimonials[currentIndex].source}
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all focus-visible-ring"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6 text-black" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all focus-visible-ring"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6 text-black" />
            </button>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setAutoPlay(false);
                    setTimeout(() => setAutoPlay(true), 10000);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-8 bg-white"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

