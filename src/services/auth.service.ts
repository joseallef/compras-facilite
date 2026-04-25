"use client";

import emailjs from "@emailjs/browser";
import { signIn, signOut } from "next-auth/react";
import {
  createPasswordResetTokenAction,
  registerAction,
  resetPasswordAction,
} from "./auth-server.service";

export const authService = {
  async login(email: string, password: string) {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    return result;
  },

  async logout() {
    await signOut({ callbackUrl: "/login" });
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

    const { token, name } = result.data;
    if (!token) {
      return { success: true };
    }

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      throw new Error("Configuração de e-mail não definida.");
    }

    const resetLink = `${window.location.origin}/reset-password?token=${token}`;

    const templateParams = {
      to_name: name || email.split("@")[0],
      to_email: email,
      reset_link: resetLink,
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      return { success: true };
    } catch (error) {
      console.error("Error sending email via EmailJS:", error);
      throw new Error("Erro ao enviar e-mail de recuperação.");
    }
  },

  async resetPassword(data: Parameters<typeof resetPasswordAction>[0]) {
    const result = await resetPasswordAction(data);
    if (!result.ok) {
      throw new Error(result.error);
    }
    return result.data;
  },
};
