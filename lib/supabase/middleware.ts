import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Check if Supabase credentials are configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If credentials are not configured or are placeholders, skip auth entirely
  if (!supabaseUrl || !supabaseKey ||
      supabaseUrl.includes('placeholder') ||
      supabaseKey.includes('placeholder') ||
      supabaseUrl === 'your-project-url' ||
      supabaseKey === 'your-anon-key') {
    // Just pass through without any Supabase operations
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            // Preserve Supabase's cookie options, only set path if not already set
            supabaseResponse.cookies.set(name, value, {
              ...options,
              path: options?.path || '/',
            });
          });
        },
      },
    }
  );

  // Use getUser() to validate the session
  // This also refreshes the token if needed
  let user = null;
  try {
    const { data: { user: userData }, error } = await supabase.auth.getUser();
    if (!error && userData) {
      user = userData;
    }
  } catch {
    // Silently handle auth errors - don't break the request
    // This allows public routes to still work
    user = null;
  }

  // Public paths that don't require authentication
  const publicPaths = [
    "/",
    "/login",
    "/signup",
    "/reserve",
    "/forgot-password",
    "/reset-password",
    "/help",
    "/contact",
    "/privacy",
    "/terms",
    "/cookies",
  ];
  const isPublicPath =
    publicPaths.includes(request.nextUrl.pathname) ||
    request.nextUrl.pathname.startsWith("/reserve") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/_next");

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    const redirectResponse = NextResponse.redirect(url);
    // Preserve any cookies that were set during session refresh
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  return supabaseResponse;
}

