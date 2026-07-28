import type { NextAuthConfig } from 'next-auth';
import type { UserRole } from '@/models/User';
 /**
 * Edge-runtime-safe config: no Credentials provider, no database access,
 * no bcrypt. Middleware runs on the Edge runtime and cannot use any of
 * those, so it imports ONLY this file (via a separate NextAuth instance
 * in middleware.ts) instead of the full `auth.ts`.
 */
export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/register',
  },
  session: { strategy: 'jwt' as const, maxAge: 30 * 24 * 60 * 60 },
  providers: [], // Real providers are added in auth.ts (Node runtime only)
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      (token as any).id = user.id;
      (token as any).role = (user as { role?: UserRole }).role ?? "reader";
    }

    return token;
  },

  async session({ session, token }) {
    if (session.user) {
      session.user.id = (token as any).id;
      session.user.role = (token as any).role;
    }

    return session;
  },
},
} satisfies NextAuthConfig;
