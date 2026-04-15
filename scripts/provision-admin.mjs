import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const contents = fs.readFileSync(filePath, "utf8");
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) {
      continue;
    }

    const [, key, rawValue] = match;
    let value = rawValue.trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function pickEnv(...keys) {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) {
      return value;
    }
  }

  return "";
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

loadEnvFile(path.join(process.cwd(), ".env.local"));
loadEnvFile(path.join(process.cwd(), ".env"));

const supabaseUrl = pickEnv("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey = pickEnv("SUPABASE_SERVICE_ROLE_KEY");
const adminEmail = pickEnv("NEXT_PUBLIC_ADMIN_LOGIN_EMAIL").toLowerCase();
const adminPassword = pickEnv("ADMIN_INITIAL_PASSWORD", "ADMIN_LOGIN_PASSWORD");
const displayName = pickEnv("ADMIN_DISPLAY_NAME", "ADMIN_NAME") || "Admin";

const missing = [];
if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
if (!serviceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
if (!adminEmail) missing.push("NEXT_PUBLIC_ADMIN_LOGIN_EMAIL");
if (!adminPassword) missing.push("ADMIN_INITIAL_PASSWORD");

if (missing.length > 0) {
  fail(
    `Missing required environment variables: ${missing.join(", ")}\n` +
      "Set them in .env.local, then run npm run admin:provision again."
  );
}

if (adminPassword.length < 12) {
  fail("ADMIN_INITIAL_PASSWORD must be at least 12 characters long.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function findAuthUserByEmail(email) {
  const perPage = 100;

  for (let page = 1; page < 100; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) {
      throw error;
    }

    const users = data?.users || [];
    const match = users.find((user) => (user.email || "").trim().toLowerCase() === email);
    if (match) {
      return match;
    }

    if (users.length < perPage) {
      return null;
    }
  }

  return null;
}

async function syncProfileRow(userId) {
  const now = new Date().toISOString();
  const profileData = {
    email: adminEmail,
    name: displayName,
    role: "ADMIN",
    kyc_status: "VERIFIED",
    deleted_at: null,
    updated_at: now,
  };

  const { data: existingProfile, error: selectError } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (selectError) {
    throw selectError;
  }

  if (existingProfile) {
    const { error: updateError } = await supabase
      .from("users")
      .update(profileData)
      .eq("id", userId);

    if (updateError) {
      throw updateError;
    }

    return "updated";
  }

  const { error: insertError } = await supabase.from("users").insert({
    id: userId,
    ...profileData,
    created_at: now,
  });

  if (insertError) {
    throw insertError;
  }

  return "created";
}

async function main() {
  const existingUser = await findAuthUserByEmail(adminEmail);
  const authPayload = {
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: {
      role: "ADMIN",
      display_name: displayName,
    },
  };

  let authUser;
  let authAction;
  let createdNewAuthUser = false;

  if (existingUser) {
    const { data, error } = await supabase.auth.admin.updateUserById(existingUser.id, authPayload);
    if (error || !data.user) {
      throw error || new Error("Failed to update existing admin auth user");
    }

    authUser = data.user;
    authAction = "updated";
  } else {
    const { data, error } = await supabase.auth.admin.createUser(authPayload);
    if (error || !data.user) {
      throw error || new Error("Failed to create admin auth user");
    }

    authUser = data.user;
    authAction = "created";
    createdNewAuthUser = true;
  }

  try {
    const profileAction = await syncProfileRow(authUser.id);

    console.log(`Admin auth user ${authAction}: ${adminEmail}`);
    console.log(`public.users row ${profileAction}: ${authUser.id}`);
    console.log("Admin provisioning completed successfully.");
  } catch (error) {
    if (createdNewAuthUser) {
      await supabase.auth.admin.deleteUser(authUser.id).catch(() => null);
    }

    throw error;
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Admin provisioning failed: ${message}`);
  process.exit(1);
});