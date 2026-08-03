import {
NextRequest,
NextResponse,
} from "next/server";

import {
authService,
} from "@/features/auth/services/auth.service";

export async function POST(
  request: NextRequest
  ) {
    try {

    const refreshToken =
      request.cookies.get(
        "refresh_token"
      )?.value;

    if (refreshToken) {

      try {

        await authService.logout(
          refreshToken
        );

      } catch (error) {

        // Keycloak logout failure should
        // not prevent local cookie cleanup.
        console.error(
          "Keycloak logout failed:",
          error
        );
      }
    }

    const response =
      NextResponse.json({
        success: true,
      });

    // Delete access token
    response.cookies.delete(
      "access_token"
    );

    // Delete refresh token
    response.cookies.delete(
      "refresh_token"
    );

    return response;

    } catch (error) {

    console.error(
      "Logout error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Logout failed",
      },
      {
        status: 500,
      }
    );

  }
}
