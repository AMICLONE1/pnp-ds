import { NextResponse } from "next/server";
import { verifyHost, hostUnauthorizedResponse } from "@/lib/host/hostAuth";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculateHostBillingSummary } from "@/lib/host/billing";
import {
  buildAllowedPaymentMethods,
  createCashfreeOrder,
  getCashfreeMode,
  getPublicAppId,
  isCashfreeConfigured,
} from "@/lib/payments/cashfree";

function getAppOrigin(request: Request) {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    request.headers.get("origin") ||
    "http://localhost:3000"
  );
}

function sumKwh(rows: Array<{ kwh: string | number }>) {
  return rows.reduce((total, row) => total + Number(row.kwh || 0), 0);
}

async function buildLiveBillingSummary(hostId: string, billingMonth?: number, billingYear?: number) {
  const adminClient = createAdminClient();

  const { data: ppaRows } = await adminClient
    .from("ppa_agreements")
    .select("id, project_id, agreement_number, rate_per_kwh, payment_due_day, late_fee_percent, minimum_guarantee_kwh")
    .eq("host_id", hostId)
    .eq("status", "ACTIVE")
    .order("created_at", { ascending: false });

  const activePpa = ppaRows?.[0];
  if (!activePpa) return null;

  const { data: projectData } = await adminClient
    .from("projects")
    .select("name")
    .eq("id", activePpa.project_id)
    .single();

  if (!projectData) return null;

  const targetMonth = billingMonth || new Date().getMonth() + 1;
  const targetYear = billingYear || new Date().getFullYear();

  const { data: requestedGeneration } = await adminClient
    .from("generations")
    .select("kwh")
    .eq("project_id", activePpa.project_id)
    .eq("month", targetMonth)
    .eq("year", targetYear);

  let finalMonth = targetMonth;
  let finalYear = targetYear;
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
      finalMonth = Number(latestGeneration.month);
      finalYear = Number(latestGeneration.year);
      generationKwh = sumKwh(
        (latestGenerationRows || []).filter(
          (row) => Number(row.month) === finalMonth && Number(row.year) === finalYear
        )
      );
    }
  }

  if (generationKwh === 0) return null;

  const dueDate = new Date(
    finalYear,
    finalMonth - 1,
    Math.min(Math.max(Number(activePpa.payment_due_day || 10), 1), 28),
    18, 0, 0, 0
  );

  const paymentStatus = new Date() > dueDate ? "OVERDUE" : "PENDING";

  return calculateHostBillingSummary({
    hostId,
    projectId: activePpa.project_id,
    ppaAgreementId: activePpa.id,
    agreementNumber: activePpa.agreement_number,
    projectName: projectData.name,
    billingMonth: finalMonth,
    billingYear: finalYear,
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
}

export async function POST(request: Request) {
  try {
    const authResult = await verifyHost();
    if (!authResult.authorized || !authResult.host) {
      return hostUnauthorizedResponse(authResult.error || "UNAUTHORIZED");
    }

    if (!isCashfreeConfigured()) {
      return NextResponse.json(
        { success: false, error: { code: "GATEWAY_NOT_CONFIGURED", message: "Cashfree keys are not configured" } },
        { status: 503 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const billingMonth = body.billingMonth ? Number(body.billingMonth) : undefined;
    const billingYear = body.billingYear ? Number(body.billingYear) : undefined;
    const customerPhone = String(body.customer_phone || "").trim();
    const customerEmail = String(body.customer_email || "").trim();

    const phone = customerPhone || (authResult.host as any)?.contact_phone || "";
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "PHONE_REQUIRED",
            message: "A 10-digit Indian mobile number is required to start payment",
          },
        },
        { status: 400 }
      );
    }

    const summary = await buildLiveBillingSummary(authResult.host.id, billingMonth, billingYear);

    if (!summary) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "BILLING_NOT_READY",
            message:
              "Host billing data is not ready yet. The host must have an active PPA and generation data before payment can start.",
          },
        },
        { status: 409 }
      );
    }

    const adminClient = createAdminClient();

    const { data: existingPayment } = await adminClient
      .from("host_payments")
      .select("id, status, invoice_id")
      .eq("host_id", authResult.host.id)
      .eq("billing_month", summary.billingMonth)
      .eq("billing_year", summary.billingYear)
      .limit(1);

    if (existingPayment?.[0]?.status === "COMPLETED") {
      return NextResponse.json(
        { success: false, error: { code: "ALREADY_PAID", message: "This billing cycle has already been paid." } },
        { status: 409 }
      );
    }

    const paymentPayload = {
      host_id: authResult.host.id,
      ppa_agreement_id: summary.ppaAgreementId,
      billing_month: summary.billingMonth,
      billing_year: summary.billingYear,
      generation_kwh: summary.generationKwh,
      rate_per_kwh: summary.ratePerKwh,
      base_amount: summary.subtotal,
      adjustments: summary.adjustments,
      late_fee: summary.lateFee,
      total_amount: summary.totalAmount,
      status: "PENDING",
      due_date: summary.dueDate,
      payment_method: "CASHFREE",
      invoice_id: null,
      gateway_order_id: null,
      gateway_payment_id: null,
      gateway_signature: null,
      payment_reference: null,
      notes: JSON.stringify({
        agreement_number: summary.agreementNumber,
        project_name: summary.projectName,
        invoice_number: summary.invoiceNumber,
      }),
    };

    let paymentId = existingPayment?.[0]?.id || null;
    if (paymentId) {
      const { error: updateError } = await adminClient
        .from("host_payments")
        .update(paymentPayload)
        .eq("id", paymentId);

      if (updateError) {
        return NextResponse.json(
          { success: false, error: { code: "DB_ERROR", message: updateError.message } },
          { status: 500 }
        );
      }
    } else {
      const { data: createdPayment, error: insertError } = await adminClient
        .from("host_payments")
        .insert(paymentPayload)
        .select("id")
        .single();

      if (insertError || !createdPayment) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "DB_ERROR", message: insertError?.message || "Failed to create host payment record" },
          },
          { status: 500 }
        );
      }
      paymentId = createdPayment.id;
    }

    const orderId = `pnp_host_${paymentId}`;
    const origin = getAppOrigin(request);

    const order = await createCashfreeOrder({
      order_id: orderId,
      order_amount: Math.round(summary.totalAmount * 100) / 100,
      order_currency: "INR",
      customer_details: {
        customer_id: authResult.host.id,
        customer_phone: phone,
        customer_email: customerEmail || (authResult.host as any)?.contact_email || "host@powernetpro.local",
        customer_name: (authResult.host as any)?.business_name || "Host",
      },
      order_meta: {
        return_url: `${origin}/host/financials?order_id={order_id}`,
        notify_url: `${origin}/api/payments/webhook`,
        payment_methods: buildAllowedPaymentMethods(),
        invoice_date: new Date().toISOString(),
        invoice_id: summary.invoiceNumber,
      },
      order_note: summary.invoiceNumber,
      order_tags: {
        host_payment_id: String(paymentId),
        host_id: authResult.host.id,
        billing_month: String(summary.billingMonth),
        billing_year: String(summary.billingYear),
        invoice_number: summary.invoiceNumber,
      },
    });

    await adminClient
      .from("host_payments")
      .update({ gateway_order_id: order.order_id })
      .eq("id", paymentId);

    return NextResponse.json({
      success: true,
      data: {
        order_id: order.order_id,
        payment_session_id: order.payment_session_id,
        amount: order.order_amount,
        currency: order.order_currency,
        payment_id: paymentId,
        app_id: getPublicAppId(),
        mode: getCashfreeMode(),
        summary,
      },
    });
  } catch (error: any) {
    console.error("Host billing order error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "HOST_BILLING_ERROR", message: error.message || "Failed to create host billing order" },
      },
      { status: 500 }
    );
  }
}
