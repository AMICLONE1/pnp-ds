// Payment types and mock data for admin payments page

export type PaymentStatus = "success" | "failed" | "pending" | "refunded";
export type BillStatus = "paid" | "unpaid" | "overdue" | "processing";

export interface Transaction {
    id: string;
    txnId: string;
    user: {
        name: string;
        email: string;
        phone: string;
        avatar?: string;
    };
    project: {
        name: string;
        spvId: string;
        location: string;
    };
    paymentType: string;
    amount: number;
    method: string;
    status: PaymentStatus;
    date: string;
    gatewayRefId: string;
    breakdown: {
        label: string;
        amount: number;
    }[];
    refundEligible: boolean;
}

export interface ElectricityBill {
    id: string;
    billerName: string;
    consumerNumber: string;
    billAmount: number;
    dueDate: string;
    status: BillStatus;
    bbpsRefId: string;
}

export interface PaymentStats {
    totalRevenue: number;
    totalRevenueChange: number;
    successfulPayments: number;
    successfulChange: number;
    pendingPayments: number;
    pendingChange: number;
    failedPayments: number;
    failedChange: number;
}

export const paymentStats: PaymentStats = {
    totalRevenue: 24_85_600,
    totalRevenueChange: 12.5,
    successfulPayments: 1284,
    successfulChange: 8.3,
    pendingPayments: 47,
    pendingChange: -3.2,
    failedPayments: 23,
    failedChange: -15.7,
};

export const revenueByMonth = [
    { month: "Mar", year: 2025, value: 145000 },
    { month: "Apr", year: 2025, value: 178000 },
    { month: "May", year: 2025, value: 162000 },
    { month: "Jun", year: 2025, value: 195000 },
    { month: "Jul", year: 2025, value: 210000 },
    { month: "Aug", year: 2025, value: 198000 },
    { month: "Sep", year: 2025, value: 225000 },
    { month: "Oct", year: 2025, value: 248000 },
    { month: "Nov", year: 2025, value: 265000 },
    { month: "Dec", year: 2025, value: 280000 },
    { month: "Jan", year: 2026, value: 310000 },
    { month: "Feb", year: 2026, value: 325000 },
];

const users = [
    { name: "Aarav Sharma", email: "aarav.sharma@email.com", phone: "+91 98765 43210" },
    { name: "Priya Patel", email: "priya.patel@email.com", phone: "+91 87654 32109" },
    { name: "Rohan Mehta", email: "rohan.mehta@email.com", phone: "+91 76543 21098" },
    { name: "Sneha Gupta", email: "sneha.gupta@email.com", phone: "+91 65432 10987" },
    { name: "Vikram Singh", email: "vikram.singh@email.com", phone: "+91 54321 09876" },
    { name: "Ananya Reddy", email: "ananya.reddy@email.com", phone: "+91 43210 98765" },
    { name: "Karan Joshi", email: "karan.joshi@email.com", phone: "+91 32109 87654" },
    { name: "Meera Nair", email: "meera.nair@email.com", phone: "+91 21098 76543" },
    { name: "Arjun Desai", email: "arjun.desai@email.com", phone: "+91 10987 65432" },
    { name: "Ishita Verma", email: "ishita.verma@email.com", phone: "+91 99876 54321" },
];

const projects = [
    { name: "Kutch Solar Farm", spvId: "SPV-KCH-001", location: "Kutch, Gujarat" },
    { name: "Jaisalmer Solar Park", spvId: "SPV-JSM-002", location: "Jaisalmer, Rajasthan" },
    { name: "Anantapur Solar Hub", spvId: "SPV-ANT-003", location: "Anantapur, Andhra Pradesh" },
    { name: "Pavagada Solar Plant", spvId: "SPV-PVG-004", location: "Pavagada, Karnataka" },
    { name: "Bhadla Solar Complex", spvId: "SPV-BDL-005", location: "Bhadla, Rajasthan" },
];

const paymentTypes = ["Subscription", "One-time", "EMI", "Top-up", "Advance"];
const methods = ["UPI", "Credit Card", "Debit Card", "Net Banking", "Wallet"];
const statuses: PaymentStatus[] = ["success", "success", "success", "success", "pending", "failed", "refunded"];

function generateTxnId(index: number): string {
    return `TXN${String(index + 1).padStart(6, "0")}`;
}

function generateGatewayRef(): string {
    return `pay_${Math.random().toString(36).substring(2, 14)}`;
}

function randomDate(daysBack: number): string {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
    return date.toISOString();
}

function randomAmount(): number {
    const amounts = [2500, 5000, 7500, 10000, 15000, 20000, 25000, 35000, 50000, 75000];
    return amounts[Math.floor(Math.random() * amounts.length)];
}

export const mockTransactions: Transaction[] = Array.from({ length: 25 }, (_, i) => {
    const amount = randomAmount();
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    return {
        id: `txn-${i + 1}`,
        txnId: generateTxnId(i),
        user: users[i % users.length],
        project: projects[i % projects.length],
        paymentType: paymentTypes[i % paymentTypes.length],
        amount,
        method: methods[i % methods.length],
        status,
        date: randomDate(90),
        gatewayRefId: generateGatewayRef(),
        breakdown: [
            { label: "Base Amount", amount: Math.round(amount * 0.85) },
            { label: "GST (18%)", amount: Math.round(amount * 0.15) },
        ],
        refundEligible: status === "success",
    };
});

export const mockElectricityBills: ElectricityBill[] = [
    { id: "bill-1", billerName: "MSEDCL", consumerNumber: "2100456789012", billAmount: 3450, dueDate: "2026-02-28", status: "paid", bbpsRefId: "BBPS20260201001" },
    { id: "bill-2", billerName: "TATA Power", consumerNumber: "4300987654321", billAmount: 5680, dueDate: "2026-03-05", status: "unpaid", bbpsRefId: "BBPS20260202002" },
    { id: "bill-3", billerName: "Adani Electricity", consumerNumber: "6500123456789", billAmount: 2890, dueDate: "2026-02-20", status: "overdue", bbpsRefId: "BBPS20260203003" },
    { id: "bill-4", billerName: "BESCOM", consumerNumber: "8700654321098", billAmount: 4120, dueDate: "2026-03-10", status: "processing", bbpsRefId: "BBPS20260204004" },
    { id: "bill-5", billerName: "CESC", consumerNumber: "1100567890123", billAmount: 6750, dueDate: "2026-02-25", status: "paid", bbpsRefId: "BBPS20260205005" },
    { id: "bill-6", billerName: "BSES Yamuna", consumerNumber: "3300890123456", billAmount: 3980, dueDate: "2026-03-15", status: "unpaid", bbpsRefId: "BBPS20260206006" },
    { id: "bill-7", billerName: "TNEB", consumerNumber: "5500234567890", billAmount: 2340, dueDate: "2026-02-18", status: "paid", bbpsRefId: "BBPS20260207007" },
    { id: "bill-8", billerName: "WBSEDCL", consumerNumber: "7700345678901", billAmount: 4560, dueDate: "2026-03-01", status: "overdue", bbpsRefId: "BBPS20260208008" },
    { id: "bill-9", billerName: "UPPCL", consumerNumber: "9900678901234", billAmount: 5200, dueDate: "2026-03-08", status: "processing", bbpsRefId: "BBPS20260209009" },
    { id: "bill-10", billerName: "PSPCL", consumerNumber: "1200789012345", billAmount: 3150, dueDate: "2026-02-22", status: "paid", bbpsRefId: "BBPS20260210010" },
];
