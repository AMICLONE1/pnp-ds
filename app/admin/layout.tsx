"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Sun, Loader2 } from "lucide-react";

function AdminSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
