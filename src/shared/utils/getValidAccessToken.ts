// src/lib/auth/getValidAccessToken.ts
import { authService } from "@/features/auth/services/auth.service";
import { getAuthCookies, setAuthCookies, clearAuthCookies } from "./cookies";

const REFRESH_BUFFER_MS = 30_000; // refresh 30s before actual expiry

/**
 * Returns a valid access token for use in a Route Handler,
 * refreshing it first if it's expired or close to expiring.
 * Throws if there's no session or the refresh token is dead.
 */
export async function getValidAccessToken(): Promise<string> {
  const { accessToken, refreshToken, expiresAt } = await getAuthCookies();

  if (!accessToken || !refreshToken) {
    throw new Error("NO_SESSION");
  }

  const isExpiringSoon = Date.now() > expiresAt - REFRESH_BUFFER_MS;

  if (!isExpiringSoon) {
    return accessToken;
  }

  try {
    const tokens = await authService.refreshToken(refreshToken);
    await setAuthCookies(tokens);
    return tokens.access_token;
  } catch {
    await clearAuthCookies();
    throw new Error("SESSION_EXPIRED");
  }
}