import liff from "@line/liff";

export const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID || "";

export interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export async function initializeLiff(): Promise<void> {
  if (!LIFF_ID) {
    throw new Error("LIFF_ID is not configured");
  }

  await liff.init({
    liffId: LIFF_ID,
    withLoginOnExternalBrowser: true,
  });
}

export function isLoggedIn(): boolean {
  return liff.isLoggedIn();
}

export function login(): void {
  liff.login();
}

export function logout(): void {
  liff.logout();
  window.location.reload();
}

export async function getProfile(): Promise<LiffProfile> {
  const profile = await liff.getProfile();
  return profile;
}

export function getAccessToken(): string | null {
  return liff.getAccessToken();
}

export function isInClient(): boolean {
  return liff.isInClient();
}

export function getOS(): string {
  return liff.getOS() || "unknown";
}
