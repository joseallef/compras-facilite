"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
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

export async function registerAction(data: {
  email: string;
  name: string;
  password: string;
}): Promise<ActionResult<{ id: string; email: string; name: string | null }>> {
  const { email, name, password } = data;

  try {
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
): Promise<ActionResult<{ token: string | null; name: string | null }>> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { ok: true, data: { token: null, name: null } };
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    await prisma.passwordResetToken.create({
      data: {
        token,
        expiresAt,
        userId: user.id,
      },
    });

    return { ok: true, data: { token, name: user.name } };
  } catch {
    return { ok: false, error: "Erro ao solicitar recuperação. Tente novamente." };
  }
}

export async function resetPasswordAction(data: {
  token: string;
  password: string;
}): Promise<ActionResult<{ success: true }>> {
  const { token, password } = data;

  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

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
