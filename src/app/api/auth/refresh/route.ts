// src/app/api/auth/refresh/route.ts

import { authService } from "@/features/auth/services/auth.service";
import { setAuthCookies, getAuthCookies, clearAuthCookies } from "@/shared/utils/cookies";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { refreshToken } = await getAuthCookies();

    if (!refreshToken) {
      return NextResponse.json(
        { message: "No refresh token" },
        { status: 401 }
      );
    }

    const tokens = await authService.refreshToken(refreshToken);

    await setAuthCookies(tokens);

    const user = authService.getUserFromAccessToken(tokens.access_token);

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Token refresh failed:", error);

    // Le refresh token est invalide/expiré : on nettoie les cookies
    await clearAuthCookies();

    return NextResponse.json(
      { message: "Session expired" },
      { status: 401 }
    );
  }
}