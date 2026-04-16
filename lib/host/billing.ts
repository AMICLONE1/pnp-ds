export type HostBillingStatus = "PENDING" | "PAID" | "OVERDUE";

export interface HostBillingSummary {
  hostId: string;
  projectId: string;
  ppaAgreementId: string;
  agreementNumber: string;
  projectName: string;
  billingMonth: number;
  billingYear: number;
  billingLabel: string;
  generationKwh: number;
  billableKwh: number;
  minimumGuaranteeKwh: number | null;
  ratePerKwh: number;
  subtotal: number;
  adjustments: number;
  lateFee: number;
  totalAmount: number;
  dueDate: string;
  invoiceNumber: string;
  paymentStatus: HostBillingStatus;
  isLiveData: boolean;
  liveSource: "generation" | "fallback";
  history?: Array<{
    id: string;
    period: string;
    amount: number;
    status: "PAID" | "PENDING" | "OVERDUE";
    paidAt: string | null;
  }>;
  hasBilledPeriod?: boolean;
  accumulating?: {
    month: number;
    year: number;
    label: string;
    generationKwh: number;
    estimatedAmount: number;
    ratePerKwh: number;
    daysInMonth: number;
    dayOfMonth: number;
    nextInvoiceDate: string;
    ppaStartDate: string;
  };
}

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatBillingLabel(month: number, year: number) {
  return `${MONTH_LABELS[month - 1] || "Month"} ${year}`;
}

export function buildDueDate(year: number, month: number, dueDay: number) {
  const normalizedDay = Math.min(Math.max(Math.trunc(dueDay || 10), 1), 28);
  return new Date(year, month - 1, normalizedDay, 18, 0, 0, 0);
}

function buildSummaryInvoiceNumber(agreementNumber: string, year: number, month: number) {
  const compactAgreement = agreementNumber.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const suffix = compactAgreement.slice(-8) || "DEMO";
  return `HINV-${year}${String(month).padStart(2, "0")}-${suffix}`;
}

function resolveStatus(dueDate: Date, paymentStatus?: HostBillingStatus) {
  if (paymentStatus === "PAID") {
    return "PAID" as HostBillingStatus;
  }

  const now = new Date();
  return now > dueDate ? "OVERDUE" : "PENDING";
}

export interface BillingSummaryInput {
  hostId: string;
  projectId: string;
  ppaAgreementId: string;
  agreementNumber: string;
  projectName: string;
  billingMonth: number;
  billingYear: number;
  generationKwh: number;
  ratePerKwh: number;
  paymentDueDay: number;
  adjustments?: number;
  lateFeePercent?: number;
  minimumGuaranteeKwh?: number | null;
  paymentStatus?: HostBillingStatus;
  isLiveData?: boolean;
  liveSource?: "generation" | "fallback";
}

export function calculateHostBillingSummary(input: BillingSummaryInput): HostBillingSummary {
  const billingLabel = formatBillingLabel(input.billingMonth, input.billingYear);
  const dueDate = buildDueDate(input.billingYear, input.billingMonth, input.paymentDueDay);
  const billableKwh = roundCurrency(Math.max(input.generationKwh, input.minimumGuaranteeKwh ?? input.generationKwh));
  const subtotal = roundCurrency(billableKwh * input.ratePerKwh);
  const adjustments = roundCurrency(input.adjustments ?? 0);
  const isOverdue = resolveStatus(dueDate, input.paymentStatus) === "OVERDUE";
  const lateFee = isOverdue
    ? roundCurrency(subtotal * ((input.lateFeePercent ?? 0) / 100))
    : 0;
  const totalAmount = roundCurrency(subtotal + adjustments + lateFee);

  return {
    hostId: input.hostId,
    projectId: input.projectId,
    ppaAgreementId: input.ppaAgreementId,
    agreementNumber: input.agreementNumber,
    projectName: input.projectName,
    billingMonth: input.billingMonth,
    billingYear: input.billingYear,
    billingLabel,
    generationKwh: roundCurrency(input.generationKwh),
    billableKwh,
    minimumGuaranteeKwh: input.minimumGuaranteeKwh ?? null,
    ratePerKwh: roundCurrency(input.ratePerKwh),
    subtotal,
    adjustments,
    lateFee,
    totalAmount,
    dueDate: dueDate.toISOString(),
    invoiceNumber: buildSummaryInvoiceNumber(input.agreementNumber, input.billingYear, input.billingMonth),
    paymentStatus: input.paymentStatus ?? resolveStatus(dueDate),
    isLiveData: input.isLiveData ?? true,
    liveSource: input.liveSource ?? "generation",
  };
}

export const HOST_BILLING_FALLBACK: HostBillingSummary = calculateHostBillingSummary({
  hostId: "demo-host",
  projectId: "demo-project",
  ppaAgreementId: "demo-ppa",
  agreementNumber: "PPA-DEMO-001",
  projectName: "Vedvyas Solar Park",
  billingMonth: 2,
  billingYear: 2026,
  generationKwh: 127515,
  ratePerKwh: 3.5,
  paymentDueDay: 10,
  adjustments: 0,
  lateFeePercent: 0,
  minimumGuaranteeKwh: null,
  paymentStatus: "PENDING",
  isLiveData: false,
  liveSource: "fallback",
});const GST_RATE = 0.18;
const TDS_RATE = 0.02;

export interface PpaBillingInput {
  generationKwh: number;
  ratePerKwh: number;
  adjustments?: number;
  lateFee?: number;
  gstRate?: number;
  tdsRate?: number;
  billingMonth: number;
  billingYear: number;
  hostId?: string;
  sequence?: number;
}

export interface PpaBillingResult {
  billingMonth: number;
  billingYear: number;
  periodLabel: string;
  invoiceNumber: string;
  generationKwh: number;
  ratePerKwh: number;
  adjustments: number;
  lateFee: number;
  baseAmount: number;
  gstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  taxAmount: number;
  tdsRate: number;
  tdsAmount: number;
  grossAmount: number;
  totalDue: number;
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function formatBillingPeriod(billingMonth: number, billingYear: number) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(new Date(billingYear, billingMonth - 1, 1));
}

export function buildInvoiceNumber({
  hostId = "HOST",
  billingMonth,
  billingYear,
  sequence = 1,
}: {
  hostId?: string;
  billingMonth: number;
  billingYear: number;
  sequence?: number;
}) {
  const hostToken = hostId.replace(/-/g, "").slice(0, 6).toUpperCase();
  const periodToken = `${billingYear}${String(billingMonth).padStart(2, "0")}`;
  return `PPA-${periodToken}-${hostToken}-${String(sequence).padStart(2, "0")}`;
}

export function calculatePpaBilling(input: PpaBillingInput): PpaBillingResult {
  const gstRate = input.gstRate ?? GST_RATE;
  const tdsRate = input.tdsRate ?? TDS_RATE;
  const adjustments = input.adjustments ?? 0;
  const lateFee = input.lateFee ?? 0;

  const baseAmount = roundMoney(input.generationKwh * input.ratePerKwh + adjustments);
  const taxAmount = roundMoney(baseAmount * gstRate);
  const cgstAmount = roundMoney(taxAmount / 2);
  const sgstAmount = roundMoney(taxAmount - cgstAmount);
  const grossAmount = roundMoney(baseAmount + taxAmount + lateFee);
  const tdsAmount = roundMoney(baseAmount * tdsRate);
  const totalDue = roundMoney(grossAmount - tdsAmount);

  return {
    billingMonth: input.billingMonth,
    billingYear: input.billingYear,
    periodLabel: formatBillingPeriod(input.billingMonth, input.billingYear),
    invoiceNumber: buildInvoiceNumber({
      hostId: input.hostId,
      billingMonth: input.billingMonth,
      billingYear: input.billingYear,
      sequence: input.sequence,
    }),
    generationKwh: input.generationKwh,
    ratePerKwh: input.ratePerKwh,
    adjustments,
    lateFee,
    baseAmount,
    gstRate,
    cgstAmount,
    sgstAmount,
    taxAmount,
    tdsRate,
    tdsAmount,
    grossAmount,
    totalDue,
  };
}
