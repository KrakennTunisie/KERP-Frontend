import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: "kerp-frontend",
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? "",
      issuer: "http://localhost:8080/realms/kerp",
    }),

   
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const response = await fetch(
          "http://localhost:8080/realms/kerp/protocol/openid-connect/token",
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              grant_type: "password",
              client_id: "kerp-frontend",
              username: credentials?.username ?? "",
              password: credentials?.password ?? "",
            }),
          }
        );

        const tokens = await response.json();
        if (!response.ok) return null;

        return {
          id: credentials?.username ?? "",
          accessToken: tokens.access_token,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      if (user) token.accessToken = (user as any).accessToken;
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },

  events: {
    async signOut({ token }) {
      if (token?.refreshToken) {
        await fetch(
          "http://localhost:8080/realms/kerp/protocol/openid-connect/logout",
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: "kerp-frontend",
              refresh_token: token.refreshToken as string ?? "",
            }),
          }
        );
      }
    },
  },

  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };  