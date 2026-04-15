"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { CommandPalette } from "@/components/admin/shared/CommandPalette";
import { Sun, Menu } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Login page renders without the sidebar layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
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

      <CommandPalette />
    </div>
  );
}

