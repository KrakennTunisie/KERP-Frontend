// src/app/api/auth/me/route.ts

import { authService } from "@/features/auth/services/auth.service";
import { getValidAccessToken } from "@/shared/utils/getValidAccessToken";
import { clearAuthCookies } from "@/shared/utils/cookies";
import { NextResponse } from "next/server";

export async function GET() {
  let accessToken: string;

  try {
    accessToken = await getValidAccessToken();
  } catch {
    // NO_SESSION or SESSION_EXPIRED — either way, no valid session
    return NextResponse.json(
      { message: "Unauthenticated" },
      { status: 401 }
    );
  }

  try {
    const user = await authService.getUserFromToken(accessToken);
    return NextResponse.json({ user });
  } catch {
    // access token was accepted by getValidAccessToken but Keycloak
    // rejected it at userinfo — treat as dead session
    await clearAuthCookies();

    return NextResponse.json(
      { message: "Invalid token" },
      { status: 401 }
    );
  }
}