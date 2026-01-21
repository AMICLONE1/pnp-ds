import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function createClient() {
  if (client) {
    return client;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your-project-url' || supabaseKey === 'your-anon-key') {
    throw new Error(
      'Supabase credentials not configured. Please update .env.local with your Supabase URL and anon key from https://supabase.com/dashboard/project/_/settings/api'
    );
  }

  // createBrowserClient automatically handles cookies and session management
  client = createBrowserClient(supabaseUrl, supabaseKey);
  return client;
}

