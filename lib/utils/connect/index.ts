export interface ConnectUtilityData {
  state: string;
  discom: string;
  consumerNumber: string;
}

export function validateUtilityForm(data: ConnectUtilityData): string | null {
  const { state, discom, consumerNumber } = data;

  if (!state || !discom || !consumerNumber) {
    return "Please fill in all fields";
  }

  const trimmed = consumerNumber.trim();

  if (!trimmed) {
    return "Consumer number is required";
  }

  if (trimmed.length < 8) {
    return "Consumer number must be at least 8 characters";
  }

  if (trimmed.length > 20) {
    return "Consumer number must be less than 20 characters";
  }

  const consumerNumberRegex = /^[A-Za-z0-9\-_]+$/;
  if (!consumerNumberRegex.test(trimmed)) {
    return "Consumer number contains invalid characters. Only letters, numbers, hyphens, and underscores are allowed.";
  }

  if (/^[^A-Za-z0-9]/.test(trimmed) || /[^A-Za-z0-9]$/.test(trimmed)) {
    return "Consumer number cannot start or end with special characters";
  }

  return null;
}

export async function connectUtility(
  data: ConnectUtilityData
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const response = await fetch("/api/user/utility", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        state: data.state,
        discom: data.discom,
        utility_consumer_number: data.consumerNumber,
      }),
    });

    const result = await response.json();

    if (result.success) {
      return { success: true };
    } else {
      return { success: false, error: result.error?.message || "Failed to connect utility" };
    }
  } catch (err: any) {
    return { success: false, error: err.message || "Something went wrong" };
  }
}
