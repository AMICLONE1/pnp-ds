"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function HostAuthHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-amber-100 bg-white/95 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Link href="/host-landing" className="flex items-center gap-3 group">
          <Logo className="h-8" />
          <div className="hidden sm:block text-xs font-medium tracking-wide text-gray-500 uppercase border-l border-gray-200 pl-3">
            Host Portal
          </div>
        </Link>

        <Link
          href="/host-landing"
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-black shadow-sm hover:bg-gold/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Host Landing
        </Link>
      </div>
    </header>
  );
}