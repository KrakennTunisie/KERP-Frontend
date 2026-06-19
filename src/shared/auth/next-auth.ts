// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: "frontend-client",
      clientSecret: "your-secret", 
      issuer: "http://localhost:8080/realms/kerp",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // ✅ Stocker le access_token Keycloak
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };