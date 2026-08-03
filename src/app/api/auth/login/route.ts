// src/app/api/auth/login/route.ts

import { authService } from "@/features/auth/services/auth.service";
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

    const tokens =
      await authService.login({
        email,
        password,
      });

    const user =
      await authService.getUserFromToken(
        tokens.access_token
      );

    const response =
      NextResponse.json({
        user,
      });

    response.cookies.set(
      "access_token",
      tokens.access_token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: tokens.expires_in,
      }
    );

    response.cookies.set(
      "refresh_token",
      tokens.refresh_token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: tokens.refresh_expires_in,
      }
    );

    return response;

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