"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  Tag,
} from "lucide-react";
import { blogData } from "@/lib/utils/data";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { Footer } from "@/components/layout/footer";

type BlogPost = (typeof blogData)[number];

const categories: string[] = Array.from(new Set(blogData.map((post: any) => post.category as string)));

function BlogPreviewCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="group"
    >
      <Link
        href={`/blog/${post.slug}`}
        className={`block overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl ${featured ? "h-full" : "h-full"}`}
      >
        <div className={featured ? "grid h-full lg:grid-rows-[360px_1fr]" : "grid h-full gap-0 lg:grid-rows-[260px_1fr]"}>
          <div className="relative min-h-[260px] overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes={featured ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 1024px) 100vw, 33vw"}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-dark shadow-sm">
              <Tag className="h-3.5 w-3.5" />
              {post.category}
            </div>
          </div>

          <div className={featured ? "p-6 sm:p-8" : "p-5 sm:p-6"}>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-1 text-gold-dark tracking-normal">
                <Calendar className="h-3.5 w-3.5" />
                {post.date}
              </span>
              <span className="inline-flex items-center gap-1 tracking-normal">
                <Clock className="h-3.5 w-3.5" />
                {post.readingTime}
              </span>
            </div>

            <h2 className={`${featured ? "mt-4 text-2xl sm:text-3xl lg:text-4xl" : "mt-3 text-xl sm:text-2xl"} font-heading font-bold leading-tight text-black transition-colors group-hover:text-gold-dark`}>
              {post.title}
            </h2>

            <p className={`${featured ? "mt-4 text-base sm:text-lg" : "mt-3 text-sm sm:text-base"} line-clamp-3 leading-7 text-gray-600`}>
              {post.excerpt}
            </p>

            <div className="mt-5 inline-flex items-center gap-2 font-semibold text-black transition-colors group-hover:text-gold-dark">
              Read full story
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function BlogIndexPage() {
  const featuredPost = blogData[0] as any;
  const restPosts = blogData.slice(1) as any[];

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top_left,_rgba(255,183,0,0.12),_transparent_30%),linear-gradient(180deg,#ffffff_0%,#fbfaf6_100%)]">
      <LandingHeader />

      <main className="flex-1 px-4 pt-24 pb-14 sm:pt-28 sm:pb-16">
        <div className="mx-auto w-full max-w-7xl">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-[2rem] border border-gold/15 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8 lg:p-10"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold-dark">
                  <BookOpen className="h-4 w-4" />
                  PowerNetPro Blog
                </span>
                <h1 className="mt-4 text-3xl font-heading font-bold tracking-tight text-black sm:text-4xl lg:text-5xl">
                  Practical solar stories, product updates, and savings guides.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
                  Browse our latest articles to learn how digital solar works, how credits are applied, and how to get more out of every bill.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Articles</p>
                  <p className="mt-1 text-2xl font-bold text-black">{blogData.length}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Categories</p>
                  <p className="mt-1 text-2xl font-bold text-black">{categories.length}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm col-span-2 sm:col-span-1">
                  <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Freshness</p>
                  <p className="mt-1 text-lg font-semibold text-black">Updated insights</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span key={category} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
                  <Tag className="h-3.5 w-3.5 text-gold-dark" />
                  {category}
                </span>
              ))}
            </div>
          </motion.section>

          <section className="mt-10">
            <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
              <BlogPreviewCard post={featuredPost} featured />

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="rounded-[1.75rem] border border-forest/10 bg-gradient-to-br from-forest to-black p-6 text-white shadow-xl"
              >
                <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold/90">
                  <Sparkles className="h-3.5 w-3.5" />
                  What we cover
                </p>
                <h2 className="mt-4 text-2xl font-heading font-bold sm:text-3xl">
                  Easy-to-read guides for users, hosts, and solar beginners.
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/75 sm:text-base">
                  Learn how digital solar credits work, how to save more, and how PowerNetPro fits into everyday electricity bills.
                </p>

                <div className="mt-5 space-y-2 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gold" />
                    Savings explainers
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gold" />
                    Product updates and walkthroughs
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gold" />
                    Articles for hosts and residential users
                  </div>
                </div>

                <Link
                  href="/"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
                >
                  Back to homepage
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>

            <div className="mt-10">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
                    All Articles
                  </p>
                  <h2 className="mt-2 text-2xl font-heading font-bold text-black sm:text-3xl">
                    Complete blog archive
                  </h2>
                </div>
                <p className="text-sm text-gray-500">
                  {restPosts.length + 1} posts sourced from the uploaded folder
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {restPosts.map((post) => (
                  <BlogPreviewCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}