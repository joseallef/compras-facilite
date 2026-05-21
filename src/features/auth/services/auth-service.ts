"use client";

import { signIn, signOut } from "next-auth/react";
import {
  createPasswordResetTokenAction,
  registerAction,
  resetPasswordAction,
} from "./auth-server-service";

export const authService = {
  async login(email: string, password: string) {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      if (result.error === "rate_limit" || result.code === "rate_limit") {
        throw new Error("Muitas tentativas de login. Tente novamente mais tarde.");
      }
      throw new Error("Erro ao fazer login. Verifique suas credenciais.");
    }

    return result;
  },

  async logout() {
    await signOut({ redirect: true, callbackUrl: "/login" });
  },

  async register(data: Parameters<typeof registerAction>[0]) {
    const result = await registerAction(data);
    if (!result.ok) {
      throw new Error(result.error);
    }
    return result.data;
  },

  async forgotPassword(email: string) {
    const result = await createPasswordResetTokenAction(email);
    if (!result.ok) {
      throw new Error(result.error);
    }
    return result.data;
  },

  async resetPassword(data: Parameters<typeof resetPasswordAction>[0]) {
    const result = await resetPasswordAction(data);
    if (!result.ok) {
      throw new Error(result.error);
    }
    return result.data;
  },
};
