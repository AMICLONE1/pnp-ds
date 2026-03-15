"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, Tag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    image: string;
    slug: string;
}

interface BlogCarouselProps {
    posts: BlogPost[];
    className?: string;
    autoPlay?: boolean;
    autoPlayInterval?: number;
}

export function BlogCarousel({
    posts,
    className = "",
    autoPlay = true,
    autoPlayInterval = 6000,
}: BlogCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    // Calculate how many items to show based on screen size
    // For simplicity in this "simple slider", we'll show 1 at a time on mobile, 2 on tablet, 3 on desktop
    // But for a "carousel" effect with AnimatePresence, showing 1 with nice transitions is often cleaner

    useEffect(() => {
        if (!autoPlay || isPaused) return;

        const interval = setInterval(() => {
            move(1);
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, isPaused, posts.length]);

    const move = (step: number) => {
        setDirection(step);
        setCurrentIndex((prev) => (prev + step + posts.length) % posts.length);
    };

    const variants = {
        enter: (direction: number) => ({
            x: shouldReduceMotion ? 0 : direction > 0 ? "20%" : "-20%",
            opacity: 0,
            scale: 0.95,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: shouldReduceMotion ? 0 : direction < 0 ? "20%" : "-20%",
            opacity: 0,
            scale: 0.95,
        }),
    };

    return (
        <div
            className={`relative group ${className}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="relative overflow-hidden min-h-[500px] py-10 px-4">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.4 },
                            scale: { duration: 0.4 }
                        }}
                        className="w-full flex justify-center"
                    >
                        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row transition-all duration-300 hover:shadow-2xl">
                            {/* Image side */}
                            <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                                <Image
                                    src={posts[currentIndex].image}
                                    alt={posts[currentIndex].title}
                                    fill
                                    className="object-cover transition-transform duration-700 hover:scale-110"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-gold text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                        {posts[currentIndex].category}
                                    </span>
                                </div>
                            </div>

                            {/* Content side */}
                            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-gold" />
                                        <span>{posts[currentIndex].date}</span>
                                    </div>
                                </div>

                                <h3 className="text-2xl md:text-3xl font-heading font-bold text-black mb-4 leading-tight">
                                    {posts[currentIndex].title}
                                </h3>

                                <p className="text-gray-600 mb-8 line-clamp-3 leading-relaxed">
                                    {posts[currentIndex].excerpt}
                                </p>

                                <div className="mt-auto">
                                    <Link href={`/blog/${posts[currentIndex].slug}`} className="group/btn inline-flex items-center gap-2 text-black font-bold hover:text-gold transition-colors">
                                        Read Full Story
                                        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center group-hover/btn:bg-gold transition-colors">
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-2 sm:px-4 md:px-0">
                <button
                    onClick={() => move(-1)}
                    className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center pointer-events-auto transition-transform hover:scale-110 active:scale-95 group/nav"
                    aria-label="Previous post"
                >
                    <ChevronLeft className="w-6 h-6 text-black group-hover/nav:text-gold transition-colors" />
                </button>
                <button
                    onClick={() => move(1)}
                    className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center pointer-events-auto transition-transform hover:scale-110 active:scale-95 group/nav"
                    aria-label="Next post"
                >
                    <ChevronRight className="w-6 h-6 text-black group-hover/nav:text-gold transition-colors" />
                </button>
            </div>

            {/* Pagination dots */}
            <div className="flex justify-center gap-3 mt-4">
                {posts.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1);
                            setCurrentIndex(index);
                        }}
                        className={`h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-gold w-10 shadow-sm" : "bg-gray-200 w-2.5 hover:bg-gray-300"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
