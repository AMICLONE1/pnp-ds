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