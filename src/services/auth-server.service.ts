"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function registerAction(data: {
  email: string;
  name: string;
  password: string;
}) {
  const { email, name, password } = data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Usuário já cadastrado com este e-mail.");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

export async function createPasswordResetTokenAction(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  // Generate a unique token
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour expiry

  // Delete existing tokens for this user
  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id },
  });

  // Save the new token
  await prisma.passwordResetToken.create({
    data: {
      token,
      expiresAt,
      userId: user.id,
    },
  });

  return { token, name: user.name };
}

export async function resetPasswordAction(data: {
  token: string;
  password: string;
}) {
  const { token, password } = data;

  // Find the token and check if it's still valid
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    throw new Error("Token de recuperação inválido ou expirado.");
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update user's password
  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword },
  });

  // Delete the token used
  await prisma.passwordResetToken.delete({
    where: { id: resetToken.id },
  });

  return { success: true };
}
