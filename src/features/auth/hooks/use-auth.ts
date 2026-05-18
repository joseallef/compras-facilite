"use client";

import { authService } from "@/features/auth/services/auth-service";
import { User } from "@/features/auth/types/auth-types";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

function isValidUser(user: any): user is User {
  return !!user?.id && !!user?.email;
}

const MANUAL_LOGOUT_KEY = "auth:manual-logout-in-progress";

export function useAuth() {
  const { data: session, status } = useSession();
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const searchParams = useSearchParams();
  const wasAuthenticated = useRef(false);
  const redirectInProgress = useRef(false);
  const isMounted = useRef(true);

  const user: User | null =
    session?.user && isValidUser(session.user)
      ? {
          id: session.user.id as string,
          email: session.user.email as string,
          name: session.user.name as string,
        }
      : null;

  const isAuthenticated = status === "authenticated" && isValidUser(session?.user);
  const isLoading = status === "loading";

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const manualLogoutInProgress = sessionStorage.getItem(MANUAL_LOGOUT_KEY) === "true";
    
    if (manualLogoutInProgress) {
      return;
    }

    if (isLoading || redirectInProgress.current || !isMounted.current) {
      return;
    }

    if (!isAuthenticated) {
      const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/auth/error"];
      const isPublicRoute = publicRoutes.includes(pathname);
      
      if (!isPublicRoute) {
        redirectInProgress.current = true;
        handleRedirectToLogin();
      }
    } else {
      wasAuthenticated.current = true;
      redirectInProgress.current = false;
      sessionStorage.removeItem(MANUAL_LOGOUT_KEY);
    }
  }, [isAuthenticated, isLoading, pathname]);

  const handleRedirectToLogin = async () => {
    const manualLogoutInProgress = sessionStorage.getItem(MANUAL_LOGOUT_KEY) === "true";
    
    if (manualLogoutInProgress) {
      redirectInProgress.current = false;
      return;
    }
    
    if (pathname === "/login") {
      redirectInProgress.current = false;
      return;
    }
    
    const loginUrl = new URL("/login", window.location.origin);
    const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/auth/error"];
    const isPublicRoute = publicRoutes.includes(pathname);
    
    if (!isPublicRoute) {
      loginUrl.searchParams.set("callbackUrl", pathname);
    }
    
    if (wasAuthenticated.current) {
      toast.warning("Sua sessão expirou. Por favor, faça login novamente.");
      loginUrl.searchParams.set("session", "expired");
    }
    
    router.replace(loginUrl.toString());
  };

  const login = async (email: string, password: string) => {
    await authService.login(email, password);
  };

  const logout = async () => {
    sessionStorage.setItem(MANUAL_LOGOUT_KEY, "true");
    wasAuthenticated.current = false;
    redirectInProgress.current = true;
    await authService.logout();
  };

  const register = async (data: Parameters<typeof authService.register>[0]) => {
    await authService.register(data);
  };

  const forgotPassword = async (email: string) => {
    await authService.forgotPassword(email);
  };

  const resetPassword = async (data: Parameters<typeof authService.resetPassword>[0]) => {
    await authService.resetPassword(data);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
  };
}
