import { NextResponse } from "next/server";
import { verifyHost, hostUnauthorizedResponse } from "@/lib/host/hostAuth";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const PDFDocument = require("pdfkit");

function formatAmount(value: number | string | null | undefined) {
  const numericValue = Number(value || 0);
  return `INR ${numericValue.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function createPdfBuffer(build: (doc: any) => void) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 48, bufferPages: true });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer | Uint8Array) => {
      chunks.push(Buffer.from(chunk));
    });
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    build(doc);
    doc.end();
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await verifyHost();
    const host = authResult.host;

    if (!authResult.authorized || !host) {
      return hostUnauthorizedResponse(authResult.error || "UNAUTHORIZED");
    }

    const adminClient = createAdminClient();

    const [{ data: invoiceRows, error: invoiceError }, { data: paymentRows }, { data: hostRows }] = await Promise.all([
      adminClient
        .from("host_invoices")
        .select("id, host_id, invoice_number, invoice_date, due_date, subtotal, tax_amount, total_amount, status, sent_at, paid_at, pdf_path")
        .eq("id", id)
        .eq("host_id", host.id)
        .limit(1),
      adminClient
        .from("host_payments")
        .select("billing_month, billing_year, generation_kwh, rate_per_kwh, base_amount, adjustments, late_fee, total_amount, payment_method, payment_reference, ppa_agreement_id")
        .eq("invoice_id", id)
        .eq("host_id", host.id)
        .limit(1),
      adminClient
        .from("hosts")
        .select("business_name, status")
        .eq("user_id", authResult.user?.id || "")
        .limit(1),
    ]);

    const invoice = invoiceRows?.[0];
    const payment = paymentRows?.[0] || null;
    const hostProfile = hostRows?.[0] || null;

    if (invoiceError || !invoice) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVOICE_NOT_FOUND",
            message: "Invoice not found for this host",
          },
        },
        { status: 404 }
      );
    }

    if (!["PAID", "SENT", "COMPLETED"].includes(String(invoice.status))) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVOICE_NOT_READY",
            message: "The invoice can only be downloaded after payment verification.",
          },
        },
        { status: 409 }
      );
    }

    const invoiceDownloadPath = `/api/host/financials/invoices/${invoice.id}/download`;

    if (invoice.pdf_path !== invoiceDownloadPath) {
      await adminClient
        .from("host_invoices")
        .update({ pdf_path: invoiceDownloadPath })
        .eq("id", invoice.id)
        .eq("host_id", host.id);
    }

    const periodLabel = payment
      ? new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(
          new Date(Number(payment.billing_year), Number(payment.billing_month) - 1, 1)
        )
      : null;

    const pdfBuffer = await createPdfBuffer((doc: any) => {
      doc.info.Title = `Invoice ${invoice.invoice_number}`;
      doc.info.Author = "PowerNetPro";
      doc.info.Subject = "Host invoice";
      doc.info.Creator = "PowerNetPro Host Portal";

      doc.rect(0, 0, 595.28, 118).fill("#0F2A1D");
      doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(24).text("PowerNetPro", 48, 34);
      doc.fontSize(12).text("Host Invoice", 48, 68);
      doc.font("Helvetica").fontSize(9).text("Generated after payment verification from the host portal.", 48, 88);
      doc.text(`Invoice ${invoice.invoice_number}`, 370, 44, { align: "right", width: 177 });
      doc.text(`Status ${invoice.status}`, 370, 64, { align: "right", width: 177 });
      doc.text(formatDate(String(invoice.invoice_date)), 370, 84, { align: "right", width: 177 });

      let y = 146;
      doc.roundedRect(48, y, 499, 124, 12).fillAndStroke("#F8FAFC", "#E5E7EB");
      doc.fillColor("#475569").font("Helvetica-Bold").fontSize(9).text("HOST INFORMATION", 64, y + 14);
      doc.fillColor("#111827").font("Helvetica").fontSize(11).text(hostProfile?.business_name || host.business_name || "Host Portfolio", 64, y + 32, { width: 210 });
      doc.text(`Account: ${authResult.user?.email || "-"}`, 64, y + 50, { width: 210 });
      doc.text(`Host ID: ${host.id}`, 64, y + 68, { width: 210 });
      doc.text(`Status: ${host.status}`, 64, y + 86, { width: 210 });

      doc.fillColor("#475569").font("Helvetica-Bold").fontSize(9).text("INVOICE INFORMATION", 312, y + 14);
      doc.fillColor("#111827").font("Helvetica").fontSize(11).text(`Invoice Date: ${formatDate(String(invoice.invoice_date))}`, 312, y + 32, { width: 214 });
      doc.text(`Due Date: ${formatDate(String(invoice.due_date))}`, 312, y + 50, { width: 214 });
      doc.text(`Paid On: ${formatDate(invoice.paid_at)}`, 312, y + 68, { width: 214 });
      doc.text(`Billing Status: ${String(invoice.status)}`, 312, y + 86, { width: 214 });

      y += 146;
      doc.roundedRect(48, y, 499, 108, 12).fillAndStroke("#FFFFFF", "#E5E7EB");
      doc.fillColor("#475569").font("Helvetica-Bold").fontSize(9).text("BILLING SUMMARY", 64, y + 14);

      const billingPeriod = periodLabel || formatDate(String(invoice.invoice_date));
      const summaryRows = [
        ["Project", payment ? "Solar Project" : "Solar Project"],
        ["Billing period", billingPeriod],
        ["Generation", payment ? `${Number(payment.generation_kwh || 0).toLocaleString("en-IN")} kWh` : "-"],
        ["Rate", payment ? `${formatAmount(payment.rate_per_kwh)}/kWh` : "-"],
      ];

      summaryRows.forEach((row, index) => {
        const rowY = y + 34 + index * 18;
        doc.fillColor("#6B7280").font("Helvetica").fontSize(10).text(`${row[0]}:`, 64, rowY, { width: 180 });
        doc.fillColor("#111827").font("Helvetica-Bold").text(String(row[1]), 210, rowY, { width: 317, align: "right" });
      });

      y += 126;
      doc.font("Helvetica-Bold").fillColor("#0F172A").fontSize(13).text("Billing Breakdown", 48, y);
      y += 18;
      doc.moveTo(48, y).lineTo(547, y).strokeColor("#E5E7EB").stroke();
      y += 14;

      const breakdownRows = [
        ["Energy charge", formatAmount(payment?.base_amount ?? invoice.subtotal)],
        ["Adjustments", formatAmount(payment?.adjustments ?? 0)],
        ["Late fee", formatAmount(payment?.late_fee ?? 0)],
        ["GST", formatAmount(invoice.tax_amount ?? 0)],
        ["Payment method", payment?.payment_method || "Razorpay"],
        ["Payment reference", payment?.payment_reference || invoice.invoice_number],
      ];

      breakdownRows.forEach((row, index) => {
        const rowY = y + index * 20;
        doc.font("Helvetica").fontSize(10).fillColor("#475569").text(row[0], 56, rowY, { width: 210 });
        doc.font("Helvetica-Bold").fillColor("#111827").text(row[1], 300, rowY, { width: 247, align: "right" });
      });

      y += breakdownRows.length * 20 + 12;
      doc.roundedRect(48, y, 499, 42, 10).fillAndStroke("#0F2A1D", "#0F2A1D");
      doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(11).text("Total Due", 64, y + 13);
      doc.fillColor("#FFB800").fontSize(14).text(formatAmount(invoice.total_amount), 336, y + 11, { width: 194, align: "right" });

      y += 60;
      doc.font("Helvetica-Bold").fillColor("#0F172A").fontSize(11).text("Invoice note", 48, y);
      y += 16;
      doc.font("Helvetica").fillColor("#475569").fontSize(10).text(
        "This invoice copy is generated from the host portal after payment verification. Keep it for your records and reconciliation.",
        48,
        y,
        { width: 499, lineGap: 3 }
      );

      y += 54;
      doc.font("Helvetica").fillColor("#94A3B8").fontSize(8).text(
        "PowerNetPro Host Portal | Support: billing@powernetpro.com | GST and withholding values are shown as captured in the verified payment record.",
        48,
        y,
        { width: 499 }
      );
    });

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${invoice.invoice_number}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Host invoice download error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to download host invoice" },
      { status: 500 }
    );
  }
}