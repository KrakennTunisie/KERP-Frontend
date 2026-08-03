import { AuthUser } from "../types/authUser";
import { LoginRequest } from "../types/loginRequest";

interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  session_state?: string;
}

class AuthService {
  private readonly keycloakUrl =
    process.env.KEYCLOAK_URL!;

  private readonly realm =
    process.env.KEYCLOAK_REALM!;

  private readonly clientId =
    process.env.KEYCLOAK_CLIENT_ID!;

  private readonly clientSecret =
    process.env.KEYCLOAK_CLIENT_SECRET;

  async login(
    credentials: LoginRequest
  ): Promise<KeycloakTokenResponse> {

    const body = new URLSearchParams({
      grant_type: "password",
      client_id: this.clientId,
      username: credentials.email,
      password: credentials.password,
      scope: "openid",
    });

    if (this.clientSecret) {
      body.append(
        "client_secret",
        this.clientSecret
      );
    }

    const response = await fetch(
      `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body,
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.log(response)

      throw new Error("Invalid credentials");
    }

    return response.json();
  }

  async getUserFromToken(
    accessToken: string
  ): Promise<AuthUser> {

    const response = await fetch(
      `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Unable to retrieve user");
    }

    const data = await response.json();

    return {
      id: data.sub,
      username: data.preferred_username,
      firstName: data.given_name,
      lastName: data.family_name,
      email: data.email,
      roles: [],
    };
  }


  async logout(
        refreshToken: string
    ): Promise<void> {

        const body = new URLSearchParams({
        client_id: this.clientId,
        refresh_token: refreshToken,
        });

        if (this.clientSecret) {
        body.append(
            "client_secret",
            this.clientSecret
        );
        }

        const response = await fetch(
        `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/logout`,
        {
            method: "POST",

            headers: {
            "Content-Type":
                "application/x-www-form-urlencoded",
            },

            body,

            cache: "no-store",
        }
        );

        if (!response.ok) {
        throw new Error(
            "Failed to logout from Keycloak"
        );
        }

    }
}

export const authService = new AuthService();

/*  */