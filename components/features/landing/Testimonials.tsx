"use client";

import { ScrollAnimation } from "@/components/features/landing/ScrollAnimation";
import { Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  since: string;
  source?: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Solar power is abundant but not very accessible. But now with PowerNetPro, I pay for a part of my power bill without having to install panels by myself. No hassles, no fossils.",
    author: "Sandeep",
    role: "Customer",
    since: "2020",
    source: "The Better India",
  },
  {
    quote:
      "Tapped into solar power produced miles away to pay for energy with panels mounted on sites across India. A digital platform is a win-win situation.",
    author: "Suraj",
    role: "Customer",
    since: "2021",
    source: "Scroll",
  },
  {
    quote:
      "As a renter, I never thought I could go solar. PowerNetPro made it possible. My bills have reduced by 40% and I feel good about my environmental impact.",
    author: "Priya",
    role: "Customer",
    since: "2022",
  },
  {
    quote:
      "The best part is I can monitor my solar generation in real-time. It's transparent, reliable, and the savings are real. Highly recommend!",
    author: "Rahul",
    role: "Customer",
    since: "2023",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-offwhite relative">
      <div className="container mx-auto px-4">
        <ScrollAnimation direction="fade">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6 text-charcoal">
              What our customers say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers saving money and the planet
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <ScrollAnimation key={index} direction="up" delay={index * 0.1}>
              <div className="relative p-8 bg-white rounded-2xl shadow-xl border border-gray-100 h-full">
                <Quote className="h-8 w-8 text-forest/20 mb-4" />
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-charcoal">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">
                      {testimonial.role} since {testimonial.since}
                    </p>
                  </div>
                  {testimonial.source && (
                    <div className="text-xs text-gray-500 italic">
                      — {testimonial.source}
                    </div>
                  )}
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* Partner Logos */}
        <ScrollAnimation direction="fade">
          <div className="mt-16 text-center">
            <p className="text-sm text-gray-600 mb-6">Trusted by leading organizations</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold text-charcoal">Zerodha</div>
              <div className="text-2xl font-bold text-charcoal">IIMB</div>
              <div className="text-2xl font-bold text-charcoal">Tata Power Solar</div>
              <div className="text-2xl font-bold text-charcoal">Social Alpha</div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}

