import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { checkRateLimit } from "@/lib/security/rateLimiter";
import { createServerClient } from "@supabase/ssr";

// Waitlist mode - redirect auth pages to waitlist
const WAITLIST_MODE = false;
const WAITLIST_REDIRECT_PATHS = ["/signup", "/reserve"];

// Routes that require HOST role
const HOST_ROUTES = ["/host"];
const HOST_API_ROUTES = ["/api/host"];

// Routes that require ADMIN role
const ADMIN_ROUTES = ["/admin"];
const ADMIN_API_ROUTES = ["/api/admin"];

// User-only routes that HOST and ADMIN users cannot access
const USER_ONLY_ROUTES = ["/dashboard", "/bills", "/connect"];

// Login pages should be accessible without role checks
const LOGIN_PAGES = ["/login", "/host/login", "/admin/login"];

/**
 * Helper: create a Supabase client for middleware if properly configured.
 * Returns null when Supabase env vars are missing / placeholder.
 */
function createMiddlewareSupabase(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !supabaseUrl ||
    !supabaseKey ||
    supabaseUrl.includes("placeholder") ||
    supabaseKey === "your-anon-key"
  ) {
    return null;
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll() {
        // No-op in middleware read-only context
      },
    },
  });
}

/**
 * Fetches the authenticated user and their role.
 * Returns { user, role } or nulls when not authenticated.
 */
async function getUserAndRole(request: NextRequest) {
  const supabase = createMiddlewareSupabase(request);
  if (!supabase) return { user: null, role: null };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, role: null };

  const { data: userData } = await supabase
    .from("users")
    .select("role, deleted_at")
    .eq("id", user.id)
    .single();

  if (userData?.deleted_at) {
    return { user: null, role: null };
  }

  return { user, role: userData?.role ?? null };
}

export async function proxy(request: NextRequest) {
  // Skip middleware for static files and Next.js internals
  const pathname = request.nextUrl.pathname;
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|js|css|woff|woff2|ttf|eot|ico)$/)
  ) {
    return NextResponse.next();
  }

  // SEO: collapse mixed-case URLs to lowercase via 301. Two distinct URLs
  // (/About and /about) would otherwise split link equity. API routes are
  // exempt — some external callers may already be hitting them with case
  // we don't control.
  if (!pathname.startsWith("/api/") && pathname !== pathname.toLowerCase()) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 301);
  }

  // Waitlist mode: redirect auth/protected pages to waitlist. Match exact
  // paths or any nested route (e.g. /reserve/payment) under a redirect root.
  if (
    WAITLIST_MODE &&
    WAITLIST_REDIRECT_PATHS.some(
      (p) => pathname === p || pathname.startsWith(p + "/")
    )
  ) {
    return NextResponse.redirect(new URL("/waitlist", request.url));
  }

  // Rate limiting for API routes
  let rateLimitResult: { allowed: boolean; remaining: number; resetTime: number } | null = null;
  if (pathname.startsWith("/api/")) {
    const identifier = request.headers.get("x-forwarded-for") || "unknown";
    const path = request.nextUrl.pathname;

    rateLimitResult = checkRateLimit(identifier, path);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "60",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
            "Retry-After": Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }
  }

  // Update Supabase session
  const response = await updateSession(request);

  // ──────────────────────────────────────────────────────────────
  // RBAC: Centralized role-based access control
  // ──────────────────────────────────────────────────────────────

  // Skip RBAC checks for login pages (they must remain accessible)
  const isLoginPage = LOGIN_PAGES.some((p) => pathname === p);
  // Skip verify endpoints to avoid circular dependency
  const isVerifyEndpoint =
    pathname === "/api/host/verify" || pathname === "/api/admin/verify";

  const isHostRoute = HOST_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/')) && !isLoginPage;
  const isHostApiRoute = HOST_API_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/')) && !isVerifyEndpoint;
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/')) && !isLoginPage;
  const isAdminApiRoute = ADMIN_API_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/')) && !isVerifyEndpoint;
  const isUserOnlyRoute = USER_ONLY_ROUTES.some((route) => pathname.startsWith(route));

  const needsRbac = isHostRoute || isHostApiRoute || isAdminRoute || isAdminApiRoute || isUserOnlyRoute;

  if (needsRbac) {
    const { user, role } = await getUserAndRole(request);

    // ── Not authenticated ──
    if (!user) {
      if (isHostApiRoute || isAdminApiRoute) {
        return NextResponse.json(
          { success: false, error: "Authentication required" },
          { status: 401 }
        );
      }
      if (isHostRoute) {
        return NextResponse.redirect(new URL("/host/login", request.url));
      }
      if (isAdminRoute) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      // User-only routes
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // ── HOST route protection ──
    if (isHostRoute || isHostApiRoute) {
      if (role !== "HOST") {
        if (isHostApiRoute) {
          return NextResponse.json(
            { success: false, error: "Host access required" },
            { status: 403 }
          );
        }
        // Redirect non-hosts to their own area
        if (role === "ADMIN") {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // Verify host record is ACTIVE (for page routes, not login)
      const supabase = createMiddlewareSupabase(request);
      if (supabase) {
        const { data: hostData } = await supabase
          .from("hosts")
          .select("id, status")
          .eq("user_id", user.id)
          .single();

        if (!hostData || hostData.status !== "ACTIVE") {
          if (isHostApiRoute) {
            return NextResponse.json(
              { success: false, error: "Host account is not active" },
              { status: 403 }
            );
          }
          return NextResponse.redirect(
            new URL("/host/login?error=host_inactive", request.url)
          );
        }
      }
    }

    // ── ADMIN route protection ──
    if (isAdminRoute || isAdminApiRoute) {
      if (role !== "ADMIN") {
        if (isAdminApiRoute) {
          return NextResponse.json(
            { success: false, error: "Admin access required" },
            { status: 403 }
          );
        }
        // Redirect non-admins to their own area
        if (role === "HOST") {
          return NextResponse.redirect(new URL("/host", request.url));
        }
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    // ── USER-ONLY route protection ──
    if (isUserOnlyRoute) {
      if (role === "HOST") {
        return NextResponse.redirect(new URL("/host", request.url));
      }
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
  }

  // Add rate limit headers to response (reuse result from earlier check)
  if (rateLimitResult) {
    response.headers.set("X-RateLimit-Remaining", rateLimitResult.remaining.toString());
    response.headers.set("X-RateLimit-Reset", rateLimitResult.resetTime.toString());
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js|css|woff|woff2|ttf|eot)$).*)",
  ],
};