import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { checkRateLimit } from "@/lib/security/rateLimiter";

// Waitlist mode - redirect auth pages to waitlist
const WAITLIST_MODE = true;
const WAITLIST_REDIRECT_PATHS = ["/login", "/signup", "/reserve"];

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
  if (pathname.startsWith("/api/")) {
    const identifier = request.ip || request.headers.get("x-forwarded-for") || "unknown";
    const path = request.nextUrl.pathname;

    const rateLimit = checkRateLimit(identifier, path);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many requests. Please try again later.",
          },
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "60",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimit.resetTime.toString(),
            "Retry-After": Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }
  }

  // Update Supabase session
  const response = await updateSession(request);

  // Add rate limit headers to response
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const identifier = request.ip || request.headers.get("x-forwarded-for") || "unknown";
    const path = request.nextUrl.pathname;
    const rateLimit = checkRateLimit(identifier, path);

    response.headers.set("X-RateLimit-Remaining", rateLimit.remaining.toString());
    response.headers.set("X-RateLimit-Reset", rateLimit.resetTime.toString());
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

