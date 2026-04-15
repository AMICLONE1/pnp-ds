import crypto from "crypto";
import { SOLAR_CONSTANTS } from "@/lib/solar-constants";
import { sanitizeEmail, sanitizePhone, sanitizeText } from "@/lib/security/inputSanitizer";

export interface HostProvisionInput {
  businessName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  password?: string;
}

export interface ProvisionedHostAccount {
  authUserId: string;
  hostId: string;
  businessName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  temporaryPassword: string;
}

export function generateTemporaryPassword() {
  return crypto.randomBytes(12).toString("base64url").slice(0, 16);
}

export function buildAgreementNumber(spvId: string, projectName: string) {
  const spvToken = spvId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(-8) || "VEDVYAS";
  const projectToken = projectName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6) || "SOLAR";
  const periodToken = `${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  return `PPA-${periodToken}-${projectToken}-${spvToken}`;
}

export async function provisionHostAccount(
  adminClient: any,
  input: HostProvisionInput,
  verifiedByUserId?: string
): Promise<ProvisionedHostAccount> {
  const businessName = sanitizeText(input.businessName).trim();
  const contactName = sanitizeText(input.contactName).trim();
  const contactEmail = sanitizeEmail(input.contactEmail).trim().toLowerCase();
  const contactPhone = sanitizePhone(input.contactPhone).trim();
  const temporaryPassword = (input.password || generateTemporaryPassword()).trim();

  if (temporaryPassword.length < 12) {
    throw new Error("Initial password must contain at least 12 characters");
  }

  let authUserId: string;
  let userWasNewlyCreated = false;

  // STEP 1: Try to create new auth user
  const { data: createResult, error: authCreateError } = await adminClient.auth.admin.createUser({
    email: contactEmail,
    password: temporaryPassword,
    email_confirm: true,
    user_metadata: {
      role: "HOST",
      business_name: businessName,
      contact_name: contactName,
    },
  });

  // Check the result
  if (createResult?.user?.id) {
    // New user created successfully
    authUserId = createResult.user.id;
    userWasNewlyCreated = true;
  } else if (authCreateError) {
    // User creation failed
    const errorMsg = ((authCreateError as any)?.message || "").toLowerCase();

    if (errorMsg.includes("already exists") || errorMsg.includes("already registered")) {
      // User already exists in auth.users
      // Query public.users to get their ID
      const { data: existingUsers } = await adminClient
        .from("users")
        .select("id")
        .eq("email", contactEmail)
        .limit(1);

      if (existingUsers && existingUsers.length > 0) {
        authUserId = existingUsers[0].id;
        userWasNewlyCreated = false;
      } else {
        // User exists in auth but not in public.users - this is the edge case
        // We'll create the public.users record without trying to create auth user again
        // For now, throw a helpful error
        throw new Error(`Email ${contactEmail} is already registered. Each project needs a unique host email. Please use a different email address.`);
      }
    } else {
      throw new Error(authCreateError.message || "Failed to create authentication user");
    }
  } else {
    throw new Error("Failed to create authentication user");
  }
  const now = new Date().toISOString();

  try {
    // Check if user already exists
    const { data: existingUser } = await adminClient
      .from("users")
      .select("id")
      .eq("id", authUserId)
      .maybeSingle();

    if (existingUser) {
      // User exists, update only non-unique fields to avoid constraint violations
      const { error: updateError } = await adminClient
        .from("users")
        .update({
          name: contactName,
          role: "HOST",
          kyc_status: "VERIFIED",
          updated_at: now,
        })
        .eq("id", authUserId);

      if (updateError) {
        throw updateError;
      }
    } else {
      // User doesn't exist, insert new user with all fields
      const { error: userInsertError } = await adminClient.from("users").insert({
        id: authUserId,
        email: contactEmail,
        name: contactName,
        phone: contactPhone,
        role: "HOST",
        kyc_status: "VERIFIED",
        created_at: now,
        updated_at: now,
      });

      if (userInsertError) {
        throw userInsertError;
      }
    }

    // First check if host already exists for this user
    const { data: existingHost, error: hostCheckError } = await adminClient
      .from("hosts")
      .select("id")
      .eq("user_id", authUserId)
      .maybeSingle();

    let hostRow: any;

    if (existingHost) {
      // Update existing host
      const { data: updated, error: updateError } = await adminClient
        .from("hosts")
        .update({
          business_name: businessName,
          contact_name: contactName,
          contact_email: contactEmail,
          contact_phone: contactPhone,
          status: "ACTIVE",
          verified_at: now,
          verified_by: verifiedByUserId || null,
          updated_at: now,
        })
        .eq("id", existingHost.id)
        .select("id")
        .single();

      if (updateError || !updated) {
        throw updateError || new Error("Failed to update host profile");
      }
      hostRow = updated;
    } else {
      // Create new host
      const { data: created, error: hostInsertError } = await adminClient
        .from("hosts")
        .insert({
          user_id: authUserId,
          business_name: businessName,
          contact_name: contactName,
          contact_email: contactEmail,
          contact_phone: contactPhone,
          status: "ACTIVE",
          verified_at: now,
          verified_by: verifiedByUserId || null,
        })
        .select("id")
        .single();

      if (hostInsertError || !created) {
        throw hostInsertError || new Error("Failed to create host profile");
      }
      hostRow = created;
    }

    return {
      authUserId,
      hostId: hostRow.id,
      businessName,
      contactName,
      contactEmail,
      contactPhone,
      temporaryPassword,
    };
  } catch (error) {
    // Only delete the user if we just created it
    if (userWasNewlyCreated) {
      await adminClient.from("users").delete().eq("id", authUserId);
      await adminClient.auth.admin.deleteUser(authUserId);
    }
    throw error;
  }
}

export async function createCapacityBlocks(
  adminClient: any,
  projectId: string,
  totalKw: number
) {
  const blocks: Array<{ project_id: string; kw: number; status: "AVAILABLE" }> = [];
  let remaining = Number(totalKw) || 0;

  while (remaining > 0) {
    const blockKw = remaining >= 1 ? 1 : Math.round(remaining * 1000) / 1000;
    blocks.push({
      project_id: projectId,
      kw: blockKw,
      status: "AVAILABLE",
    });
    remaining = Math.round((remaining - blockKw) * 1000) / 1000;
  }

  if (blocks.length === 0) {
    return [];
  }

  const { data, error } = await adminClient.from("capacity_blocks").insert(blocks).select("id, project_id, kw, status");

  if (error) {
    throw error;
  }

  return data || [];
}

export async function seedGenerationSnapshots(
  adminClient: any,
  projectId: string,
  totalKw: number,
  validatedBy?: string,
  loggerSerialId?: string
) {
  const monthlyBaseline = Math.round((Number(totalKw) || 0) * SOLAR_CONSTANTS.avgGenerationPerKwPerDay * SOLAR_CONSTANTS.daysPerMonth);
  const factors = [0.95, 0.97, 0.98, 1.0, 1.01, 1.0125];
  const rows = factors.map((factor, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (6 - index));
    return {
      project_id: projectId,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      kwh: Math.round(monthlyBaseline * factor),
      validated: true,
      source: loggerSerialId ? `TRIELLECTICS:${loggerSerialId}` : "TRIELLECTICS_BOOTSTRAP",
      validated_by: validatedBy || null,
      validated_at: new Date().toISOString(),
    };
  });

  const { data, error } = await adminClient.from("generations").insert(rows).select("id, project_id, month, year, kwh, validated, source, validated_by, validated_at");

  if (error) {
    throw error;
  }

  return data || [];
}
