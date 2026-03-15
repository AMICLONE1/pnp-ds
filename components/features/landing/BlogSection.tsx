"use client";

import { motion } from "framer-motion";
import { ScrollFade, GradientMesh } from "@/components/ui/animations";
import { BlogCarousel } from "@/components/ui/animations/BlogCarousel";
import { blogData } from "@/lib/utils/data.js";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

export function BlogSection() {
    return (
        <section className="py-24 bg-white relative overflow-hidden px-20">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <ScrollFade direction="up">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div className="max-w-2xl">
                            <span
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                className="inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-4"
                            >
                                <BookOpen className="w-4 h-4" />
                                Latest From Blog
                            </span>
                            <h2
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                className="text-4xl md:text-5xl font-heading font-bold text-black mb-4"
                            >
                                Insights for Your <span className="text-gold">Energy Future</span>
                            </h2>
                            <p
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                className="text-xl text-black/70"
                            >
                                Stay updated with the latest trends in renewable energy, solar technology, and sustainable living.
                            </p>
                        </div>

                        <motion.div
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 text-black font-bold border-b-2 border-gold pb-1 hover:text-gold transition-colors text-lg"
                            >
                                Explore All Articles
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </div>
                </ScrollFade>

                <ScrollFade direction="up" delay={0.2}>
                    <div className="relative">
                        <BlogCarousel posts={blogData} />
                    </div>
                </ScrollFade>
            </div>
        </section>
    );
}
