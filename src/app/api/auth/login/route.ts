// src/app/api/auth/login/route.ts

import { authService } from "@/features/auth/services/auth.service";
import { setAuthCookies } from "@/shared/utils/cookies";
import { NextRequest, NextResponse } from "next/server";


export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();
    
    const {
      email,
      password,
    } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          message:
            "Username and password are required",
        },
        {
          status: 400,
        }
      );
    }

    const tokens = await authService.login({ email, password });

    const user = await authService.getUserFromToken(tokens.access_token);

    await setAuthCookies(tokens);

    return NextResponse.json({ user });

  } catch (error) {

    console.error(
      "Login failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Invalid username or password",
      },
      {
        status: 401,
      }
    );
  }
}