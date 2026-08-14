// src/lib/auth/cookies.ts
import { cookies } from "next/headers";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function setAuthCookies(tokens: {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}) {
  const store = await cookies();
  const expiresAt = Date.now() + tokens.expires_in * 1000;

  store.set("access_token", tokens.access_token, {
    ...COOKIE_OPTS,
    maxAge: tokens.expires_in,
  });

  store.set("refresh_token", tokens.refresh_token, {
    ...COOKIE_OPTS,
    maxAge: tokens.refresh_expires_in,
  });

  store.set("expires_at", String(expiresAt), {
    ...COOKIE_OPTS,
    maxAge: tokens.refresh_expires_in,
  });
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete("access_token");
  store.delete("refresh_token");
  store.delete("expires_at");
}

export async function getAuthCookies() {
  const store = await cookies();
  return {
    accessToken: store.get("access_token")?.value ?? null,
    refreshToken: store.get("refresh_token")?.value ?? null,
    expiresAt: Number(store.get("expires_at")?.value ?? 0),
  };
}