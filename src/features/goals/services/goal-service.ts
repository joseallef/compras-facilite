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

export async function getGoals() {
  const userId = await requireUserId();
  try {
    return await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching goals:", error);
    return [];
  }
}

export async function createGoal(data: {
  title: string;
  targetAmount: number;
  currentAmount?: number;
  deadline?: Date;
}) {
  const userId = await requireUserId();
  try {
    const goal = await prisma.goal.create({
      data: {
        ...data,
        userId,
      },
    });
    revalidatePath("/goals");
    return goal;
  } catch (error) {
    console.error("Error creating goal:", error);
    throw new Error("Failed to create goal");
  }
}

export async function updateGoal(
  id: string,
  data: Partial<{
    title: string;
    targetAmount: number;
    currentAmount: number;
    deadline: Date | null;
  }>
) {
  const userId = await requireUserId();
  try {
    const goal = await prisma.goal.update({
      where: { id, userId },
      data,
    });
    revalidatePath("/goals");
    return goal;
  } catch (error) {
    console.error("Error updating goal:", error);
    throw new Error("Failed to update goal");
  }
}

export async function deleteGoal(id: string) {
  const userId = await requireUserId();
  try {
    await prisma.goal.delete({
      where: { id, userId },
    });
    revalidatePath("/goals");
  } catch (error) {
    console.error("Error deleting goal:", error);
    throw new Error("Failed to delete goal");
  }
}
