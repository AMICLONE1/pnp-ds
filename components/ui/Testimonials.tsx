import { TestimonialCarousel } from "./animations";
import { Users } from "lucide-react";
import {
    ScrollFade,
} from "@/components/ui/animations";
import { testimonialData } from "@/lib/utils/data.js"

interface TestimonialProps {
    className?: string;
}

export function Testimonials({ className = "" }: TestimonialProps) {
    return (
        <section className="py-24 bg-gradient-to-b from-white via-white to-white relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold/10 rounded-full blur-3xl" />
            <div className="container mx-auto px-4 relative z-10">
                <ScrollFade direction="up">
                    <div className="text-center mb-16">
                        <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            <Users className="w-4 h-4" />
                            Customer Stories
                        </span>
                        <h2 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-4xl md:text-5xl font-heading font-bold text-black mb-4">
                            What Our Users Say
                        </h2>
                        <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xl text-black max-w-2xl mx-auto">
                            Real savings from real people across India
                        </p>
                    </div>
                </ScrollFade>

                <TestimonialCarousel testimonials={testimonialData} />
            </div>
        </section>
    )
}