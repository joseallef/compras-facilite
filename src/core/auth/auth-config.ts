import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], // Empty providers list, implemented in auth.ts
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      
      const now = Math.floor(Date.now() / 1000);
      const maxAge = 60 * 60 * 24; // 1 dia em segundos (padrão)
      
      if (!token.iat) {
        token.iat = now;
      }
      
      token.exp = token.iat + maxAge;
      
      return token;
    },
    async session({ session, token }) {
      if (!token.id || !token.email) {
        return { ...session, user: null };
      }
      
      const now = Math.floor(Date.now() / 1000);
      if (token.exp && token.exp < now) {
        return { ...session, user: null };
      }
      
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 dia (padrão)
  },
  jwt: {
    maxAge: 60 * 60 * 24, // 1 dia (padrão)
  },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;
