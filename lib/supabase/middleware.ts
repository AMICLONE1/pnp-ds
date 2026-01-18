import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
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
            request: {
              headers: request.headers,
            },
          });
          // Use the options provided by Supabase SSR - it handles httpOnly, secure, sameSite correctly
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, {
              ...options,
              // Ensure path is set for session cookies
              path: options?.path || '/',
            });
          });
        },
      },
    }
  );

  // IMPORTANT: Call getSession() to refresh the session if needed
  // This ensures expired tokens are automatically refreshed by Supabase SSR
  // getSession() will automatically refresh the access token if it's expired
  let user = null;
  try {
    // getSession() automatically refreshes expired tokens
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (!sessionError && session?.user) {
      user = session.user;
    } else {
      // Fallback: try getUser() if getSession() fails
      // This might happen if refresh token is also expired
      const { data: { user: userData }, error: userError } = await supabase.auth.getUser();
      if (!userError && userData) {
        user = userData;
      }
    }
  } catch (error) {
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
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

