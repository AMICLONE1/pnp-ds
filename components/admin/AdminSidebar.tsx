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
  LogOut,
  IndianRupee,
  X,
  Building2,
  Link2,
  Search,
  Receipt,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface NavGroup {
  label: string;
  items: { href: string; icon: any; label: string }[];
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", icon: LayoutDashboard, label: "Dashboard" }],
  },
  {
    label: "People",
    items: [
      { href: "/admin/users", icon: Users, label: "Users" },
      { href: "/admin/hosts", icon: Building2, label: "Hosts" },
      { href: "/admin/waitlist", icon: ListChecks, label: "Waitlist" },
    ],
  },
  {
    label: "Assets",
    items: [
      { href: "/admin/projects", icon: FolderKanban, label: "Plants" },
      { href: "/admin/allocations", icon: Link2, label: "Allocations" },
      { href: "/admin/generations", icon: Zap, label: "Generations" },
    ],
  },
  {
    label: "Finance",
    items: [
      { href: "/admin/payments", icon: Wallet, label: "Payments" },
      { href: "/admin/bills", icon: Receipt, label: "Bill Reviews" },
      { href: "/admin/credits", icon: IndianRupee, label: "Credits" },
    ],
  },
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
    router.replace("/admin/login");
    router.refresh();
  };

  const handleNavClick = () => {
    // Close sidebar on mobile after navigation
    if (onClose) onClose();
  };

  const sidebarContent = (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col shrink-">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3" onClick={handleNavClick}>
          <div className="w-10 h-10 bg-gradient-to-br from-[#0D2818] to-[#1a4a2e] rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h1 className="text-black font-bold text-lg">PowerNetPro</h1>
            <p className="text-gray-500 text-xs font-medium">ADMIN CONSOLE</p>
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

      {/* Command palette trigger */}
      <div className="px-4 pt-4">
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent("admin:open-command-palette"));
            handleNavClick();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-sm text-gray-500 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span className="flex-1 text-left">Quick search...</span>
          <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono text-gray-500">⌘K</kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {group.label}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <li key={item.href}>
                    <Link href={item.href} onClick={handleNavClick}>
                      <motion.div
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${isActive
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
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-gray-200 space-y-1">
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
