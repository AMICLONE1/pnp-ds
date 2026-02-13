import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { checkRateLimit } from "@/lib/security/rateLimiter";
import { createServerClient } from "@supabase/ssr";

// Waitlist mode - redirect auth pages to waitlist
const WAITLIST_MODE = true;
const WAITLIST_REDIRECT_PATHS = ["/signup"];

// Routes that require HOST role
const HOST_ROUTES = ["/host"];
const HOST_API_ROUTES = ["/api/host"];

// User-only routes that HOST users cannot access
const USER_ONLY_ROUTES = ["/dashboard", "/bills", "/reserve", "/connect"];

export async function middleware(request: NextRequest) {
  // Skip middleware for static files and Next.js internals
  const pathname = request.nextUrl.pathname;
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|js|css|woff|woff2|ttf|eot|ico)$/)
  ) {
    return NextResponse.next();
  }

  // Waitlist mode: redirect auth/protected pages to waitlist
  if (WAITLIST_MODE && WAITLIST_REDIRECT_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/waitlist", request.url));
  }

  // Rate limiting for API routes
  let rateLimitResult: { allowed: boolean; remaining: number; resetTime: number } | null = null;
  if (pathname.startsWith("/api/")) {
    const identifier = request.ip || request.headers.get("x-forwarded-for") || "unknown";
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

  // Host route protection: verify HOST role for /host/* and /api/host/* routes
  // Skip the verify endpoint itself to avoid circular dependency
  const isHostRoute = HOST_ROUTES.some((route) => pathname.startsWith(route));
  const isHostApiRoute = HOST_API_ROUTES.some((route) => pathname.startsWith(route));
  const isVerifyEndpoint = pathname === "/api/host/verify";

  if ((isHostRoute || isHostApiRoute) && !isVerifyEndpoint) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Only enforce host auth when Supabase is properly configured
    if (
      supabaseUrl &&
      supabaseKey &&
      !supabaseUrl.includes("placeholder") &&
      supabaseKey !== "your-anon-key"
    ) {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {
            // No-op in middleware read-only context
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (isHostApiRoute) {
          return NextResponse.json(
            { success: false, error: "Authentication required" },
            { status: 401 }
          );
        }
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // Check user role is HOST
      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!userData || userData.role !== "HOST") {
        if (isHostApiRoute) {
          return NextResponse.json(
            { success: false, error: "Host access required" },
            { status: 403 }
          );
        }
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // Check host record is active
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
          new URL("/login?error=host_inactive", request.url)
        );
      }

    }
  }

  // Block HOST users from accessing user-only routes
  const isUserOnlyRoute = USER_ONLY_ROUTES.some((route) => pathname.startsWith(route));

  if (isUserOnlyRoute) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (
      supabaseUrl &&
      supabaseKey &&
      !supabaseUrl.includes("placeholder") &&
      supabaseKey !== "your-anon-key"
    ) {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {
            // No-op in middleware read-only context
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        if (userData?.role === "HOST") {
          return NextResponse.redirect(new URL("/host", request.url));
        }
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

