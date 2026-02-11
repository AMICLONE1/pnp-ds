"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Sun, Loader2, Menu } from "lucide-react";

function AdminSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-gold to-amber-500 rounded-2xl flex items-center justify-center">
          <Sun className="w-8 h-8 text-forest" />
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Verifying admin access...</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("/api/admin/verify");
        const result = await res.json();

        if (!result.success || !result.isAdmin) {
          router.push("/dashboard");
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error("Admin verification failed:", error);
        router.push("/login");
      }
    };

    checkAdmin();
  }, [router]);

  if (isAdmin === null) {
    return <AdminSkeleton />;
  }

  return (
    <div className="min-h-screen flex bg-white">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar with menu toggle */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-gold to-amber-500 rounded-lg flex items-center justify-center">
              <Sun className="w-4 h-4 text-forest" />
            </div>
            <span className="font-bold text-black">PNP Solar</span>
            <span className="text-gray-400 text-xs">Admin</span>
          </div>
        </div>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
