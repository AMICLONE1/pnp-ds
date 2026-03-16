"use client";

import Link from "next/link";
import { Sun, User, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";

const hostNavLinks = [
  { label: "Benefits", href: "#benefits" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Savings", href: "#savings" },
  { label: "Eligibility", href: "#eligibility" },
  { label: "FAQ", href: "#faq" },
];

export function HostHeader() {
  const [visible, setVisible] = useState(true);
  const [inHero, setInHero] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      // Mini navbar: visible only in hero section
      setInHero(currentY < window.innerHeight);

      // Main navbar: hide on scroll down, show on scroll up
      if (currentY < 15) {
        setVisible(true);
      } else if (currentY > lastScrollY) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentY);

      // Active section tracking
      const sections = document.querySelectorAll("section[id]");
      let current = "";
      sections.forEach((section) => {
        const el = section as HTMLElement;
        if (window.scrollY >= el.offsetTop - 100) {
          current = el.getAttribute("id") || "";
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50"
      animate={{ y: visible ? 0 : "-100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Mini Navbar Strip — visible only in hero section */}
      <motion.div
        animate={{ height: inHero ? 40 : 0, opacity: inHero ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-[#1a1f2e] w-full overflow-hidden"
      >
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl flex items-center h-10">
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 hover:text-white transition-colors duration-200"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              For Consumer&apos;s
            </Link>
            <Link
              href="/host-landing"
              className="text-[11px] uppercase tracking-wider font-bold text-gold hover:text-gold-light transition-colors duration-200"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              For Host&apos;s
            </Link>
          </nav>
        </div>
      </motion.div>

      {/* Host Main Navbar */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="flex h-14 items-center justify-between">
            {/* Logo - Left */}
            <Link href="/host-landing" className="text-base font-bold text-black whitespace-nowrap" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              PowerNet<span className="text-gold">Pro</span>
            </Link>

            {/* Nav Links - Center */}
            <nav className="hidden md:flex items-center gap-1">
              {hostNavLinks.map((link, i) => (
                <span key={link.href} className="flex items-center">
                  {i > 0 && <span className="w-px h-4 bg-gold/30 mx-1" />}
                  <Link
                    href={link.href}
                    className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap ${
                      activeSection === link.href.replace("#", "")
                        ? "text-gold bg-gold/10"
                        : "text-black hover:text-gold hover:bg-gold/5"
                    }`}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {link.label}
                  </Link>
                </span>
              ))}
            </nav>

            {/* CTA - Right */}
            <Link
              href="/login"
              className="text-sm font-semibold bg-gold text-black px-4 py-2 rounded-xl hover:bg-gold/90 transition-all duration-200 shadow-sm whitespace-nowrap"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Host Login
            </Link>
          </div>
        </div>
      </header>
    </motion.div>
  );
}

export function LandingHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const isHostLanding = pathname === "/host-landing";
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [inHero, setInHero] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const heroThreshold = window.innerHeight;

      // Mini navbar: visible only while within the hero section
      setInHero(currentY < heroThreshold);

      // Main navbar: hide on scroll down, show on scroll up
      if (currentY < 15) {
        setVisible(true);
      } else if (currentY > lastScrollY) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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
    <motion.div
      className="fixed top-0 left-0 right-0 z-50"
      animate={{ y: visible ? 0 : "-100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Mini Navbar Strip — visible only in hero section */}
      <motion.div
        animate={{ height: inHero ? 40 : 0, opacity: inHero ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-[#1a1f2e] w-full overflow-hidden"
      >
        <div className="container mx-auto px-6 sm:px-6 lg:px-8 max-w-7xl flex items-center h-10">
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className={`text-[11px] uppercase tracking-wider transition-colors duration-200 ${!isHostLanding
                  ? "font-bold text-gold hover:text-gold-light"
                  : "font-semibold text-gray-400 hover:text-white"
                }`}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              For Consumer&apos;s
            </Link>
            <Link
              href="/host-landing"
              className={`text-[11px] uppercase tracking-wider transition-colors duration-200 ${isHostLanding
                  ? "font-bold text-gold hover:text-gold-light"
                  : "font-semibold text-gray-400 hover:text-white"
                }`}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              For Host&apos;s
            </Link>
          </nav>
        </div>
      </motion.div>

      {/* Main Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white cursor-gold"
      >
        <div className="container mx-auto px-6 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex h-16 md:h-20 items-center justify-between">
            {/* Logo - Left */}
            <div className="flex items-center justify-start">
              <Link
                href="/"
                className="flex items-center gap-3 group"
              >
                <span className="text-lg md:text-xl font-heading font-bold text-black whitespace-nowrap">
                  PowerNet<span className="text-gold">Pro</span>
                </span>
              </Link>
            </div>

            {/* Navigation - Centered */}
            <nav className="hidden md:flex items-center justify-center">
              <div className="bg-white/90 border-2 border-gold rounded-2xl shadow-lg px-6 py-2.5 flex items-center gap-6" style={{ boxShadow: '0 4px 24px 0 rgba(255,184,0,0.10)' }}>
                {/* <Link href="/#how-it-works" className="text-black hover:text-gold transition-all duration-300 font-medium text-sm whitespace-nowrap px-3 py-1.5 rounded-lg hover:bg-gold/5">
                  How It Works
                </Link> */}
                {/* <div className="w-px h-5 bg-gold/30" /> */}
                <Link href="/#about-us" className="text-black hover:text-gold transition-all duration-300 font-medium text-sm whitespace-nowrap px-3 py-1.5 rounded-lg hover:bg-gold/5">
                  About Us
                </Link>
                <div className="w-px h-5 bg-gold/30" />
                <Link href="/#projects" className="text-black hover:text-gold transition-all duration-300 font-medium text-sm whitespace-nowrap px-3 py-1.5 rounded-lg hover:bg-gold/5">
                  Projects
                </Link>
                <div className="w-px h-5 bg-gold/30" />
                <Link href="/#faq" className="text-black hover:text-gold transition-all duration-300 font-medium text-sm whitespace-nowrap px-3 py-1.5 rounded-lg hover:bg-gold/5">
                  FAQ
                </Link>
                <div className="w-px h-5 bg-gold/30" />
                <Link href="/contact" className="text-black hover:text-gold transition-all duration-300 font-medium text-sm whitespace-nowrap px-3 py-1.5 rounded-lg hover:bg-gold/5">
                  Contact
                </Link>
              </div>
            </nav>

            {/* Auth Actions - Right */}
            <div className="relative flex items-center justify-end gap-3">
              {loading ? null : user ? (
                /* Authenticated: show profile icon with dropdown */
                <>
                  <motion.button
                    id="user-menu-button"
                    className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-gold via-gold-light to-amber-200 flex items-center justify-center shadow-lg border-2 border-gold/80 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 transition-all duration-300 hover:shadow-xl hover:shadow-gold/30 hover:scale-110 hover:border-gold active:scale-95 group overflow-hidden flex-shrink-0"
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
                  </motion.div>
                </>
              ) : (
                /* Unauthenticated: show Sign Up and Login CTAs */
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-black hover:text-gold transition-colors duration-200 px-3 py-1.5"
                  >
                    Login
                  </Link>
                  <Link
                    href="/waitlist"
                    className="text-sm font-semibold bg-gold text-black px-4 py-2 rounded-xl hover:bg-gold/90 transition-all duration-200 shadow-md hover:shadow-gold/30 hover:shadow-lg"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.header>
    </motion.div>
  );
}
