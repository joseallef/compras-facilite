import { authConfig } from "@/core/auth/auth-config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public|$).*)",
  ],
};

function isValidSession(auth: any) {
  if (!auth?.user?.id || !auth?.user?.email) {
    return false;
  }
  return true;
}

function hadSessionCookie(req: any) {
  const sessionCookie = req.cookies.get("next-auth.session-token");
  const secureSessionCookie = req.cookies.get("__Secure-next-auth.session-token");
  return !!sessionCookie || !!secureSessionCookie;
}

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const isLoggedIn = isValidSession(req.auth);
  const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/", "/auth/error"];
  const isPublicRoute = publicRoutes.some(
    (path) => req.nextUrl.pathname === path || 
              (path !== "/" && req.nextUrl.pathname.startsWith(path + "/"))
  );
  
  const protectedRoutes = ["/dashboard", "/mercado", "/financas"];
  const isProtectedRoute = protectedRoutes.some(
    (path) => req.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedRoute && !isLoggedIn) {
    const newUrl = new URL("/login", req.nextUrl.origin);
    const hasExpiredSession = hadSessionCookie(req);
    
    if (hasExpiredSession) {
      newUrl.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search);
      newUrl.searchParams.set("session", "expired");
    }
    
    const response = NextResponse.redirect(newUrl);
    
    response.cookies.delete("next-auth.session-token");
    response.cookies.delete("next-auth.csrf-token");
    response.cookies.delete("__Secure-next-auth.session-token");
    response.cookies.delete("__Secure-next-auth.csrf-token");
    
    return response;
  }

  if (isLoggedIn && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }
});
