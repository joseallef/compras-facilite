"use server";

import { auth } from "@/core/auth/auth";
import { prisma } from "@/core/db/prisma";
import { revalidatePath } from "next/cache";

async function requireUserId() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

export async function getCards() {
  const userId = await requireUserId();
  try {
    return await prisma.card.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching cards:", error);
    return [];
  }
}

export async function createCard(data: {
  name: string;
  bank: string;
  limit: number;
  closingDay: number;
  dueDay: number;
  color?: string;
  icon?: string;
}) {
  const userId = await requireUserId();
  try {
    const card = await prisma.card.create({
      data: {
        ...data,
        userId,
      },
    });
    revalidatePath("/cards");
    return card;
  } catch (error) {
    console.error("Error creating card:", error);
    throw new Error("Failed to create card");
  }
}

export async function updateCard(
  id: string,
  data: Partial<{
    name: string;
    bank: string;
    limit: number;
    closingDay: number;
    dueDay: number;
    color: string | null;
    icon: string | null;
  }>
) {
  const userId = await requireUserId();
  try {
    const card = await prisma.card.update({
      where: { id, userId },
      data,
    });
    revalidatePath("/cards");
    return card;
  } catch (error) {
    console.error("Error updating card:", error);
    throw new Error("Failed to update card");
  }
}

export async function deleteCard(id: string) {
  const userId = await requireUserId();
  try {
    await prisma.card.delete({
      where: { id, userId },
    });
    revalidatePath("/cards");
  } catch (error) {
    console.error("Error deleting card:", error);
    throw new Error("Failed to delete card");
  }
}
