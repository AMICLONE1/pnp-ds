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
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user = null;
  try {
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch (error) {
    // Silently handle auth errors
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

