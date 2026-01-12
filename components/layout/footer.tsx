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
    <footer className="relative bg-forest overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-energy-green/5 rounded-full blur-3xl" />
      </div>
      
      {/* Newsletter CTA Section */}
      <div className="relative border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                Ready to start{" "}
                <span className="text-gold">saving?</span>
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Join thousands of Indian families saving on electricity bills. 
                Get exclusive updates and tips delivered to your inbox.
              </p>
              
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                    required
                  />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    variant="secondary"
                    className="w-full sm:w-auto bg-gold hover:bg-gold-light text-charcoal font-semibold px-6 py-3.5 group"
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
              
              <p className="text-xs text-gray-500 mt-4">
                No spam, unsubscribe anytime. By subscribing you agree to our Privacy Policy.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors">
                <Sun className="h-5 w-5 text-gold" />
              </div>
              <span className="text-xl font-heading font-bold text-white">
                PowerNet<span className="text-gold">Pro</span>
              </span>
            </Link>
            
            <p className="text-gray-400 text-sm mb-6 max-w-xs leading-relaxed">
              Digital Solar platform enabling you to save on power bills without installation. 
              Reserve solar capacity and offset your electricity bills with credits.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a href="mailto:hello@powernetpro.in" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm group">
                <Mail className="w-4 h-4 text-gold" />
                hello@powernetpro.in
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="tel:+918001234567" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm group">
                <Phone className="w-4 h-4 text-gold" />
                +91 800 123 4567
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <div className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-gold mt-0.5" />
                <span>Bangalore, Karnataka, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-gold/30 transition-all"
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
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-2 group"
                  >
                    {link.label}
                    {link.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-gold/20 text-gold rounded">
                        {link.badge}
                      </span>
                    )}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1 group"
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
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1 group"
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
      <div className="relative border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} PowerNetPro. All rights reserved. Made with 💚 in India.
            </p>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 rounded-full bg-energy-green animate-pulse" />
                All systems operational
              </div>
              
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm group"
              >
                Back to top
                <motion.div
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors"
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

