import { NextResponse } from "next/server";
import { verifyHost, hostUnauthorizedResponse } from "@/lib/host/hostAuth";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  HOST_BILLING_FALLBACK,
  calculateHostBillingSummary,
  HostBillingSummary,
} from "@/lib/host/billing";

function sumKwh(rows: Array<{ kwh: string | number }>) {
  return rows.reduce((total, row) => total + Number(row.kwh || 0), 0);
}

export async function GET(request: Request) {
  try {
    const authResult = await verifyHost();
    if (!authResult.authorized || !authResult.host) {
      return hostUnauthorizedResponse(authResult.error || "UNAUTHORIZED");
    }

    const adminClient = createAdminClient();
    const url = new URL(request.url);
    const requestedMonth = Number(url.searchParams.get("month") || new Date().getMonth() + 1);
    const requestedYear = Number(url.searchParams.get("year") || new Date().getFullYear());

    const { data: ppaRows, error: ppaError } = await adminClient
      .from("ppa_agreements")
      .select("id, project_id, agreement_number, rate_per_kwh, payment_due_day, late_fee_percent, minimum_guarantee_kwh")
      .eq("host_id", authResult.host.id)
      .eq("status", "ACTIVE")
      .order("created_at", { ascending: false });

    const activePpa = ppaRows?.[0];

    if (ppaError || !activePpa) {
      return NextResponse.json({
        success: true,
        isLiveData: false,
        data: HOST_BILLING_FALLBACK,
        message: "No active PPA found yet. Showing sample billing until the host is connected to a live agreement.",
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
        message: "The live project is not ready yet. Showing sample billing data.",
      });
    }

    const { data: requestedGeneration } = await adminClient
      .from("generations")
      .select("kwh")
      .eq("project_id", activePpa.project_id)
      .eq("month", requestedMonth)
      .eq("year", requestedYear);

    let billingMonth = requestedMonth;
    let billingYear = requestedYear;
    let generationKwh = sumKwh(requestedGeneration || []);

    if (generationKwh === 0) {
      const { data: latestGenerationRows } = await adminClient
        .from("generations")
        .select("month, year, kwh")
        .eq("project_id", activePpa.project_id)
        .order("year", { ascending: false })
        .order("month", { ascending: false });

      const latestGeneration = latestGenerationRows?.[0];
      if (latestGeneration) {
        billingMonth = Number(latestGeneration.month);
        billingYear = Number(latestGeneration.year);
        generationKwh = sumKwh(
          (latestGenerationRows || []).filter(
            (row) => Number(row.month) === billingMonth && Number(row.year) === billingYear
          )
        );
      }
    }

    if (generationKwh === 0) {
      return NextResponse.json({
        success: true,
        isLiveData: false,
        data: HOST_BILLING_FALLBACK,
        message: "No generation data has been synced yet. Showing sample billing data.",
      });
    }

    const dueDate = new Date(
      billingYear,
      billingMonth - 1,
      Math.min(Math.max(Number(activePpa.payment_due_day || 10), 1), 28),
      18,
      0,
      0,
      0
    );

    const { data: paymentRows } = await adminClient
      .from("host_payments")
      .select("status, invoice_id")
      .eq("host_id", authResult.host.id)
      .eq("billing_month", billingMonth)
      .eq("billing_year", billingYear)
      .limit(1);

    const paymentRow = paymentRows?.[0];
    const paymentStatus =
      paymentRow?.status === "COMPLETED"
        ? "PAID"
        : new Date() > dueDate
          ? "OVERDUE"
          : "PENDING";

    const summary: HostBillingSummary = calculateHostBillingSummary({
      hostId: authResult.host.id,
      projectId: activePpa.project_id,
      ppaAgreementId: activePpa.id,
      agreementNumber: activePpa.agreement_number,
      projectName: projectData.name,
      billingMonth,
      billingYear,
      generationKwh,
      ratePerKwh: Number(activePpa.rate_per_kwh),
      paymentDueDay: Number(activePpa.payment_due_day || 10),
      adjustments: 0,
      lateFeePercent: Number(activePpa.late_fee_percent || 0),
      minimumGuaranteeKwh:
        activePpa.minimum_guarantee_kwh === null || activePpa.minimum_guarantee_kwh === undefined
          ? null
          : Number(activePpa.minimum_guarantee_kwh),
      paymentStatus,
      isLiveData: true,
      liveSource: "generation",
    });

    return NextResponse.json({
      success: true,
      isLiveData: true,
      data: summary,
    });
  } catch (error) {
    console.error("Host billing summary error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load host billing summary" },
      { status: 500 }
    );
  }
}