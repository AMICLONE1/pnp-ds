"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/features/notifications/NotificationBell";
import { Sun } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        // Silently fail during SSR/build
        console.error("Error getting user:", error);
      }
    };
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const isPublicPage = pathname === "/" || pathname.startsWith("/reserve");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Sun className="h-6 w-6 text-gold" />
          <span className="text-xl font-heading font-bold text-forest">
            PowerNetPro
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/reserve"
            className="text-sm font-medium text-gray-700 hover:text-forest transition-colors"
          >
            Join Projects
          </Link>
          {user && (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-forest transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/bills"
                className="text-sm font-medium text-gray-700 hover:text-forest transition-colors"
              >
                Bills
              </Link>
              <Link
                href="/settings"
                className="text-sm font-medium text-gray-700 hover:text-forest transition-colors"
              >
                Settings
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <NotificationBell />
              <span className="hidden sm:inline text-sm text-gray-600">
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

