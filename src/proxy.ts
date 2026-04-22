import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

/**
 * Proxy function for Next.js 16+ convention.
 * Replaces the deprecated middleware convention.
 */
export const proxy = auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;

  const isProtectedRoute = 
    nextUrl.pathname.startsWith("/lista") || 
    nextUrl.pathname.startsWith("/cadastro") || 
    nextUrl.pathname.startsWith("/edicao");

  const isAuthRoute = 
    nextUrl.pathname === "/login" || 
    nextUrl.pathname === "/register" || 
    nextUrl.pathname === "/forgot-password" || 
    nextUrl.pathname === "/reset-password";

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/lista", nextUrl));
  }

  return NextResponse.next();
});

// Export as default for compatibility with systems still looking for a default export
export default proxy;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
