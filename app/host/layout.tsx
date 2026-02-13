"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HostSidebar } from "@/components/host/layout/HostSidebar";
import { Sun, Loader2, Menu } from "lucide-react";

function HostSkeleton() {
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
          <span>Loading host dashboard...</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHost, setIsHost] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkHost = async () => {
      try {
        const res = await fetch("/api/host/verify");
        const result = await res.json();

        if (!result.success || !result.isHost) {
          // Not a host - redirect based on error type
          if (result.error === "UNAUTHORIZED") {
            router.push("/login");
          } else {
            router.push("/dashboard");
          }
          return;
        }

        setIsHost(true);
      } catch (error) {
        console.error("Host verification failed:", error);
        router.push("/login");
      }
    };

    checkHost();
  }, [router]);

  if (isHost === null) {
    return <HostSkeleton />;
  }

  return (
    <div className="min-h-screen flex bg-white">
      <HostSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
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
            <span className="font-bold text-black font-heading">
              PNP Solar
            </span>
            <span className="text-gray-400 text-xs">Host</span>
          </div>
        </div>

        <main className="flex-1 overflow-auto bg-[#FAFAFA]">{children}</main>
      </div>
    </div>
  );
}
