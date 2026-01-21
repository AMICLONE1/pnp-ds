"use client";

import Link from "next/link";
import { Sun, User, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LandingHeader() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm cursor-gold"
    >
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-3 h-20 items-center gap-4">
          {/* Logo - Left */}
          <div className="flex items-center justify-start">
            <Link 
              href="/" 
              className="flex items-center gap-3 group"
            >
              <motion.div
                className="relative w-10 h-10 rounded-xl bg-gold/20 backdrop-blur-md flex items-center justify-center border border-gold/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sun className="h-5 w-5 text-gold" />
              </motion.div>
              <span className="text-xl font-heading font-bold text-black whitespace-nowrap">
                PowerNet<span className="text-gold">Pro</span>
              </span>
            </Link>
          </div>

          {/* Navigation - Centered */}
          <nav className="hidden md:flex items-center justify-center">
            <div className="bg-white/90 border-2 border-gold rounded-2xl shadow-lg px-6 py-2.5 flex items-center gap-6" style={{boxShadow: '0 4px 24px 0 rgba(255,184,0,0.10)'}}>
              <Link
                href="/#how-it-works"
                className="text-black hover:text-gold transition-all duration-300 font-medium text-sm whitespace-nowrap px-3 py-1.5 rounded-lg hover:bg-gold/5"
              >
                How It Works
              </Link>
              <div className="w-px h-5 bg-gold/30" />
              <Link
                href="/#benefits"
                className="text-black hover:text-gold transition-all duration-300 font-medium text-sm whitespace-nowrap px-3 py-1.5 rounded-lg hover:bg-gold/5"
              >
                Benefits
              </Link>
              <div className="w-px h-5 bg-gold/30" />
              <Link
                href="/contact"
                className="text-black hover:text-gold transition-all duration-300 font-medium text-sm whitespace-nowrap px-3 py-1.5 rounded-lg hover:bg-gold/5"
              >
                Contact
              </Link>
            </div>
          </nav>

          {/* User Profile Dropdown - Right */}
          <div className="relative flex items-center justify-end">
            <motion.button
              id="user-menu-button"
              className="relative w-12 h-12 rounded-full bg-gradient-to-br from-gold via-gold-light to-amber-200 flex items-center justify-center shadow-lg border-2 border-gold/80 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 transition-all duration-300 hover:shadow-xl hover:shadow-gold/30 hover:scale-110 hover:border-gold active:scale-95 group overflow-hidden flex-shrink-0"
              onClick={() => {
                const menu = document.getElementById('user-menu-dropdown');
                const button = document.getElementById('user-menu-button');
                if (menu) {
                  const isHidden = menu.classList.contains('hidden');
                  menu.classList.toggle('hidden');
                  if (button) {
                    button.setAttribute('aria-expanded', String(!isHidden));
                  }
                }
              }}
              aria-haspopup="true"
              aria-expanded="false"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-300" />
              
              {/* User icon */}
              <User className="relative z-10 w-5 h-5 text-black group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gold/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 -z-10" />
            </motion.button>
            {/* Dropdown menu */}
            <motion.div
              id="user-menu-dropdown"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="hidden absolute right-0 top-16 w-[200px] bg-white rounded-xl shadow-2xl border border-gold/30 py-2 z-50 overflow-hidden backdrop-blur-sm"
              style={{ boxShadow: '0 10px 40px rgba(255, 184, 0, 0.15)' }}
            >
              {loading ? (
                <div className="px-5 py-2.5 text-gray-400 text-sm">Loading...</div>
              ) : user ? (
                <>
                  <div className="px-5 py-2 text-xs text-gray-500 truncate border-b border-gold/10 mb-1">
                    {user.email}
                  </div>
                  <Link
                    href="/dashboard"
                    className="block px-5 py-2.5 text-black hover:bg-gold/10 hover:text-gold transition-all duration-200 font-medium text-sm border-l-2 border-transparent hover:border-gold"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-5 py-2.5 text-black hover:bg-gold/10 hover:text-gold transition-all duration-200 font-medium text-sm border-l-2 border-transparent hover:border-gold"
                  >
                    Settings
                  </Link>
                  <div className="border-t border-gold/20 my-1.5" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-2.5 text-red-600 hover:bg-red-50 transition-all duration-200 font-medium text-sm border-l-2 border-transparent hover:border-red-500 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-5 py-2.5 text-black hover:bg-gold/10 hover:text-gold transition-all duration-200 font-medium text-sm border-l-2 border-transparent hover:border-gold"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-5 py-2.5 text-black hover:bg-gold/10 hover:text-gold transition-all duration-200 font-medium text-sm border-l-2 border-transparent hover:border-gold"
                  >
                    Signup
                  </Link>
                  <div className="border-t border-gold/20 my-1.5" />
                  <Link
                    href="/signup"
                    className="block px-5 py-2.5 text-gold hover:bg-gold hover:text-black transition-all duration-200 font-semibold text-sm border-l-2 border-transparent hover:border-gold"
                  >
                    Start Saving
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
