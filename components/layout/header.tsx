"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/features/notifications/NotificationBell";
import { Sun, Menu, X } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

    // Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        return;
      }
      // Clear user state immediately
      setUser(null);
      // Use router to navigate and refresh
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback to window.location if router fails
      window.location.href = "/";
    }
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
          <Link
            href="/contact"
            className="text-sm font-medium text-gray-700 hover:text-forest transition-colors"
          >
            Contact
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
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-forest transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
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

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="container mx-auto px-4 py-4 space-y-3">
            <Link
              href="/reserve"
              className="block text-sm font-medium text-gray-700 hover:text-forest transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Join Projects
            </Link>
            <Link
              href="/contact"
              className="block text-sm font-medium text-gray-700 hover:text-forest transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block text-sm font-medium text-gray-700 hover:text-forest transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/bills"
                  className="block text-sm font-medium text-gray-700 hover:text-forest transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Bills
                </Link>
                <Link
                  href="/settings"
                  className="block text-sm font-medium text-gray-700 hover:text-forest transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-sm font-medium text-gray-700 hover:text-forest transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block text-sm font-medium text-forest hover:text-forest-dark transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

