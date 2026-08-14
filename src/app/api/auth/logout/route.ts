// src/app/api/auth/logout/route.ts

import { NextResponse } from "next/server";
import { authService } from "@/features/auth/services/auth.service";
import { getAuthCookies, clearAuthCookies } from "@/shared/utils/cookies";

export async function POST() {
  try {
    const { refreshToken } = await getAuthCookies();

    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch (error) {
        // Keycloak logout failure should not prevent local cookie cleanup.
        console.error("Keycloak logout failed:", error);
      }
    }

    await clearAuthCookies();

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      { message: "Logout failed" },
      { status: 500 }
    );
  }
}