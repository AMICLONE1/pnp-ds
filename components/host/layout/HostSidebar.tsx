"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Sun,
  BarChart3,
  Wallet,
  Bell,
  Settings,
  LogOut,
  X,
  Zap,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/host", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/host/plants", icon: Zap, label: "My Plants" },
  { href: "/host/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/host/financials", icon: Wallet, label: "Financials" },
  { href: "/host/alerts", icon: Bell, label: "Alerts", badge: 3 },
  { href: "/host/settings", icon: Settings, label: "Settings" },
];

interface HostSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function HostSidebar({ isOpen, onClose }: HostSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/host/login");
    router.refresh();
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const sidebarContent = (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <Link
          href="/host"
          className="flex items-center gap-3"
          onClick={handleNavClick}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-gold to-amber-500 rounded-xl flex items-center justify-center shadow-sm">
            <Sun className="w-6 h-6 text-forest" />
          </div>
          <div>
            <h1 className="text-black font-bold text-lg font-heading">
              PNP Solar
            </h1>
            <p className="text-gray-500 text-xs">Host Portal</p>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Quick Stats Mini */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="bg-forest/5 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-gray-600">
              All Systems Online
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-forest font-heading">
              1,500
            </span>
            <span className="text-xs text-gray-500">kW capacity</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-4 mb-3">
          Menu
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/host" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link href={item.href} onClick={handleNavClick}>
                  <motion.div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
                      isActive
                        ? "bg-gold/10 text-gold-dark font-semibold border border-gold/20"
                        : "text-gray-600 hover:bg-gray-50 hover:text-black"
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="hostActiveBar"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gold rounded-r-full"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-gold-dark" />
                    )}
                  </motion.div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        <Link href="/host-landing" onClick={handleNavClick}>
          <motion.div
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-black transition-all"
            whileHover={{ x: 4 }}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Host Landing</span>
          </motion.div>
        </Link>
        <motion.button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all w-full"
          whileHover={{ x: 4 }}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </motion.button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block">{sidebarContent}</div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
