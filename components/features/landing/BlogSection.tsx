"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Sparkles } from "lucide-react";
import { ScrollFade } from "@/components/ui/animations";
import { blogData } from "@/lib/utils/data";

type BlogPost = (typeof blogData)[number];

function BlogCard({ post, compact = false }: { post: BlogPost; compact?: boolean }) {
    return (
        <motion.article
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="group"
        >
            <Link
                href={`/blog/${post.slug}`}
                className={`block overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl ${compact ? "" : "h-full"}`}
            >
                <div className={`${compact ? "grid grid-cols-[112px_1fr] gap-4 p-4 sm:grid-cols-[128px_1fr]" : "grid gap-0 lg:grid-rows-[320px_1fr]"}`}>
                    <div className={`relative overflow-hidden ${compact ? "h-28 rounded-2xl" : "min-h-[280px]"}`}>
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            sizes={compact ? "(max-width: 640px) 112px, 128px" : "(max-width: 1024px) 100vw, 50vw"}
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                        <div className="absolute left-3 top-3 inline-flex rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-dark shadow-sm">
                            {post.category}
                        </div>
                    </div>

                    <div className={compact ? "min-w-0 pr-2" : "p-6 sm:p-8"}>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                            <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-1 text-gold-dark tracking-normal uppercase">
                                <Calendar className="h-3.5 w-3.5" />
                                {post.date}
                            </span>
                            <span className="inline-flex items-center gap-1 tracking-normal uppercase">
                                <Clock className="h-3.5 w-3.5" />
                                {post.readingTime}
                            </span>
                        </div>

                        <h3 className={`mt-3 font-heading font-bold text-black transition-colors group-hover:text-gold-dark ${compact ? "text-lg leading-7 line-clamp-2" : "text-2xl sm:text-3xl leading-tight"}`}>
                            {post.title}
                        </h3>

                        <p className={`mt-3 text-gray-600 leading-7 ${compact ? "text-sm line-clamp-2" : "text-base sm:text-lg line-clamp-3"}`}>
                            {post.excerpt}
                        </p>

                        <span className="mt-4 inline-flex items-center gap-2 font-semibold text-black transition-colors group-hover:text-gold-dark">
                            Read full story
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}

export function BlogSection() {
    const featuredPost = blogData[0];
    const secondaryPosts = blogData.slice(1, 4);

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-amber-50/25 to-white py-16 sm:py-20 lg:py-24">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -right-20 top-12 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
                <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-forest/10 blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <ScrollFade direction="up">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <span
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-white px-4 py-2 text-sm font-semibold text-gold-dark shadow-sm"
                            >
                                <Sparkles className="h-4 w-4" />
                                Latest from the blog
                            </span>
                            <h2
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                className="mt-4 text-3xl font-heading font-bold tracking-tight text-black sm:text-4xl lg:text-5xl"
                            >
                                Stories, guides, and solar insights that stay practical.
                            </h2>
                            <p
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                className="mt-4 max-w-xl text-base leading-7 text-gray-600 sm:text-lg"
                            >
                                Read the latest updates on solar savings, billing tips, and the ideas shaping PowerNetPro.
                            </p>
                        </div>

                        <Link
                            href="/blog"
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/20 bg-white px-5 py-3 text-sm font-semibold text-black shadow-sm transition-colors hover:border-gold hover:text-gold-dark"
                        >
                            View all articles
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </ScrollFade>

                <div className="mt-10 grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
                    <ScrollFade direction="up" delay={0.12}>
                        <BlogCard post={featuredPost} />
                    </ScrollFade>

                    <div className="space-y-4">
                        {secondaryPosts.map((post, index) => (
                            <ScrollFade key={post.id} direction="up" delay={0.14 + index * 0.08}>
                                <BlogCard post={post} compact />
                            </ScrollFade>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="mt-8 rounded-[1.75rem] border border-gold/15 bg-gradient-to-r from-forest to-black px-6 py-6 text-white shadow-xl sm:px-8"
                >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/90">
                                Blog
                            </p>
                            <h3 className="mt-2 text-2xl font-heading font-bold sm:text-3xl">
                                Explore the full archive for more solar guidance.
                            </h3>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
                                From beginner explanations to practical savings advice, the blog is built to help users and hosts make faster decisions.
                            </p>
                        </div>

                        <Link
                            href="/blog"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
                        >
                            Browse articles
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
