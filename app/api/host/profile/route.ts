import { NextResponse } from "next/server";
import { verifyHost, hostUnauthorizedResponse } from "@/lib/host/hostAuth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await verifyHost();
    if (!auth.authorized || !auth.host) {
      return hostUnauthorizedResponse(auth.error || "UNAUTHORIZED");
    }

    const admin = createAdminClient();

    const [hostRes, ppaRes, paymentsRes] = await Promise.all([
      admin
        .from("hosts")
        .select(
          "business_name, business_type, contact_name, contact_email, contact_phone, city, state, gst_number, pan_number, bank_name, bank_ifsc, status, verified_at"
        )
        .eq("id", auth.host.id)
        .single(),
      admin
        .from("ppa_agreements")
        .select("agreement_number, rate_per_kwh, payment_due_day, payment_grace_days, late_fee_percent, start_date, end_date, contracted_capacity_kw, status")
        .eq("host_id", auth.host.id)
        .eq("status", "ACTIVE")
        .order("created_at", { ascending: false })
        .limit(1),
      admin
        .from("host_payments")
        .select("total_amount")
        .eq("host_id", auth.host.id)
        .eq("status", "COMPLETED"),
    ]);

    const host = hostRes.data;
    const ppa = ppaRes.data?.[0] || null;
    const paidPayments = paymentsRes.data || [];
    const avgInvoice =
      paidPayments.length > 0
        ? Math.round(
            paidPayments.reduce(
              (s: number, p: { total_amount: number }) =>
                s + Number(p.total_amount || 0),
              0
            ) / paidPayments.length
          )
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        loginEmail: auth.user?.email || "",
        businessName: host?.business_name || "",
        businessType: host?.business_type || "",
        contactName: host?.contact_name || "",
        contactEmail: host?.contact_email || "",
        contactPhone: host?.contact_phone || "",
        city: host?.city || "",
        state: host?.state || "",
        gstNumber: host?.gst_number || "",
        panNumber: host?.pan_number || "",
        bankName: host?.bank_name || "",
        bankIfsc: host?.bank_ifsc || "",
        status: host?.status || "",
        verifiedAt: host?.verified_at || null,
        ppa: ppa
          ? {
              agreementNumber: ppa.agreement_number,
              ratePerKwh: Number(ppa.rate_per_kwh),
              paymentDueDay: ppa.payment_due_day,
              paymentGraceDays: ppa.payment_grace_days,
              lateFeePercent: Number(ppa.late_fee_percent || 0),
              startDate: ppa.start_date,
              endDate: ppa.end_date,
              contractedCapacityKw: Number(ppa.contracted_capacity_kw),
              status: ppa.status,
            }
          : null,
        avgInvoice,
      },
    });
  } catch (err) {
    console.error("[host/profile]", err);
    return NextResponse.json(
      { success: false, error: "Failed to load profile" },
      { status: 500 }
    );
  }
}
