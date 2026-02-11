"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Wallet,
  Zap,
  ListChecks,
  Settings,
  LogOut,
  Sun,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/projects", icon: FolderKanban, label: "Projects" },
  { href: "/admin/payments", icon: Wallet, label: "Payments" },
  { href: "/admin/generations", icon: Zap, label: "Generations" },
  { href: "/admin/waitlist", icon: ListChecks, label: "Waitlist" },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleNavClick = () => {
    // Close sidebar on mobile after navigation
    if (onClose) onClose();
  };

  const sidebarContent = (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3" onClick={handleNavClick}>
          <div className="w-10 h-10 bg-gradient-to-br from-gold to-amber-500 rounded-xl flex items-center justify-center">
            <Sun className="w-6 h-6 text-forest" />
          </div>
          <div>
            <h1 className="text-black font-bold text-lg">PNP Solar</h1>
            <p className="text-gray-500 text-xs">Admin Panel</p>
          </div>
        </Link>
        {/* Close button - visible only on mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link href={item.href} onClick={handleNavClick}>
                  <motion.div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                        ? "bg-gold/10 text-gold-dark font-semibold border border-gold/20"
                        : "text-gray-600 hover:bg-gray-100 hover:text-black"
                      }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 bg-gold rounded-full"
                      />
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
        <Link href="/dashboard" onClick={handleNavClick}>
          <motion.div
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-black transition-all"
            whileHover={{ x: 4 }}
          >
            <Settings className="w-5 h-5" />
            <span>User Dashboard</span>
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
      {/* Desktop sidebar - always visible on lg+ */}
      <div className="hidden lg:block">
        {sidebarContent}
      </div>

      {/* Mobile sidebar - overlay with animation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={onClose}
            />
            {/* Sidebar panel */}
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
