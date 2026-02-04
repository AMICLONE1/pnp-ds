"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-forest min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gold to-amber-500 rounded-xl flex items-center justify-center">
            <Sun className="w-6 h-6 text-forest" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">PNP Solar</h1>
            <p className="text-white/60 text-xs">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <motion.div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-gold text-forest font-semibold"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 bg-forest rounded-full"
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
      <div className="p-4 border-t border-white/10 space-y-1">
        <Link href="/dashboard">
          <motion.div
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all"
            whileHover={{ x: 4 }}
          >
            <Settings className="w-5 h-5" />
            <span>User Dashboard</span>
          </motion.div>
        </Link>
        <motion.button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all w-full"
          whileHover={{ x: 4 }}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </motion.button>
      </div>
    </aside>
  );
}
