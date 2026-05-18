"use server";

import { requireValidSession } from "@/core/auth/server-utils";
import { prisma } from "@/core/db/prisma";
import { FrequencyType, TransactionStatus, TransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function ensureMonthlyTransactions(userId: string, month: number, year: number) {
  try {
    const activeRecurrings = await prisma.recurringTransaction.findMany({
      where: {
        userId,
        active: true,
      },
    });

    const existingTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        competencyMonth: month,
        competencyYear: year,
        recurringTransactionId: { not: null },
      },
      select: { recurringTransactionId: true },
    });

    const existingRecurringIds = new Set(
      existingTransactions.map((t) => t.recurringTransactionId)
    );

    const transactionsToCreate = [];

    for (const recurring of activeRecurrings) {
      if (!existingRecurringIds.has(recurring.id)) {
        let dueDate = null;
        if (recurring.dueDay) {
          dueDate = new Date(year, month, recurring.dueDay);
        }

        transactionsToCreate.push({
          recurringTransactionId: recurring.id,
          title: recurring.title,
          amount: recurring.defaultAmount,
          type: recurring.type,
          status: TransactionStatus.PENDING,
          competencyMonth: month,
          competencyYear: year,
          dueDate,
          userId: recurring.userId,
          categoryId: recurring.categoryId,
        });
      }
    }

    if (transactionsToCreate.length > 0) {
      await prisma.transaction.createMany({
        data: transactionsToCreate,
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/financas");
  } catch (error) {
    console.error("Error ensuring monthly transactions:", error);
  }
}

export async function createRecurring(data: {
  title: string;
  description?: string;
  type: TransactionType;
  categoryId?: string;
  defaultAmount: number;
  frequency: FrequencyType;
  dueDay?: number;
}) {
  const userId = await requireValidSession();

  const finalData = { ...data };

  if (finalData.type === TransactionType.INVESTMENT && !finalData.categoryId) {
    let investmentCategory = await prisma.transactionCategory.findFirst({
      where: {
        userId,
        name: "Aplicações/Investimentos",
        type: TransactionType.INVESTMENT,
      },
    });

    if (!investmentCategory) {
      investmentCategory = await prisma.transactionCategory.create({
        data: {
          name: "Aplicações/Investimentos",
          type: TransactionType.INVESTMENT,
          icon: "TrendingUp",
          color: "#059669",
          userId,
        },
      });
    }

    finalData.categoryId = investmentCategory.id;
  }

  try {
    const recurring = await prisma.recurringTransaction.create({
      data: {
        ...(finalData as any),
        startDate: new Date(),
        userId,
      },
    });

    const now = new Date();
    await ensureMonthlyTransactions(userId, now.getMonth(), now.getFullYear());

    return recurring;
  } catch (error) {
    console.error("Error creating recurring:", error);
    throw new Error("Failed to create recurring transaction");
  }
}

export async function updateRecurring(
  id: string,
  data: Partial<{
    title: string;
    description?: string;
    type: TransactionType;
    categoryId?: string;
    defaultAmount: number;
    frequency: FrequencyType;
    dueDay?: number;
    active: boolean;
  }>
) {
  const userId = await requireValidSession();
  try {
    return await prisma.recurringTransaction.update({
      where: { id, userId },
      data,
    });
  } catch (error) {
    console.error("Error updating recurring:", error);
    throw new Error("Failed to update recurring transaction");
  }
}

export async function getRecurrings() {
  const userId = await requireValidSession();
  try {
    return await prisma.recurringTransaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching recurrings:", error);
    return [];
  }
}

export async function getRecurringById(id: string) {
  const userId = await requireValidSession();
  try {
    return await prisma.recurringTransaction.findUnique({
      where: { id, userId },
      include: { category: true },
    });
  } catch (error) {
    console.error("Error fetching recurring by id:", error);
    return null;
  }
}

export async function deleteRecurring(id: string) {
  const userId = await requireValidSession();
  try {
    await prisma.recurringTransaction.delete({
      where: { id, userId },
    });
    revalidatePath("/dashboard");
    revalidatePath("/financas");
  } catch (error) {
    console.error("Error deleting recurring:", error);
    throw new Error("Failed to delete recurring transaction");
  }
}
