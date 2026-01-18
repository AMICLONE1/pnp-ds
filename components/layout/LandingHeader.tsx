"use client";

import Link from "next/link";
import { Sun } from "lucide-react";
import { motion } from "framer-motion";

export function LandingHeader() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm cursor-gold"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group cursor-pointer-gold"
          >
            <motion.div
              className="relative w-10 h-10 rounded-xl bg-gold/20 backdrop-blur-md flex items-center justify-center border border-gold/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sun className="h-5 w-5 text-gold" />
            </motion.div>
            <span className="text-xl font-heading font-bold text-black">
              PowerNet<span className="text-gold">Pro</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 bg-white/90 border-2 border-gold rounded-2xl shadow-lg px-8 py-2 cursor-pointer-gold" style={{boxShadow: '0 4px 24px 0 rgba(255,184,0,0.10)'}}>
            <Link
              href="/#how-it-works"
              className="text-black hover:text-gold transition-colors duration-300 font-medium cursor-pointer-gold"
            >
              How It Works
            </Link>
            <Link
              href="/#benefits"
              className="text-black hover:text-gold transition-colors duration-300 font-medium cursor-pointer-gold"
            >
              Benefits
            </Link>
            <Link
              href="/contact"
              className="text-black hover:text-gold transition-colors duration-300 font-medium cursor-pointer-gold"
            >
              Contact
            </Link>
          </nav>

          {/* User Profile Dropdown */}
          <div className="relative flex items-center gap-3 cursor-pointer-gold">
            <button
              id="user-menu-button"
              className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center shadow-md border-2 border-gold focus:outline-none focus:ring-2 focus:ring-gold/40 cursor-pointer-gold"
              onClick={() => {
                const menu = document.getElementById('user-menu-dropdown');
                if (menu) menu.classList.toggle('hidden');
              }}
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span className="text-black font-bold text-xl select-none">U</span>
            </button>
            {/* Dropdown menu */}
            <div
              id="user-menu-dropdown"
              className="hidden absolute right-0 top-14 min-w-[180px] bg-white rounded-xl shadow-xl border border-gold py-2 z-50 cursor-pointer-gold"
              style={{ minWidth: 180 }}
            >
              <Link href="/login" className="block px-5 py-2 text-black hover:bg-gold/10 transition-colors font-medium cursor-pointer-gold">Login</Link>
              <Link href="/signup" className="block px-5 py-2 text-black hover:bg-gold/10 transition-colors font-medium cursor-pointer-gold">Signup</Link>
              <Link href="/signup" className="block px-5 py-2 text-black hover:bg-gold/10 transition-colors font-semibold cursor-pointer-gold">Start Saving</Link>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
