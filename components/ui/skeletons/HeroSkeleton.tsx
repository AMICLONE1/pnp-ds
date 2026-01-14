"use client";

import { cn } from "@/lib/utils";

export function HeroSkeleton() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-forest via-forest-light to-forest-dark">
      {/* Background placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest-light to-forest-dark" />
      
      {/* Content skeleton */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge skeleton */}
          <div className="flex justify-center">
            <div className="h-10 w-48 bg-white/10 rounded-full animate-pulse" />
          </div>
          
          {/* Headline skeleton */}
          <div className="space-y-4">
            <div className="h-12 md:h-16 bg-white/10 rounded-lg animate-pulse mx-auto max-w-3xl" />
            <div className="h-12 md:h-16 bg-white/10 rounded-lg animate-pulse mx-auto max-w-2xl" />
          </div>
          
          {/* Subheadline skeleton */}
          <div className="space-y-2 max-w-xl mx-auto">
            <div className="h-6 bg-white/10 rounded animate-pulse" />
            <div className="h-6 bg-white/10 rounded animate-pulse w-3/4 mx-auto" />
          </div>
          
          {/* CTA buttons skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <div className="h-14 w-48 bg-gold/30 rounded-xl animate-pulse" />
            <div className="h-14 w-40 bg-white/10 rounded-xl animate-pulse" />
          </div>
          
          {/* Stats skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 animate-pulse">
                <div className="h-8 w-8 bg-white/10 rounded-full mx-auto mb-2" />
                <div className="h-6 bg-white/10 rounded mb-1" />
                <div className="h-4 bg-white/10 rounded w-2/3 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Scroll indicator skeleton */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full animate-pulse" />
      </div>
    </section>
  );
}

export function StatsSkeleton() {
  return (
    <section className="py-20 bg-offwhite">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4" />
              <div className="h-10 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BenefitsSkeleton() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header skeleton */}
        <div className="text-center mb-16 space-y-4">
          <div className="h-8 w-32 bg-gray-200 rounded-full mx-auto animate-pulse" />
          <div className="h-12 bg-gray-200 rounded-lg max-w-xl mx-auto animate-pulse" />
          <div className="h-6 bg-gray-200 rounded max-w-md mx-auto animate-pulse" />
        </div>
        
        {/* Cards skeleton */}
        <div className="grid md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-6 animate-pulse">
              <div className="h-14 w-14 bg-gray-200 rounded-xl mb-4" />
              <div className="h-6 bg-gray-200 rounded mb-2 w-3/4" />
              <div className="h-4 bg-gray-200 rounded mb-1" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSkeleton() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-offwhite">
      <div className="container mx-auto px-4">
        {/* Header skeleton */}
        <div className="text-center mb-16 space-y-4">
          <div className="h-8 w-40 bg-gray-200 rounded-full mx-auto animate-pulse" />
          <div className="h-12 bg-gray-200 rounded-lg max-w-lg mx-auto animate-pulse" />
        </div>
        
        {/* Steps skeleton */}
        <div className="max-w-4xl mx-auto">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 mb-8 animate-pulse">
              <div className="h-16 w-16 bg-gray-200 rounded-full flex-shrink-0" />
              <div className="flex-1 bg-gray-50 rounded-xl p-6">
                <div className="h-6 bg-gray-200 rounded mb-2 w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSkeleton() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <div className="h-8 w-36 bg-gray-200 rounded-full mx-auto animate-pulse" />
          <div className="h-12 bg-gray-200 rounded-lg max-w-md mx-auto animate-pulse" />
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-6 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-1 w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-4/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQSkeleton() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <div className="h-8 w-32 bg-gray-200 rounded-full mx-auto animate-pulse" />
          <div className="h-12 bg-gray-200 rounded-lg max-w-lg mx-auto animate-pulse" />
        </div>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-5 bg-gray-200 rounded w-2/3" />
                <div className="h-5 w-5 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Generic section skeleton
export function SectionSkeleton({ height = "h-96" }: { height?: string }) {
  return (
    <div className={cn("bg-gray-100 animate-pulse", height)} />
  );
}
