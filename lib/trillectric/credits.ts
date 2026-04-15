// ============================================
// Credit Distribution Logic
// Distributes generation-based credits to users
// based on their proportional capacity allocation
// in each project.
// ============================================

import type { SupabaseClient } from "@supabase/supabase-js";
import { SOLAR_CONSTANTS } from "@/lib/solar-constants";

export interface CreditDistributionResult {
  projectId: string;
  month: number;
  year: number;
  totalKwh: number;
  totalProjectKw: number;
  creditsCreated: number;
  creditsUpdated: number;
  totalAmountDistributed: number;
  skipped?: string;
}

/**
 * Distribute generation credits to all users who have allocations
 * on a given project for the specified billing month.
 *
 * Algorithm:
 *   user_share_kwh = (user_capacity_kw / project_total_kw) * total_monthly_kwh
 *   credit_amount  = user_share_kwh * creditRatePerUnit (Rs.7/kWh)
 *
 * Credits are upserted — running this repeatedly updates amounts as
 * more generation data comes in during the month (idempotent).
 */
export async function distributeCredits(
  adminClient: SupabaseClient,
  projectId: string,
  month: number,
  year: number
): Promise<CreditDistributionResult> {
  const result: CreditDistributionResult = {
    projectId,
    month,
    year,
    totalKwh: 0,
    totalProjectKw: 0,
    creditsCreated: 0,
    creditsUpdated: 0,
    totalAmountDistributed: 0,
  };

  // 1. Get the generation row for this project/period
  const { data: genRow, error: genError } = await adminClient
    .from("generations")
    .select("id, kwh")
    .eq("project_id", projectId)
    .eq("month", month)
    .eq("year", year)
    .maybeSingle();

  if (genError) {
    throw new Error(`Failed to fetch generation: ${genError.message}`);
  }

  if (!genRow || !genRow.kwh || Number(genRow.kwh) <= 0) {
    result.skipped = "No generation data for period";
    return result;
  }

  const totalKwh = Number(genRow.kwh);
  const generationId = genRow.id as string;
  result.totalKwh = totalKwh;

  // 2. Get project total capacity
  const { data: project, error: projectError } = await adminClient
    .from("projects")
    .select("id, name, total_kw")
    .eq("id", projectId)
    .single();

  if (projectError || !project) {
    throw new Error(
      `Failed to fetch project: ${projectError?.message ?? "not found"}`
    );
  }

  const totalProjectKw = Number(project.total_kw);
  result.totalProjectKw = totalProjectKw;

  if (!totalProjectKw || totalProjectKw <= 0) {
    result.skipped = "Project has no capacity";
    return result;
  }

  // 3. Get all ALLOCATED capacity blocks for this project and their allocations
  const { data: blocks, error: blocksError } = await adminClient
    .from("capacity_blocks")
    .select("id")
    .eq("project_id", projectId)
    .eq("status", "ALLOCATED");

  if (blocksError) {
    throw new Error(
      `Failed to fetch capacity blocks: ${blocksError.message}`
    );
  }

  if (!blocks || blocks.length === 0) {
    result.skipped = "No allocated capacity blocks";
    return result;
  }

  const blockIds = blocks.map((b) => b.id as string);

  const { data: allocations, error: allocError } = await adminClient
    .from("allocations")
    .select("id, user_id, capacity_kw, capacity_block_id")
    .in("capacity_block_id", blockIds);

  if (allocError) {
    throw new Error(`Failed to fetch allocations: ${allocError.message}`);
  }

  if (!allocations || allocations.length === 0) {
    result.skipped = "No user allocations found";
    return result;
  }

  // 4. Aggregate capacity per user (a user may have multiple blocks)
  const userCapacity = new Map<string, number>();
  for (const alloc of allocations) {
    const userId = alloc.user_id as string;
    const kw = Number(alloc.capacity_kw) || 0;
    userCapacity.set(userId, (userCapacity.get(userId) ?? 0) + kw);
  }

  // 5. For each user, compute share and upsert credit ledger entry
  for (const [userId, userKw] of userCapacity.entries()) {
    const userShareKwh = (userKw / totalProjectKw) * totalKwh;
    const creditAmount =
      Math.round(userShareKwh * SOLAR_CONSTANTS.creditRatePerUnit * 100) / 100;

    if (creditAmount <= 0) continue;

    // Check for existing GENERATION credit for this user/period/project
    const { data: existing, error: existingError } = await adminClient
      .from("credit_ledgers")
      .select("id, amount")
      .eq("user_id", userId)
      .eq("month", month)
      .eq("year", year)
      .eq("type", "GENERATION")
      .eq("ref_type", "GENERATION")
      .eq("ref_id", generationId)
      .maybeSingle();

    if (existingError) {
      console.error(
        `[credits] existing lookup failed for user ${userId}:`,
        existingError.message
      );
      continue;
    }

    const description = `Solar credit: ${userShareKwh.toFixed(2)} kWh @ Rs.${SOLAR_CONSTANTS.creditRatePerUnit}/unit from ${project.name}`;

    if (existing) {
      // Update only if amount has changed
      if (Math.abs(Number(existing.amount) - creditAmount) > 0.01) {
        const { error: updateError } = await adminClient
          .from("credit_ledgers")
          .update({
            amount: creditAmount,
            description,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (updateError) {
          console.error(
            `[credits] update failed for user ${userId}:`,
            updateError.message
          );
          continue;
        }
        result.creditsUpdated += 1;
      }
    } else {
      const { error: insertError } = await adminClient
        .from("credit_ledgers")
        .insert({
          user_id: userId,
          amount: creditAmount,
          type: "GENERATION",
          status: "PENDING",
          month,
          year,
          ref_id: generationId,
          ref_type: "GENERATION",
          description,
        });

      if (insertError) {
        console.error(
          `[credits] insert failed for user ${userId}:`,
          insertError.message
        );
        continue;
      }
      result.creditsCreated += 1;
    }

    result.totalAmountDistributed += creditAmount;
  }

  result.totalAmountDistributed =
    Math.round(result.totalAmountDistributed * 100) / 100;

  return result;
}
