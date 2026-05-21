"use server";

import { requireValidSession } from "@/core/auth/server-utils";
import { prisma } from "@/core/db/prisma";
import { consumeRateLimit, getClientIp } from "@/core/security/rate-limit";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function getPasswordPepper() {
  const pepper = process.env.PASSWORD_PEPPER ?? "";
  if (process.env.NODE_ENV === "production" && pepper.length === 0) {
    throw new Error("PASSWORD_PEPPER não definido.");
  }
  return pepper;
}

function getBcryptRounds() {
  const raw = process.env.BCRYPT_ROUNDS;
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  if (Number.isFinite(parsed) && parsed >= 10 && parsed <= 20) {
    return parsed;
  }
  return process.env.NODE_ENV === "production" ? 14 : 10;
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function hashResetToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getAppUrl() {
  const direct =
    process.env.APP_URL ??
    process.env.NEXTAUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "";

  if (direct) return direct.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`.replace(/\/$/, "");

  return "http://localhost:3000";
}

function getEmailJsConfig() {
  const serviceId =
    process.env.EMAILJS_SERVICE_ID ?? process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
  const templateId =
    process.env.EMAILJS_TEMPLATE_ID ?? process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
  const publicKey =
    process.env.EMAILJS_PUBLIC_KEY ?? process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

  if (!serviceId || !templateId || !publicKey) {
    throw new Error("Configuração de e-mail não definida.");
  }

  return { serviceId, templateId, publicKey };
}

async function sendPasswordResetEmail(params: { toEmail: string; toName: string; token: string }) {
  const { serviceId, templateId, publicKey } = getEmailJsConfig();
  const resetLink = `${getAppUrl()}/reset-password?token=${params.token}`;

  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        to_name: params.toName,
        to_email: params.toEmail,
        reset_link: resetLink,
      },
    }),
  });

  if (!res.ok) {
    throw new Error("Falha ao enviar e-mail de recuperação.");
  }
}

export async function registerAction(data: {
  email: string;
  name: string;
  password: string;
}): Promise<ActionResult<{ id: string; email: string; name: string | null }>> {
  const email = normalizeEmail(data.email);
  const name = data.name.trim();
  const password = data.password;

  const ip = await getClientIp();
  const limitResult = await consumeRateLimit({
    key: `register:${ip}`,
    limit: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
  });

  if (!limitResult.allowed) {
    return { ok: false, error: "Muitas tentativas de cadastro. Tente novamente mais tarde." };
  }

  try {
    if (!name) return { ok: false, error: "Informe seu nome." };
    if (name.length < 2) return { ok: false, error: "O nome deve ter pelo menos 2 caracteres." };
    if (!email) return { ok: false, error: "Informe seu e-mail." };
    if (!isValidEmail(email)) return { ok: false, error: "Digite um e-mail válido." };
    if (!password) return { ok: false, error: "Crie uma senha." };
    if (password.length < 6) return { ok: false, error: "A senha deve ter pelo menos 6 caracteres." };
    if (password.length > 200) return { ok: false, error: "A senha é muito longa." };

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { ok: false, error: "Usuário já cadastrado com este e-mail." };
    }

    const hashedPassword = await bcrypt.hash(
      `${password}${getPasswordPepper()}`,
      getBcryptRounds()
    );

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return { ok: true, data: { id: user.id, email: user.email, name: user.name } };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, error: "Usuário já cadastrado com este e-mail." };
    }

    return { ok: false, error: "Erro ao criar conta. Tente novamente." };
  }
}

export async function createPasswordResetTokenAction(
  email: string
): Promise<ActionResult<{ success: true }>> {
  const ip = await getClientIp();

  try {
    const normalizedEmail = normalizeEmail(email);

    const ipLimit = await consumeRateLimit({
      key: `forgot-password:ip:${ip}`,
      limit: 3,
      windowMs: 60 * 60 * 1000,
    });

    if (!ipLimit.allowed) {
      return { ok: false, error: "Muitas solicitações de recuperação. Tente novamente mais tarde." };
    }

    const emailLimit = await consumeRateLimit({
      key: `forgot-password:email:${normalizedEmail}`,
      limit: 3,
      windowMs: 60 * 60 * 1000,
    });

    if (!emailLimit.allowed) {
      return { ok: false, error: "Muitas solicitações de recuperação. Tente novamente mais tarde." };
    }
    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      return { ok: true, data: { success: true } };
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return { ok: true, data: { success: true } };
    }

    const lastToken = await prisma.passwordResetToken.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });

    if (lastToken && Date.now() - lastToken.createdAt.getTime() < 2 * 60 * 1000) {
      return { ok: true, data: { success: true } };
    }

    const rawToken = uuidv4();
    const tokenHash = hashResetToken(rawToken);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    await prisma.passwordResetToken.create({
      data: {
        token: tokenHash,
        expiresAt,
        userId: user.id,
      },
    });

    try {
      await sendPasswordResetEmail({
        toEmail: user.email,
        toName: user.name || user.email.split("@")[0],
        token: rawToken,
      });
    } catch (error) {
      await prisma.passwordResetToken.deleteMany({
        where: { userId: user.id, token: tokenHash },
      });
      throw error;
    }

    return { ok: true, data: { success: true } };
  } catch {
    return { ok: false, error: "Erro ao solicitar recuperação. Tente novamente." };
  }
}

export async function resetPasswordAction(data: {
  token: string;
  password: string;
}): Promise<ActionResult<{ success: true }>> {
  const { token, password } = data;

  const ip = await getClientIp();
  const limitResult = await consumeRateLimit({
    key: `reset-password:${ip}`,
    limit: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  });

  if (!limitResult.allowed) {
    return { ok: false, error: "Muitas tentativas de redefinição. Tente novamente mais tarde." };
  }

  try {
    if (!token) return { ok: false, error: "Token de recuperação inválido ou expirado." };
    if (!password) return { ok: false, error: "Crie uma nova senha." };
    if (password.length < 6) return { ok: false, error: "A senha deve ter pelo menos 6 caracteres." };
    if (password.length > 200) return { ok: false, error: "A senha é muito longa." };

    const tokenHash = hashResetToken(token);
    let resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: tokenHash },
      include: { user: true },
    });

    if (!resetToken) {
      resetToken = await prisma.passwordResetToken.findUnique({
        where: { token },
        include: { user: true },
      });
    }

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return { ok: false, error: "Token de recuperação inválido ou expirado." };
    }

    const hashedPassword = await bcrypt.hash(
      `${password}${getPasswordPepper()}`,
      getBcryptRounds()
    );

    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    return { ok: true, data: { success: true } };
  } catch {
    return { ok: false, error: "Erro ao redefinir senha. Tente novamente." };
  }
}

export async function updateProfileAction(data: {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}): Promise<ActionResult<{ success: true }>> {
  const userId = await requireValidSession();
  
  const ip = await getClientIp();
  const limitResult = await consumeRateLimit({
    key: `update-profile:${ip}:${userId}`,
    limit: 10,
    windowMs: 15 * 60 * 1000, // 15 minutes
  });

  if (!limitResult.allowed) {
    return { ok: false, error: "Muitas tentativas de atualização. Tente novamente mais tarde." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { ok: false, error: "Usuário não encontrado." };
    }

    const updateData: any = {};

    if (data.name !== undefined && data.name.length > 0) {
      updateData.name = data.name;
    }

    if (data.newPassword && data.newPassword.length > 0) {
      if (!data.currentPassword || data.currentPassword.length === 0) {
        return { ok: false, error: "Senha atual é obrigatória para alterar a senha." };
      }
      
      const isValid = await bcrypt.compare(
        `${data.currentPassword}${getPasswordPepper()}`,
        user.password
      );
      
      if (!isValid) {
        return { ok: false, error: "Credenciais inválidas." };
      }

      const hashedNewPassword = await bcrypt.hash(
        `${data.newPassword}${getPasswordPepper()}`,
        getBcryptRounds()
      );
      updateData.password = hashedNewPassword;
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return { ok: true, data: { success: true } };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, error: "E-mail já está em uso." };
    }
    return { ok: false, error: "Erro ao atualizar perfil. Tente novamente." };
  }
}

