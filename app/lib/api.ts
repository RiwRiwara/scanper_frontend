const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://scanper-api.fly.dev";

export interface UserData {
  line_user_id: string;
  display_name: string | null;
  ocr_count_session: number;
  ocr_limit: number;
  ocr_remaining: number;
  ocr_count_total: number;
  message_count: number;
  first_seen_at: string;
  last_seen_at: string;
}

export interface UserNotFound {
  message: string;
  line_user_id: string;
  display_name: string | null;
}

export type UserResponse = UserData | UserNotFound;

function isUserNotFound(response: UserResponse): response is UserNotFound {
  return "message" in response;
}

export async function fetchUserData(
  accessToken: string
): Promise<{ data: UserData | null; notFound: UserNotFound | null; error: string | null }> {
  try {
    const response = await fetch(`${API_URL}/liff/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { data: null, notFound: null, error: "Authentication failed. Please try logging in again." };
      }
      return { data: null, notFound: null, error: `Error: ${response.status}` };
    }

    const result: UserResponse = await response.json();

    if (isUserNotFound(result)) {
      return { data: null, notFound: result, error: null };
    }

    return { data: result, notFound: null, error: null };
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return { data: null, notFound: null, error: "Failed to connect to server" };
  }
}

export interface UpdateDisplayNameResponse {
  success: boolean;
  display_name: string;
  message: string;
}

export async function updateDisplayName(
  accessToken: string,
  displayName: string
): Promise<{ data: UpdateDisplayNameResponse | null; error: string | null }> {
  try {
    const response = await fetch(`${API_URL}/liff/user/display-name`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ display_name: displayName }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { data: null, error: "Authentication failed. Please try logging in again." };
      }
      if (response.status === 400) {
        const errorData = await response.json();
        return { data: null, error: errorData.detail || "Invalid display name" };
      }
      if (response.status === 404) {
        return { data: null, error: "User not found. Please use the bot first." };
      }
      return { data: null, error: `Error: ${response.status}` };
    }

    const result: UpdateDisplayNameResponse = await response.json();
    return { data: result, error: null };
  } catch (error) {
    console.error("Failed to update display name:", error);
    return { data: null, error: "Failed to connect to server" };
  }
}

// ============ Payment API ============

export interface PaymentPackage {
  amount_thb: number;
  amount_satang: number;
  pages: number;
  label: string;
}

export interface CreateChargeResponse {
  charge_id: string;
  reference_id: string;
  amount_satang: number;
  pages_to_receive: number;
  action_required: "NONE" | "REDIRECT" | "ENCODED_IMAGE";
  redirect_url: string | null;
}

export interface PaymentHistoryItem {
  charge_id: string;
  amount_thb: number;
  pages_purchased: number;
  status: string;
  created_at: string;
  payment_method: string | null;
}

export async function getPaymentPackages(
  accessToken: string
): Promise<{ data: PaymentPackage[] | null; error: string | null }> {
  try {
    const response = await fetch(`${API_URL}/payment/packages`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return { data: null, error: `Error: ${response.status}` };
    }

    const result: PaymentPackage[] = await response.json();
    return { data: result, error: null };
  } catch (error) {
    console.error("Failed to fetch payment packages:", error);
    return { data: null, error: "Failed to connect to server" };
  }
}

export async function createCharge(
  accessToken: string,
  amountThb: number
): Promise<{ data: CreateChargeResponse | null; error: string | null }> {
  try {
    const response = await fetch(`${API_URL}/payment/create-charge`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount_thb: amountThb }),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const errorData = await response.json();
        return { data: null, error: errorData.detail || "Invalid amount" };
      }
      return { data: null, error: `Error: ${response.status}` };
    }

    const result: CreateChargeResponse = await response.json();
    return { data: result, error: null };
  } catch (error) {
    console.error("Failed to create charge:", error);
    return { data: null, error: "Failed to connect to server" };
  }
}

export async function getPaymentHistory(
  accessToken: string
): Promise<{ data: PaymentHistoryItem[] | null; error: string | null }> {
  try {
    const response = await fetch(`${API_URL}/payment/history`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return { data: null, error: `Error: ${response.status}` };
    }

    const result: PaymentHistoryItem[] = await response.json();
    return { data: result, error: null };
  } catch (error) {
    console.error("Failed to fetch payment history:", error);
    return { data: null, error: "Failed to connect to server" };
  }
}
