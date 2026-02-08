export async function fetchBills(): Promise<{ success: true; data: any[] } | { success: false; error: string }> {
  try {
    const response = await fetch("/api/bills");
    const result = await response.json();
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.error?.message || "Failed to fetch bills" };
    }
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred" };
  }
}

export interface ManualBillData {
  bill_number: string;
  amount: string;
  due_date: string;
  discom: string;
}

export async function submitManualBill(data: ManualBillData): Promise<{ success: true; message: string } | { success: false; error: string }> {
  try {
    const response = await fetch("/api/bills/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      return { success: true, message: result.message || "Bill added successfully!" };
    } else {
      return { success: false, error: result.error?.message || "Failed to add bill" };
    }
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred" };
  }
}

export async function fetchBillFromBBPS(): Promise<{ success: true; message: string } | { success: false; error: string }> {
  try {
    const response = await fetch("/api/bills/fetch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();

    if (result.success) {
      return { success: true, message: result.message || "Bill fetched successfully!" };
    } else {
      return { success: false, error: result.error?.message || "Failed to fetch bill from BBPS" };
    }
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred" };
  }
}
