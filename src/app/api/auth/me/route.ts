// src/app/api/auth/me/route.ts

import { authService } from "@/features/auth/services/auth.service";
import {
  NextRequest,
  NextResponse,
} from "next/server";



export async function GET(
  request: NextRequest
) {

  const accessToken =
    request.cookies.get(
      "access_token"
    )?.value;

  if (!accessToken) {

    return NextResponse.json(
      {
        message: "Unauthenticated",
      },
      {
        status: 401,
      }
    );
  }

  try {

    const user =
      await authService.getUserFromToken(
        accessToken
      );

    return NextResponse.json({
      user,
    });

  } catch {

    return NextResponse.json(
      {
        message: "Invalid token",
      },
      {
        status: 401,
      }
    );
  }
}