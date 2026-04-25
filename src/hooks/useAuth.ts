"use client";

import { authService } from "@/services/auth.service";
import { User } from "@/types/auth.types";
import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  const user: User | null = session?.user
    ? {
        id: session.user.id as string,
        email: session.user.email as string,
        name: session.user.name as string,
      }
    : null;

  const isAuthenticated = status === "authenticated" && Boolean(session?.user);
  const isLoading = status === "loading";

  const login = async (email: string, password: string) => {
    await authService.login(email, password);
  };

  const logout = async () => {
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
