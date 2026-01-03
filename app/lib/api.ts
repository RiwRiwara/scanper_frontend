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
