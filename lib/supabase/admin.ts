import { createClient } from "@supabase/supabase-js";

/**
 * Admin client with service role key - bypasses RLS
 * Use this ONLY for server-side operations that need to update data
 * DO NOT expose this to the client side
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL environment variable."
    );
  }

  if (!supabaseServiceRoleKey) {
    console.error(
      "⚠️  SUPABASE_SERVICE_ROLE_KEY is missing! Capacity reservation will fail.\n" +
      "Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local file.\n" +
      "Get it from: Supabase Dashboard → Project Settings → API → service_role key"
    );
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for capacity reservation. " +
      "Please add it to your .env.local file and restart the server."
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

