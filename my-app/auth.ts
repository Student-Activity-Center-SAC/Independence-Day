import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    MicrosoftEntraID({
      id: "microsoft",
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID ?? "common"}/v2.0`,
    }),
  ],
  callbacks: {
    signIn({ user }) {
      return user.email?.endsWith("@kluniversity.in") ?? false;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
    jwt({ token }) {
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
