import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { verifyHost, hostUnauthorizedResponse } from "@/lib/host/hostAuth";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const LETTERHEAD_PATH = path.join(
  process.cwd(),
  "public",
  "assets",
  "branding",
  "letterhead.pdf"
);

// A4 in points: 595.28 × 841.89. The letterhead header band ends ~135pt from
// top; the bottom band starts ~775pt. Keep all dynamic content inside that
// safe zone so it never overlaps brand artwork.
const PAGE_W = 595.28;
const CONTENT_TOP = 150;
const CONTENT_BOTTOM = 770;
const MARGIN_X = 56;
const CONTENT_W = PAGE_W - MARGIN_X * 2;

// Brand colours
const COLOR_TITLE = rgb(0.06, 0.16, 0.11);          // deep forest green
const COLOR_BODY = rgb(0.13, 0.16, 0.21);
const COLOR_MUTED = rgb(0.42, 0.45, 0.5);
const COLOR_RULE = rgb(0.86, 0.88, 0.91);
const COLOR_PANEL_BG = rgb(0.97, 0.98, 0.99);
const COLOR_TOTAL_BG = rgb(0.06, 0.16, 0.11);
const COLOR_TOTAL_ACCENT = rgb(1, 0.72, 0);

function formatAmount(value: number | string | null | undefined) {
  const numericValue = Number(value || 0);
  return `INR ${numericValue.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
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

    const [
      { data: invoiceRows, error: invoiceError },
      { data: paymentRows },
      { data: hostRows },
    ] = await Promise.all([
      adminClient
        .from("host_invoices")
        .select(
          "id, host_id, invoice_number, invoice_date, due_date, subtotal, tax_amount, total_amount, status, sent_at, paid_at, pdf_path"
        )
        .eq("id", id)
        .eq("host_id", host.id)
        .limit(1),
      adminClient
        .from("host_payments")
        .select(
          "billing_month, billing_year, generation_kwh, rate_per_kwh, base_amount, adjustments, late_fee, total_amount, payment_method, payment_reference, ppa_agreement_id"
        )
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
          error: { code: "INVOICE_NOT_FOUND", message: "Invoice not found for this host" },
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

    // 1. Load the letterhead PDF and grab its first page.
    const letterheadBytes = await fs.readFile(LETTERHEAD_PATH);
    const pdfDoc = await PDFDocument.load(letterheadBytes);
    const [page] = pdfDoc.getPages();

    const helv = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helvBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    pdfDoc.setTitle(`Invoice ${invoice.invoice_number}`);
    pdfDoc.setAuthor("PowerNetPro Pvt. Ltd.");
    pdfDoc.setSubject("Host Invoice");
    pdfDoc.setCreator("PowerNetPro Host Portal");

    // pdf-lib uses a bottom-up coordinate system. Convert top-down y values
    // (easier to think about) using the page height.
    const pageHeight = page.getHeight();
    const yFromTop = (top: number) => pageHeight - top;

    const drawText = (
      text: string,
      x: number,
      topY: number,
      opts: {
        size?: number;
        bold?: boolean;
        color?: ReturnType<typeof rgb>;
        maxWidth?: number;
        align?: "left" | "right" | "center";
      } = {}
    ) => {
      const size = opts.size || 10;
      const font = opts.bold ? helvBold : helv;
      const color = opts.color || COLOR_BODY;
      let drawX = x;
      if (opts.align === "right" && opts.maxWidth) {
        const w = font.widthOfTextAtSize(text, size);
        drawX = x + opts.maxWidth - w;
      } else if (opts.align === "center" && opts.maxWidth) {
        const w = font.widthOfTextAtSize(text, size);
        drawX = x + (opts.maxWidth - w) / 2;
      }
      page.drawText(text, {
        x: drawX,
        y: yFromTop(topY) - size, // baseline correction so topY is the visual top
        size,
        font,
        color,
      });
    };

    const drawRule = (topY: number, x1: number, x2: number, color = COLOR_RULE) => {
      page.drawLine({
        start: { x: x1, y: yFromTop(topY) },
        end: { x: x2, y: yFromTop(topY) },
        thickness: 0.6,
        color,
      });
    };

    const drawPanel = (topY: number, height: number) => {
      page.drawRectangle({
        x: MARGIN_X,
        y: yFromTop(topY + height),
        width: CONTENT_W,
        height,
        color: COLOR_PANEL_BG,
        borderColor: COLOR_RULE,
        borderWidth: 0.6,
      });
    };

    // ── 2. Title strip ─────────────────────────────────────────────────────
    let y = CONTENT_TOP;
    drawText("HOST INVOICE", MARGIN_X, y, { size: 16, bold: true, color: COLOR_TITLE });
    drawText(`Invoice no.  ${invoice.invoice_number}`, MARGIN_X, y + 22, {
      size: 10,
      color: COLOR_MUTED,
    });

    drawText(`Status: ${String(invoice.status)}`, MARGIN_X, y, {
      size: 10,
      bold: true,
      color: COLOR_TITLE,
      align: "right",
      maxWidth: CONTENT_W,
    });
    drawText(formatDate(String(invoice.invoice_date)), MARGIN_X, y + 16, {
      size: 10,
      color: COLOR_MUTED,
      align: "right",
      maxWidth: CONTENT_W,
    });

    y += 48;
    drawRule(y, MARGIN_X, PAGE_W - MARGIN_X);
    y += 16;

    // ── 3. Two-column info panels ─────────────────────────────────────────
    const PANEL_H = 96;
    drawPanel(y, PANEL_H);

    const COL_GAP = 14;
    const colW = (CONTENT_W - COL_GAP) / 2;
    const COL_LX = MARGIN_X + 14;
    const COL_RX = MARGIN_X + colW + COL_GAP + 14;

    drawText("HOST INFORMATION", COL_LX, y + 12, { size: 8, bold: true, color: COLOR_MUTED });
    drawText(
      hostProfile?.business_name || host.business_name || "Host Portfolio",
      COL_LX,
      y + 28,
      { size: 11, bold: true, color: COLOR_TITLE, maxWidth: colW - 28 }
    );
    drawText(`Account: ${authResult.user?.email || "-"}`, COL_LX, y + 46, {
      size: 9,
      color: COLOR_BODY,
      maxWidth: colW - 28,
    });
    drawText(`Host ID: ${host.id.slice(0, 13)}…`, COL_LX, y + 60, {
      size: 9,
      color: COLOR_BODY,
      maxWidth: colW - 28,
    });
    drawText(`Status: ${host.status}`, COL_LX, y + 74, {
      size: 9,
      color: COLOR_BODY,
      maxWidth: colW - 28,
    });

    drawText("INVOICE INFORMATION", COL_RX, y + 12, { size: 8, bold: true, color: COLOR_MUTED });
    drawText(`Invoice Date: ${formatDate(String(invoice.invoice_date))}`, COL_RX, y + 28, {
      size: 9,
      color: COLOR_BODY,
    });
    drawText(`Due Date: ${formatDate(String(invoice.due_date))}`, COL_RX, y + 44, {
      size: 9,
      color: COLOR_BODY,
    });
    drawText(`Paid On: ${formatDate(invoice.paid_at)}`, COL_RX, y + 60, {
      size: 9,
      color: COLOR_BODY,
    });
    drawText(`Billing Status: ${String(invoice.status)}`, COL_RX, y + 76, {
      size: 9,
      bold: true,
      color: COLOR_TITLE,
    });

    y += PANEL_H + 18;

    // ── 4. Billing summary panel ──────────────────────────────────────────
    const SUMMARY_H = 84;
    drawPanel(y, SUMMARY_H);
    drawText("BILLING SUMMARY", MARGIN_X + 14, y + 12, {
      size: 8,
      bold: true,
      color: COLOR_MUTED,
    });

    const summaryRows: Array<[string, string]> = [
      ["Project", "Solar Project"],
      ["Billing period", periodLabel || formatDate(String(invoice.invoice_date))],
      [
        "Generation",
        payment ? `${Number(payment.generation_kwh || 0).toLocaleString("en-IN")} kWh` : "-",
      ],
      ["Rate", payment ? `${formatAmount(payment.rate_per_kwh)}/kWh` : "-"],
    ];
    summaryRows.forEach(([label, value], idx) => {
      const rowY = y + 28 + idx * 14;
      drawText(`${label}:`, MARGIN_X + 14, rowY, { size: 9, color: COLOR_MUTED });
      drawText(value, MARGIN_X + 14, rowY, {
        size: 9,
        bold: true,
        color: COLOR_TITLE,
        align: "right",
        maxWidth: CONTENT_W - 28,
      });
    });

    y += SUMMARY_H + 22;

    // ── 5. Billing breakdown ──────────────────────────────────────────────
    drawText("Billing Breakdown", MARGIN_X, y, { size: 12, bold: true, color: COLOR_TITLE });
    y += 16;
    drawRule(y, MARGIN_X, PAGE_W - MARGIN_X);
    y += 12;

    const breakdownRows: Array<[string, string]> = [
      ["Energy charge", formatAmount(payment?.base_amount ?? invoice.subtotal)],
      ["Adjustments", formatAmount(payment?.adjustments ?? 0)],
      ["Late fee", formatAmount(payment?.late_fee ?? 0)],
      ["GST", formatAmount(invoice.tax_amount ?? 0)],
      ["Payment method", payment?.payment_method || "Cashfree"],
      ["Payment reference", String(payment?.payment_reference || invoice.invoice_number)],
    ];

    breakdownRows.forEach(([label, value], idx) => {
      const rowY = y + idx * 18;
      drawText(label, MARGIN_X + 6, rowY, { size: 10, color: COLOR_MUTED });
      drawText(value, MARGIN_X + 6, rowY, {
        size: 10,
        bold: true,
        color: COLOR_TITLE,
        align: "right",
        maxWidth: CONTENT_W - 12,
      });
    });

    y += breakdownRows.length * 18 + 14;

    // ── 6. Total due band ─────────────────────────────────────────────────
    const TOTAL_H = 38;
    page.drawRectangle({
      x: MARGIN_X,
      y: yFromTop(y + TOTAL_H),
      width: CONTENT_W,
      height: TOTAL_H,
      color: COLOR_TOTAL_BG,
    });
    drawText("Total Due", MARGIN_X + 16, y + 12, {
      size: 11,
      bold: true,
      color: rgb(1, 1, 1),
    });
    drawText(formatAmount(invoice.total_amount), MARGIN_X + 16, y + 11, {
      size: 14,
      bold: true,
      color: COLOR_TOTAL_ACCENT,
      align: "right",
      maxWidth: CONTENT_W - 32,
    });

    y += TOTAL_H + 22;

    // ── 7. Note ───────────────────────────────────────────────────────────
    if (y < CONTENT_BOTTOM - 80) {
      drawText("Invoice note", MARGIN_X, y, { size: 10, bold: true, color: COLOR_TITLE });
      y += 14;
      drawText(
        "This invoice copy is generated from the host portal after payment verification. Keep it for your records and reconciliation.",
        MARGIN_X,
        y,
        { size: 9, color: COLOR_MUTED, maxWidth: CONTENT_W }
      );
    }

    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);

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
