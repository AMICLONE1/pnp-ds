import { NextResponse } from "next/server";
import { verifyHost, hostUnauthorizedResponse } from "@/lib/host/hostAuth";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  HOST_BILLING_FALLBACK,
  calculateHostBillingSummary,
  HostBillingSummary,
} from "@/lib/host/billing";

export const dynamic = "force-dynamic";

function sumKwh(rows: Array<{ kwh: string | number }>) {
  return rows.reduce((total, row) => total + Number(row.kwh || 0), 0);
}

// The "billed period" is the previous complete calendar month. Its invoice is
// issued on the 1st of the current month and payable until `payment_due_day`
// of the current month. If today is before `payment_due_day`, it's PENDING.
// After, it becomes OVERDUE. If the PPA started in the current month, there is
// no billed period yet — show an accumulating preview for the current month.
function previousMonth(year: number, month: number) {
  if (month === 1) return { year: year - 1, month: 12 };
  return { year, month: month - 1 };
}

export async function GET() {
  try {
    const authResult = await verifyHost();
    if (!authResult.authorized || !authResult.host) {
      return hostUnauthorizedResponse(authResult.error || "UNAUTHORIZED");
    }

    const adminClient = createAdminClient();

    const { data: ppaRows, error: ppaError } = await adminClient
      .from("ppa_agreements")
      .select(
        "id, project_id, agreement_number, rate_per_kwh, payment_due_day, late_fee_percent, minimum_guarantee_kwh, start_date"
      )
      .eq("host_id", authResult.host.id)
      .eq("status", "ACTIVE")
      .order("created_at", { ascending: false });

    const activePpa = ppaRows?.[0];
    if (ppaError || !activePpa) {
      return NextResponse.json({
        success: true,
        isLiveData: false,
        data: HOST_BILLING_FALLBACK,
        message: "No active PPA found yet.",
      });
    }

    const { data: projectData, error: projectError } = await adminClient
      .from("projects")
      .select("name")
      .eq("id", activePpa.project_id)
      .single();

    if (projectError || !projectData) {
      return NextResponse.json({
        success: true,
        isLiveData: false,
        data: HOST_BILLING_FALLBACK,
        message: "Project not ready.",
      });
    }

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const { year: billedYear, month: billedMonth } = previousMonth(
      currentYear,
      currentMonth
    );

    const ppaStart = new Date(activePpa.start_date);
    const ppaStartMonth = ppaStart.getMonth() + 1;
    const ppaStartYear = ppaStart.getFullYear();

    // Has the plant completed at least one full billable month?
    const hasBilledPeriod =
      ppaStartYear < billedYear ||
      (ppaStartYear === billedYear && ppaStartMonth <= billedMonth);

    // Current in-progress month preview (for info only — not due)
    const { data: currentGen } = await adminClient
      .from("generations")
      .select("kwh")
      .eq("project_id", activePpa.project_id)
      .eq("month", currentMonth)
      .eq("year", currentYear);

    const currentKwh = sumKwh(currentGen || []);
    const rate = Number(activePpa.rate_per_kwh);
    const daysInCurrentMonth = new Date(currentYear, currentMonth, 0).getDate();
    const firstBillingDate = new Date(currentYear, currentMonth, 1); // 1st of next month
    const accumulating = {
      month: currentMonth,
      year: currentYear,
      label: new Date(currentYear, currentMonth - 1, 1).toLocaleDateString(
        "en-IN",
        { month: "long", year: "numeric" }
      ),
      generationKwh: Math.round(currentKwh * 100) / 100,
      estimatedAmount: Math.round(currentKwh * rate * 100) / 100,
      ratePerKwh: rate,
      daysInMonth: daysInCurrentMonth,
      dayOfMonth: now.getDate(),
      nextInvoiceDate: firstBillingDate.toISOString(),
      ppaStartDate: activePpa.start_date,
    };

    // Build history (paid + pending + overdue) from host_payments
    const { data: historyRows } = await adminClient
      .from("host_payments")
      .select("id, billing_month, billing_year, total_amount, status, due_date, paid_at")
      .eq("host_id", authResult.host.id)
      .order("billing_year", { ascending: false })
      .order("billing_month", { ascending: false })
      .limit(12);

    const monthFmt = (m: number, y: number) =>
      new Date(y, m - 1, 1).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      });

    const history = (historyRows || []).map(
      (row: {
        id: string;
        billing_month: number;
        billing_year: number;
        total_amount: number;
        status: string;
        due_date: string;
        paid_at: string | null;
      }) => {
        const overdue =
          row.status !== "COMPLETED" && new Date() > new Date(row.due_date);
        return {
          id: row.id,
          period: monthFmt(row.billing_month, row.billing_year),
          amount: Number(row.total_amount),
          status:
            row.status === "COMPLETED"
              ? ("PAID" as const)
              : overdue
              ? ("OVERDUE" as const)
              : ("PENDING" as const),
          paidAt: row.paid_at,
        };
      }
    );

    // No complete billed period yet (plant just went live this month)
    if (!hasBilledPeriod) {
      const placeholder: HostBillingSummary = {
        ...HOST_BILLING_FALLBACK,
        hostId: authResult.host.id,
        projectId: activePpa.project_id,
        ppaAgreementId: activePpa.id,
        agreementNumber: activePpa.agreement_number,
        projectName: projectData.name,
        billingMonth: currentMonth,
        billingYear: currentYear,
        billingLabel: accumulating.label,
        generationKwh: 0,
        billableKwh: 0,
        ratePerKwh: rate,
        subtotal: 0,
        adjustments: 0,
        lateFee: 0,
        totalAmount: 0,
        dueDate: firstBillingDate.toISOString(),
        invoiceNumber: "PENDING",
        paymentStatus: "PENDING",
        isLiveData: true,
        liveSource: "generation",
        history,
      };
      return NextResponse.json({
        success: true,
        isLiveData: true,
        data: { ...placeholder, accumulating, hasBilledPeriod: false },
      });
    }

    // Fetch generation for the billed (previous) month
    const { data: billedGen } = await adminClient
      .from("generations")
      .select("kwh")
      .eq("project_id", activePpa.project_id)
      .eq("month", billedMonth)
      .eq("year", billedYear);
    const billedKwh = sumKwh(billedGen || []);

    // Due date: `payment_due_day` of current month
    const dueDay = Math.min(
      Math.max(Number(activePpa.payment_due_day || 10), 1),
      28
    );
    const dueDate = new Date(currentYear, currentMonth - 1, dueDay, 18, 0, 0);

    // Check existing payment row for billed period
    const { data: paymentRows } = await adminClient
      .from("host_payments")
      .select("status")
      .eq("host_id", authResult.host.id)
      .eq("billing_month", billedMonth)
      .eq("billing_year", billedYear)
      .limit(1);

    const paymentStatus =
      paymentRows?.[0]?.status === "COMPLETED"
        ? "PAID"
        : now > dueDate
        ? "OVERDUE"
        : "PENDING";

    const summary: HostBillingSummary = calculateHostBillingSummary({
      hostId: authResult.host.id,
      projectId: activePpa.project_id,
      ppaAgreementId: activePpa.id,
      agreementNumber: activePpa.agreement_number,
      projectName: projectData.name,
      billingMonth: billedMonth,
      billingYear: billedYear,
      generationKwh: billedKwh,
      ratePerKwh: rate,
      paymentDueDay: dueDay,
      adjustments: 0,
      lateFeePercent: Number(activePpa.late_fee_percent || 0),
      minimumGuaranteeKwh:
        activePpa.minimum_guarantee_kwh == null
          ? null
          : Number(activePpa.minimum_guarantee_kwh),
      paymentStatus,
      isLiveData: true,
      liveSource: "generation",
    });

    // Override dueDate to be the current-month due date (calculateHostBillingSummary
    // uses the billed month's due day, which would be in the past)
    summary.dueDate = dueDate.toISOString();

    return NextResponse.json({
      success: true,
      isLiveData: true,
      data: { ...summary, history, accumulating, hasBilledPeriod: true },
    });
  } catch (error) {
    console.error("Host billing summary error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load host billing summary" },
      { status: 500 }
    );
  }
}
