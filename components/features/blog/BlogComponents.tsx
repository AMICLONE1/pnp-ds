"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Linkedin, Facebook, Twitter, Link as LinkIcon, Share2, ChevronDown, CheckCircle2, Info } from "lucide-react";
import { motion } from "framer-motion";

// --- Breadcrumbs ---
export function BlogBreadcrumbs({ title }: { title: string }) {
    return (
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-hidden whitespace-nowrap">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link href="/blog" className="hover:text-gold transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="text-black font-medium truncate">{title}</span>
        </nav>
    );
}

// --- Meta Info ---
export function BlogMeta({ author, editor, updatedDate, readingTime }: any) {
    if (!author) return null;

    return (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-gray-500">
            {author && (
                <span>
                    Written by:{" "}
                    <span className="text-blue-600 font-medium cursor-pointer hover:underline">{author.name}</span>
                </span>
            )}
            {editor && (
                <span>
                    Edited by:{" "}
                    <span className="text-blue-600 font-medium cursor-pointer hover:underline">{editor.name}</span>
                </span>
            )}
            {updatedDate && <span>Updated {updatedDate}</span>}
            {readingTime && (
                <>
                    <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />
                    <span>{readingTime}</span>
                </>
            )}
        </div>
    );
}

// --- Social Share ---
export function SocialShare() {
    const icons = [
        { icon: Linkedin, label: "LinkedIn" },
        { icon: Facebook, label: "Facebook" },
        { icon: Twitter, label: "Twitter" },
        { icon: Share2, label: "Share" },
        { icon: LinkIcon, label: "Copy Link" }
    ];

    return (
        <div className="flex items-center gap-3 mb-10">
            {icons.map((item, i) => (
                <button
                    key={i}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gold hover:border-gold hover:text-black transition-all"
                    title={item.label}
                >
                    <item.icon className="w-4 h-4" />
                </button>
            ))}
        </div>
    );
}

// --- Table of Contents ---
export function TableOfContents({ items }: { items: { id: string, title: string }[] }) {
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        if (!items.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                // Find the topmost intersecting entry
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible.length > 0) {
                    setActiveId(visible[0].target.id);
                }
            },
            { rootMargin: "-10% 0% -70% 0%", threshold: 0 }
        );

        items.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [items]);

    return (
        <div className="mb-10">
            <div className="mb-6">
                <h3 className="text-sm font-bold text-black flex items-center justify-between group cursor-pointer">
                    Why trust Digital Solar?
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gold" />
                </h3>
                <div className="h-px bg-gray-100 my-4" />
            </div>

            <div>
                <div className="flex items-center justify-between mb-5">
                    <span className="font-bold text-black text-base">Table of contents</span>
                    <ChevronDown className="w-4 h-4 text-black" />
                </div>
                <ul className="space-y-3">
                    {items.map((item, i) => {
                        const isActive = activeId === item.id;
                        return (
                            <li key={i} className="flex gap-2.5 items-start">
                                <span
                                    className={`w-1.5 h-1.5 rounded-full mt-[6px] flex-shrink-0 transition-colors duration-200 ${
                                        isActive ? "bg-blue-800" : "bg-blue-500"
                                    }`}
                                />
                                <Link
                                    href={`#${item.id}`}
                                    className={`text-sm leading-snug transition-all duration-200 ${
                                        isActive
                                            ? "text-blue-900 font-semibold"
                                            : "text-blue-600 font-normal hover:underline"
                                    }`}
                                >
                                    {item.title}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

// --- Key Takeaways ---
export function KeyTakeaways({ points }: { points: string[] }) {
    return (
        <div className="bg-gray-50/80 rounded-2xl border border-gray-100 p-8 mb-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-6">Key Takeaways</h3>
            <ul className="space-y-4">
                {points.map((point, i) => (
                    <li key={i} className="flex gap-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                        <p className="text-gray-700 leading-relaxed text-[15px]">{point}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// --- Lead Gen / Sticky Sidebar Box ---
export function BlogSidebarCTA() {
    return (
        <div className="bg-blue-600 rounded-2xl p-8 text-white mb-8">
            <h3 className="text-2xl font-bold mb-4">Ready to go solar?</h3>
            <p className="text-blue-100 text-sm mb-6">Join thousands of families saving on sunlight.</p>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="ZIP code"
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm w-full placeholder:text-white/50 focus:outline-none focus:bg-white/20"
                />
                <button className="bg-white text-blue-600 font-bold px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors whitespace-nowrap">
                    See solar prices
                </button>
            </div>
            <div className="flex flex-col gap-2 text-[11px] text-blue-100">
                <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3" /> Vetted installers
                </div>
                <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3" /> Unbiased advice
                </div>
                <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3" /> Completely free
                </div>
            </div>
        </div>
    );
}
