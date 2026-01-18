"use client";

import Link from "next/link";
import { Sun, ArrowRight, Mail, MapPin, Phone, Linkedin, Twitter, Instagram, Youtube, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const footerLinks = {
  product: [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Pricing", href: "/reserve#pricing" },
    { label: "Solar Projects", href: "/reserve" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Bills & Payments", href: "/bills" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Help Center", href: "/help" },
    { label: "Contact", href: "/contact" },
    { label: "Refund Policy", href: "/refund" },
    { label: "Careers", href: "/careers", badge: "Hiring" },
  ],
  resources: [
    { label: "Solar Calculator", href: "/reserve" },
    { label: "FAQ", href: "/help#faq" },
    { label: "Blog", href: "/blog" },
    { label: "Utility Partners", href: "/#utilities" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/powernetpro", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/powernetpro", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com/powernetpro", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com/@powernetpro", label: "YouTube" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer style={{ fontFamily: "'Montserrat', sans-serif" }} className="relative bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gray-100/50 rounded-full blur-3xl" />
      </div>

      {/* Newsletter CTA Section */}
      <div className="relative border-b border-gray-200">
        <div className="container mx-auto px-4 lg:px-8 py-10 md:py-12">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-2xl md:text-3xl font-heading font-bold text-black mb-3">
                Ready to start{" "}
                <span className="text-gold">saving?</span>
              </h2>
              <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-gray-600 text-sm md:text-base mb-6 max-w-xl mx-auto">
                Join thousands of Indian families saving on electricity bills.
                Get exclusive updates and tips delivered to your inbox.
              </p>

              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all shadow-sm"
                    required
                  />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    variant="secondary"
                    className="w-full sm:w-auto bg-gold hover:bg-amber-400 text-black font-semibold px-6 py-3 group shadow-sm"
                  >
                    {isSubscribed ? (
                      "Subscribed! ✓"
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>

              <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xs text-gray-400 mt-3">
                No spam, unsubscribe anytime. By subscribing you agree to our Privacy Policy.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-4 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-gold/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors">
                <Sun className="h-5 w-5 text-gold" />
              </div>
              <span className="text-lg font-heading font-bold text-black">
                PowerNet<span className="text-gold">Pro</span>
              </span>
            </Link>

            <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-gray-600 text-sm mb-5 max-w-xs leading-relaxed">
              Digital Solar platform enabling you to save on power bills without installation.
              Reserve solar capacity and offset your electricity bills with credits.
            </p>

            {/* Contact Info */}
            <div style={{ fontFamily: "'Montserrat', sans-serif" }} className="space-y-2.5 mb-5">
              <a href="mailto:omkarkolhe912@gmail.com" className="flex items-center gap-2.5 text-gray-600 hover:text-black transition-colors text-sm group">
                <Mail className="w-4 h-4 text-gold" />
                omkarkolhe912@gmail.com
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="tel:+918180861415" className="flex items-center gap-2.5 text-gray-600 hover:text-black transition-colors text-sm group">
                <Phone className="w-4 h-4 text-gold" />
                +91 8180 861 415
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <div className="flex items-start gap-2.5 text-gray-600 text-sm">
                <MapPin className="w-4 h-4 text-gold mt-0.5" />
                <span>Kothrud, Pune, Maharashtra, Bharat</span>
              </div>
            </div>

            {/* Social Links */}
            <div style={{ fontFamily: "'Montserrat', sans-serif" }} className="flex items-center gap-2.5">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-50 hover:border-gold/50 transition-all shadow-sm"
                  whileHover={{ y: -2 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 style={{ fontFamily: "'Montserrat', sans-serif" }} className="font-semibold text-black mb-3 text-sm uppercase tracking-wider">Product</h3>
            <ul style={{ fontFamily: "'Montserrat', sans-serif" }} className="space-y-2.5">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-black transition-colors text-sm inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight style={{ fontFamily: "'Montserrat', sans-serif" }} className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 style={{ fontFamily: "'Montserrat', sans-serif" }} className="font-semibold text-black mb-3 text-sm uppercase tracking-wider">Company</h3>
            <ul style={{ fontFamily: "'Montserrat', sans-serif" }} className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-black transition-colors text-sm inline-flex items-center gap-2 group"
                  >
                    {link.label}
                    {link.badge && (
                      <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="px-1.5 py-0.5 text-[10px] font-semibold bg-gold/20 text-gold rounded">
                        {link.badge}
                      </span>
                    )}
                    <ArrowUpRight style={{ fontFamily: "'Montserrat', sans-serif" }} className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 style={{ fontFamily: "'Montserrat', sans-serif" }} className="font-semibold text-black mb-3 text-sm uppercase tracking-wider">Resources</h3>
            <ul style={{ fontFamily: "'Montserrat', sans-serif" }} className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-black transition-colors text-sm inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 style={{ fontFamily: "'Montserrat', sans-serif" }} className="font-semibold text-black mb-3 text-sm uppercase tracking-wider">Legal</h3>
            <ul style={{ fontFamily: "'Montserrat', sans-serif" }} className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-black transition-colors text-sm inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ fontFamily: "'Montserrat', sans-serif" }} className="relative border-t border-gray-200">
        <div className="container mx-auto px-4 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-gray-500 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} PowerNetPro. All rights reserved. Made with 💚 in India.
            </p>

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                All systems operational
              </div>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors text-sm group"
              >
                Back to top
                <motion.div
                  className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center group-hover:bg-gray-50 group-hover:border-gold/50 transition-colors shadow-sm"
                  whileHover={{ y: -2 }}
                >
                  <ArrowRight className="w-4 h-4 -rotate-90" />
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

