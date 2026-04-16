"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/host", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/host/plants", icon: Zap, label: "My Plants" },
  { href: "/host/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/host/financials", icon: Wallet, label: "Financials" },
  { href: "/host/alerts", icon: Bell, label: "Alerts" },
  { href: "/host/settings", icon: Settings, label: "Settings" },
];

interface HostSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function HostSidebar({ isOpen, onClose }: HostSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [totalCapacityKw, setTotalCapacityKw] = useState<number | null>(null);
  const [onlinePlants, setOnlinePlants] = useState(0);
  const [totalPlants, setTotalPlants] = useState(0);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [plantsRes, alertsRes] = await Promise.all([
          fetch("/api/host/plants", { credentials: "include" }),
          fetch("/api/host/alerts", { credentials: "include" }),
        ]);
        const plantsJson = await plantsRes.json();
        const alertsJson = await alertsRes.json();
        if (cancelled) return;
        if (plantsJson.success) {
          setTotalCapacityKw(plantsJson.data.fleet.totalCapacityKw);
          setOnlinePlants(plantsJson.data.fleet.onlinePlants);
          setTotalPlants(plantsJson.data.fleet.totalPlants);
        }
        if (alertsJson.success) {
          const active = (alertsJson.data.alerts || []).filter(
            (a: { status: string }) => a.status === "ACTIVE"
          );
          setAlertCount(active.length);
        }
      } catch {
        // silent
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
    <aside className="w-[260px] bg-gradient-to-b from-[#0a1f14] via-[#0d2818] to-[#112e1e] min-h-screen flex flex-col shrink-0 shadow-xl">
      {/* Logo */}
      <div className="p-5 pb-4 flex items-center justify-between">
        <Link
          href="/host"
          className="flex items-center gap-3"
          onClick={handleNavClick}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-gold to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-gold/20">
            <Sun className="w-5 h-5 text-forest" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base font-heading tracking-tight">
              PNP Solar
            </h1>
            <p className="text-white/40 text-[11px] font-medium tracking-wide uppercase">
              Host Portal
            </p>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="px-4 pb-4">
        <div className="rounded-xl bg-white/[0.06] border border-white/[0.08] p-3.5">
          <div className="flex items-center gap-2 mb-2">
            <div className="relative">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-75" />
            </div>
            <span className="text-[11px] font-medium text-white/50 uppercase tracking-wider">
              {totalPlants === 0
                ? "No plants yet"
                : `${onlinePlants}/${totalPlants} Online`}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-white font-heading">
              {totalCapacityKw == null
                ? "—"
                : totalCapacityKw.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-white/35 font-medium">kW fleet</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <p className="text-[10px] font-semibold text-white/25 uppercase tracking-[0.2em] px-3 mb-2">
          Navigation
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/host" && pathname.startsWith(item.href));

            const badge =
              item.label === "Alerts" && alertCount > 0 ? alertCount : null;

            return (
              <li key={item.href}>
                <Link href={item.href} onClick={handleNavClick}>
                  <motion.div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group ${
                      isActive
                        ? "bg-gold/15 text-gold"
                        : "text-white/50 hover:text-white/90 hover:bg-white/[0.06]"
                    }`}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="hostActiveBar"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gold rounded-r-full"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                    <item.icon
                      className={`w-[18px] h-[18px] ${
                        isActive ? "text-gold" : "text-white/40 group-hover:text-white/70"
                      }`}
                    />
                    <span
                      className={`flex-1 text-[13px] font-medium ${
                        isActive ? "text-gold font-semibold" : ""
                      }`}
                    >
                      {item.label}
                    </span>
                    {badge !== null && (
                      <span className="min-w-[18px] h-[18px] px-1 bg-red-500/90 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm shadow-red-500/30">
                        {badge}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-gold/60" />
                    )}
                  </motion.div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Bottom */}
      <div className="p-3 space-y-0.5">
        <Link href="/host-landing" onClick={handleNavClick}>
          <motion.div
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:bg-white/[0.06] hover:text-white/70 transition-all group"
            whileHover={{ x: 2 }}
          >
            <ExternalLink className="w-[18px] h-[18px]" />
            <span className="text-[13px] font-medium">Host Landing</span>
          </motion.div>
        </Link>
        <motion.button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all w-full group"
          whileHover={{ x: 2 }}
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span className="text-[13px] font-medium">Logout</span>
        </motion.button>
      </div>

      {/* Branding footer */}
      <div className="px-4 py-3 border-t border-white/[0.05]">
        <p className="text-[10px] text-white/20 text-center">
          PowerNetPro Pvt. Ltd.
        </p>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block">{sidebarContent}</div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
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
