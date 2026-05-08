import { authConfig } from "@/core/auth/auth-config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = Boolean(req.auth?.user?.id);

  const isProtectedRoute = 
    nextUrl.pathname.startsWith("/shopping") || 
    nextUrl.pathname.startsWith("/dashboard") || 
    nextUrl.pathname.startsWith("/transactions") ||
    nextUrl.pathname.startsWith("/cards") ||
    nextUrl.pathname.startsWith("/goals");

  const isAuthRoute = 
    nextUrl.pathname.startsWith("/login") || 
    nextUrl.pathname.startsWith("/register") ||
    nextUrl.pathname.startsWith("/forgot-password") ||
    nextUrl.pathname.startsWith("/reset-password");

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/shopping", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml, etc.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|apple-icon.svg|icon.svg|og-image.png).*)",
  ],
};
