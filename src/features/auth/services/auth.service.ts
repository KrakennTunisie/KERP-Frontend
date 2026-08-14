import { jwtDecode } from "jwt-decode";
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

interface KeycloakAccessTokenPayload {
  sub: string;
  preferred_username: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [clientId: string]: {
      roles: string[];
    };
  };
}

class AuthService {
  private readonly keycloakUrl = process.env.KEYCLOAK_URL!;
  private readonly realm = process.env.KEYCLOAK_REALM!;
  private readonly clientId = process.env.KEYCLOAK_CLIENT_ID!;
  private readonly clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;

  async login(credentials: LoginRequest): Promise<KeycloakTokenResponse> {
    const body = new URLSearchParams({
      grant_type: "password",
      client_id: this.clientId,
      username: credentials.email,
      password: credentials.password,
      scope: "openid",
    });

    if (this.clientSecret) {
      body.append("client_secret", this.clientSecret);
    }

    const response = await fetch(
      `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    return response.json();
  }

  /**
   * Décode le JWT access_token pour en extraire l'utilisateur + ses rôles.
   * Ne fait PAS d'appel réseau — remplace getUserFromToken() basé sur /userinfo.
   */
  getUserFromAccessToken(accessToken: string): AuthUser {
    const decoded = jwtDecode<KeycloakAccessTokenPayload>(accessToken);
    const TECHNICAL_ROLES = new Set(["offline_access", "uma_authorization"]);

    // Rôles realm (ceux gérés via kerp-role-manager / realm_access)
    const realmRoles = decoded.realm_access?.roles ?? [];

    // Optionnel : si tu as aussi des rôles au niveau du client Keycloak
    const clientRoles = decoded.resource_access?.[this.clientId]?.roles ?? [];

    const roles = [...realmRoles, ...clientRoles].filter(
      (r) => !TECHNICAL_ROLES.has(r) && !r.startsWith("default-roles-")
    );
    return {
      id: decoded.sub,
      username: decoded.preferred_username,
      firstName: decoded.given_name ?? "",
      lastName: decoded.family_name ?? "",
      email: decoded.email ?? "",
      roles: roles,
    };
  }

  /**
   * Gardé si tu as besoin d'appeler /userinfo pour d'autres données
   * (mais ne plus s'appuyer dessus pour les rôles).
   */
  async getUserFromToken(accessToken: string): Promise<AuthUser> {
    const response = await fetch(
      `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/userinfo`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Unable to retrieve user");
    }

    const data = await response.json();

    // On garde le décodage du token pour les rôles, /userinfo ne les fournit pas
    const { roles } = this.getUserFromAccessToken(accessToken);

    return {
      id: data.sub,
      username: data.preferred_username,
      firstName: data.given_name,
      lastName: data.family_name,
      email: data.email,
      roles,
    };
  }

  async refreshToken(refreshToken: string): Promise<KeycloakTokenResponse> {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: this.clientId,
      refresh_token: refreshToken,
    });

    if (this.clientSecret) {
      body.append("client_secret", this.clientSecret);
    }

    const response = await fetch(
      `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    return response.json();
  }

  async logout(refreshToken: string): Promise<void> {
    const body = new URLSearchParams({
      client_id: this.clientId,
      refresh_token: refreshToken,
    });

    if (this.clientSecret) {
      body.append("client_secret", this.clientSecret);
    }

    const response = await fetch(
      `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/logout`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to logout from Keycloak");
    }
  }
}

export const authService = new AuthService();