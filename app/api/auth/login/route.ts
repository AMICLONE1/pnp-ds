import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/security/rateLimiter";

const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(128),
});

const GENERIC_AUTH_ERROR = "Invalid email or password.";

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/**
 * Server-side login. Wraps Supabase's signInWithPassword behind:
 *   - per-IP rate limit (5 attempts / 15 min)
 *   - per-email rate limit (5 attempts / 15 min)
 *   - generic error message — never leaks whether the email exists
 *   - constant-ish minimum response time to mute timing oracles
 */
export async function POST(request: Request) {
  const start = Date.now();
  const minDuration = 400; // ms — pad short responses to this floor

  const finishWith = async (status: number, body: any) => {
    const elapsed = Date.now() - start;
    if (elapsed < minDuration) {
      await new Promise((r) => setTimeout(r, minDuration - elapsed));
    }
    return NextResponse.json(body, { status });
  };

  try {
    const ip = getClientIp(request);
    const ipLimit = checkRateLimit(ip, "/api/auth/login");
    if (!ipLimit.allowed) {
      return finishWith(429, {
        success: false,
        error: "Too many login attempts. Please try again later.",
      });
    }

    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) {
      return finishWith(400, { success: false, error: GENERIC_AUTH_ERROR });
    }
    const email = parsed.data.email.trim().toLowerCase();
    const password = parsed.data.password;

    // Per-email rate limit (use a distinct path so it has its own bucket).
    const emailLimit = checkRateLimit(`email:${email}`, "/api/auth/login");
    if (!emailLimit.allowed) {
      return finishWith(429, {
        success: false,
        error: "Too many login attempts. Please try again later.",
      });
    }

    const supabase = await createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data?.session) {
      return finishWith(401, { success: false, error: GENERIC_AUTH_ERROR });
    }

    return finishWith(200, {
      success: true,
      data: { user_id: data.user?.id },
    });
  } catch (err) {
    console.error("/api/auth/login error:", err);
    return finishWith(500, { success: false, error: GENERIC_AUTH_ERROR });
  }
}
