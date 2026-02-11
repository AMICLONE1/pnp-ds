import { NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";

interface MonthlyData {
  month: string;
  year: number;
  value: number;
}

/**
 * GET /api/admin/stats
 * Returns admin dashboard statistics
 */
export async function GET() {
  try {
    const authResult = await verifyAdmin();

    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error || "FORBIDDEN");
    }

    const adminClient = createAdminClient();

    // Run all queries in parallel
    const [
      capacityBlocksResult,
      usersResult,
      projectsResult,
      paymentsResult,
      waitlistResult,
      generationsResult,
    ] = await Promise.all([
      // All capacity blocks
      adminClient.from("capacity_blocks").select("kw, status, project_id"),

      // All users
      adminClient.from("users").select("id, created_at, deleted_at"),

      // All projects
      adminClient.from("projects").select("id, name, status, total_kw"),

      // All completed payments
      adminClient.from("payments").select("amount, created_at, status"),

      // Waitlist count
      adminClient.from("waitlist").select("id", { count: "exact", head: true }),

      // Energy generations
      adminClient.from("generations").select("month, year, kwh, validated"),
    ]);

    // Process capacity data
    const allBlocks = capacityBlocksResult.data || [];
    const totalCapacity = allBlocks.reduce((sum, b) => sum + Number(b.kw), 0);
    const allocatedBlocks = allBlocks.filter(b => b.status === "ALLOCATED");
    const totalDeployedCapacity = allocatedBlocks.reduce((sum, b) => sum + Number(b.kw), 0);
    const capacityUtilization = totalCapacity > 0
      ? (totalDeployedCapacity / totalCapacity) * 100
      : 0;

    // Process users data
    const allUsers = usersResult.data || [];
    const activeUsers = allUsers.filter(u => !u.deleted_at).length;

    // Process user growth by month
    const userGrowthByMonth = processUserGrowth(allUsers);

    // Process projects data
    const allProjects = projectsResult.data || [];
    const activeProjects = allProjects.filter(p => p.status === "ACTIVE").length;

    // Process capacity by project for pie chart
    const capacityByProject = processCapacityByProject(allBlocks, allProjects);

    // Process payments data
    const allPayments = paymentsResult.data || [];
    const completedPayments = allPayments.filter(p => p.status === "COMPLETED");
    const totalRevenue = completedPayments.reduce((sum, p) => sum + Number(p.amount), 0);

    // Process revenue by month
    const revenueByMonth = processRevenueByMonth(completedPayments);

    // Process generation data
    const generations = generationsResult.data || [];
    const validatedGenerations = generations.filter(g => g.validated);
    const generationByMonth = processGenerationByMonth(validatedGenerations);

    return NextResponse.json({
      success: true,
      data: {
        // Overview stats
        totalDeployedCapacity,
        totalCapacity,
        capacityUtilization: Math.round(capacityUtilization * 10) / 10,
        activeUsers,
        activeProjects,
        totalRevenue,
        waitlistCount: waitlistResult.count || 0,

        // Chart data
        revenueByMonth,
        userGrowthByMonth,
        generationByMonth,
        capacityByProject,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}

function processUserGrowth(users: { created_at: string; deleted_at: string | null }[]): MonthlyData[] {
  const monthlyMap = new Map<string, number>();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  users
    .filter(u => !u.deleted_at)
    .forEach(user => {
      const date = new Date(user.created_at);
      const key = `${months[date.getMonth()]}-${date.getFullYear()}`;
      monthlyMap.set(key, (monthlyMap.get(key) || 0) + 1);
    });

  // Convert to sorted array (last 12 months)
  const result: MonthlyData[] = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${months[date.getMonth()]}-${date.getFullYear()}`;
    result.push({
      month: months[date.getMonth()],
      year: date.getFullYear(),
      value: monthlyMap.get(key) || 0,
    });
  }

  // Make cumulative
  let cumulative = 0;
  return result.map(item => {
    cumulative += item.value;
    return { ...item, value: cumulative };
  });
}

function processRevenueByMonth(payments: { amount: number; created_at: string }[]): MonthlyData[] {
  const monthlyMap = new Map<string, number>();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  payments.forEach(payment => {
    const date = new Date(payment.created_at);
    const key = `${months[date.getMonth()]}-${date.getFullYear()}`;
    monthlyMap.set(key, (monthlyMap.get(key) || 0) + Number(payment.amount));
  });

  // Convert to sorted array (last 12 months)
  const result: MonthlyData[] = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${months[date.getMonth()]}-${date.getFullYear()}`;
    result.push({
      month: months[date.getMonth()],
      year: date.getFullYear(),
      value: monthlyMap.get(key) || 0,
    });
  }

  return result;
}

function processGenerationByMonth(generations: { month: number; year: number; kwh: number }[]): MonthlyData[] {
  const monthlyMap = new Map<string, number>();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  generations.forEach(gen => {
    const key = `${gen.month}-${gen.year}`;
    monthlyMap.set(key, (monthlyMap.get(key) || 0) + Number(gen.kwh));
  });

  // Convert to sorted array (last 12 months)
  const result: MonthlyData[] = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getMonth() + 1}-${date.getFullYear()}`;
    result.push({
      month: months[date.getMonth()],
      year: date.getFullYear(),
      value: monthlyMap.get(key) || 0,
    });
  }

  return result;
}

function processCapacityByProject(
  blocks: { kw: number; status: string; project_id: string }[],
  projects: { id: string; name: string }[]
): { name: string; value: number }[] {
  const projectMap = new Map<string, string>();
  projects.forEach(p => projectMap.set(p.id, p.name));

  const capacityMap = new Map<string, number>();

  blocks
    .filter(b => b.status === "ALLOCATED")
    .forEach(block => {
      const name = projectMap.get(block.project_id) || "Unknown";
      capacityMap.set(name, (capacityMap.get(name) || 0) + Number(block.kw));
    });

  return Array.from(capacityMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}
