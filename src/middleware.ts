import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/lib/auth.config';

/**
 * Middleware runs on the Edge runtime, so it builds its own lightweight
 * NextAuth instance from the edge-safe `authConfig` only — it must NOT
 * import the full `auth.ts` (which pulls in mongoose/bcrypt/dns and breaks
 * the Edge bundle).
 */
const { auth } = NextAuth(authConfig);

const ADMIN_ONLY_PATHS = ['/admin/users', '/admin/settings'];
const STAFF_PATHS_PREFIX = '/admin';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isStaffRoute = nextUrl.pathname.startsWith(STAFF_PATHS_PREFIX);
  const isAdminOnlyRoute = ADMIN_ONLY_PATHS.some((p) => nextUrl.pathname.startsWith(p));

  if (isStaffRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', nextUrl.origin);
      loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    const allowedStaffRoles = ['admin', 'editor', 'author'];
    if (!role || !allowedStaffRoles.includes(role)) {
      return NextResponse.redirect(new URL('/', nextUrl.origin));
    }

    if (isAdminOnlyRoute && role !== 'admin') {
      return NextResponse.redirect(new URL('/admin', nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*'],
};
