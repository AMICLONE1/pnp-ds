"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/features/notifications/NotificationBell";
import { Sun, Menu, X, ChevronDown, ArrowRight, Zap, Mail } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}

const publicNavItems: NavItem[] = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Benefits", href: "/#benefits" },
  { label: "Contact", href: "/contact" },
];

const privateNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Projects", href: "/reserve" },
  { label: "Bills", href: "/bills" },
  { label: "Settings", href: "/settings" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);

  // Pages with dark hero sections that need transparent header with white text
  const darkHeroPages = ['/', '/reserve'];
  const hasDarkHero = darkHeroPages.includes(pathname);
  
  // Force solid header on light background pages
  const needsSolidHeader = !hasDarkHero || isScrolled;

  const { scrollY } = useScroll();
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
    setIsScrolled(latest > 50);
  });

  useEffect(() => {
    // Initialize Supabase client
    try {
      const client = createClient();
      setSupabase(client);
    } catch (error) {
      console.warn("Supabase not configured:", error);
      return;
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;

    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error getting user:", error);
      }
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      // Only update user state for actual auth changes, not initial session
      // SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, USER_UPDATED are the events we care about
      if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        setUser(session?.user ?? null);
      }
      // Ignore INITIAL_SESSION to prevent flickering during navigation
    });

    return () => subscription?.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    if (!supabase) {
      setUser(null);
      router.push("/");
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        return;
      }
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/";
    }
  };

  const navItems = user ? privateNavItems : publicNavItems;

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isHidden ? -100 : 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          needsSolidHeader 
            ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-100" 
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-3 group"
              data-cursor-hover
            >
              <motion.div
                className={cn(
                  "relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300",
                  needsSolidHeader ? "bg-white" : "bg-white/10 backdrop-blur-md"
                )}
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sun className="h-5 w-5 text-gold" />
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gold/20"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.2, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              <span className={cn(
                "text-xl font-heading font-bold transition-colors duration-300",
                "text-black"
              )}>
                PowerNet<span className="text-gold">Pro</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                      "text-black hover:text-gold hover:bg-gray-100",
                      pathname === item.href && "bg-gray-100 text-gold"
                    )}
                    data-cursor-hover
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform duration-300",
                        activeDropdown === item.label && "rotate-180"
                      )} />
                    )}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {item.children && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 overflow-hidden"
                      >
                        <div className="p-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                              data-cursor-hover
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                                  <Zap className="w-5 h-5 text-black group-hover:text-black" />
                                </div>
                                <div>
                                  <div className="font-medium text-black group-hover:text-black transition-colors">
                                    {child.label}
                                  </div>
                                  {child.description && (
                                    <div className="text-sm text-gray-500">
                                      {child.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <NotificationBell />
                  <motion.div 
                    className={cn(
                      "hidden md:flex items-center gap-2.5 px-4 py-2 rounded-full text-sm",
                      "bg-gradient-to-r from-gold/10 via-amber-50/30 to-gold/10",
                      "border border-gold/20 shadow-sm",
                      "hover:shadow-md hover:border-gold/40 hover:from-gold/15 hover:to-gold/15",
                      "transition-all duration-300 group cursor-default"
                    )}
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    title={user.email}
                  >
                    {/* Enhanced status indicator */}
                    <div className="relative flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />
                      <motion.div
                        className="absolute inset-0 rounded-full bg-green-500"
                        animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      />
                    </div>
                    {/* Email icon */}
                    <Mail className="w-3.5 h-3.5 text-gold opacity-70 group-hover:opacity-100 transition-opacity" />
                    {/* Email text */}
                    <span className="max-w-36 truncate font-medium text-black group-hover:text-gold transition-colors">
                      {user.email}
                    </span>
                  </motion.div>
                  <Button 
                    variant={needsSolidHeader ? "outline" : "ghost"} 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-black border-gray-300 hover:bg-gray-100"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden sm:inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-black hover:bg-gray-100 rounded-full transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/waitlist"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold bg-gold hover:bg-gold-light text-black rounded-full shadow-lg shadow-gold/20 transition-colors group"
                  >
                    Join Waitlist
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(
                  "lg:hidden p-2 rounded-lg transition-colors",
                  needsSolidHeader 
                    ? "text-black hover:bg-gray-100" 
                    : "text-white hover:bg-white/10"
                )}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 lg:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                    <Sun className="h-6 w-6 text-gold" />
                    <span className="text-xl font-heading font-bold text-black">
                      PowerNet<span className="text-gold">Pro</span>
                    </span>
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-6 w-6 text-black" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-4">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between py-4 px-4 rounded-xl text-lg font-medium transition-colors",
                          pathname === item.href
                            ? "bg-white/10 text-black"
                            : "text-black hover:bg-gray-50"
                        )}
                      >
                        {item.label}
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </Link>
                      {item.children && (
                        <div className="ml-4 mt-2 mb-4 space-y-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block py-2 px-4 text-black hover:text-black transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </nav>

                {/* Bottom Actions */}
                <div className="p-6 border-t border-gray-100 space-y-3">
                  {user ? (
                    <>
                      <div className="flex items-center gap-2 text-sm text-black mb-4">
                        <div className="w-2 h-2 rounded-full bg-white" />
                        {user.email}
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full inline-flex items-center justify-center px-4 py-2 text-base font-medium border-2 border-gray-300 text-black hover:bg-gray-100 rounded-full transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        href="/waitlist"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full inline-flex items-center justify-center px-4 py-2 text-base font-medium bg-gold hover:bg-gold-light text-black rounded-full transition-colors"
                      >
                        Join Waitlist
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

