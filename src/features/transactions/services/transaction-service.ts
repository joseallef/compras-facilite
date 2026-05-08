"use server";

import { auth } from "@/core/auth/auth";
import { prisma } from "@/core/db/prisma";
import { TransactionStatus, TransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function requireUserId() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

export async function getTransactions(filters?: {
  month?: number;
  year?: number;
  startDate?: Date;
  endDate?: Date;
  type?: TransactionType;
  categoryId?: string;
  cardId?: string;
}) {
  const userId = await requireUserId();
  const { month, year, startDate, endDate, type, categoryId, cardId } = filters || {};

  const where: any = { userId };

  if (type) where.type = type;
  if (categoryId) where.categoryId = categoryId;
  if (cardId) where.cardId = cardId;

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = startDate;
    if (endDate) where.date.lte = endDate;
  } else if (month !== undefined && year !== undefined) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    where.date = {
      gte: start,
      lte: end,
    };
  }

  try {
    return await prisma.transaction.findMany({
      where,
      include: {
        category: true,
        card: true,
      },
      orderBy: { date: "desc" },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

export async function createTransaction(data: {
  description: string;
  amount: number;
  date: Date;
  type: TransactionType;
  categoryId: string;
  cardId?: string;
  status?: TransactionStatus;
  isRecurring?: boolean;
  observation?: string;
  shoppingListId?: string;
}) {
  const userId = await requireUserId();

  try {
    const transaction = await prisma.transaction.create({
      data: {
        description: data.description,
        amount: data.amount,
        date: data.date,
        type: data.type,
        categoryId: data.categoryId,
        userId: userId,
        cardId: data.cardId || null,
        status: data.status || TransactionStatus.COMPLETED,
        isRecurring: data.isRecurring || false,
        observation: data.observation || null,
        shoppingListId: data.shoppingListId || null,
      },
    });
    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    return transaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw new Error("Failed to create transaction");
  }
}

export async function updateTransaction(
  id: string,
  data: Partial<{
    description: string;
    amount: number;
    date: Date;
    type: TransactionType;
    categoryId: string;
    cardId: string | null;
    status: TransactionStatus;
    isRecurring: boolean;
    observation: string | null;
  }>
) {
  const userId = await requireUserId();

  try {
    const transaction = await prisma.transaction.update({
      where: { id, userId },
      data: {
        description: data.description,
        amount: data.amount,
        date: data.date,
        type: data.type,
        categoryId: data.categoryId,
        cardId: data.cardId === undefined ? undefined : (data.cardId || null),
        status: data.status,
        isRecurring: data.isRecurring,
        observation: data.observation === undefined ? undefined : (data.observation || null),
      },
    });
    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    return transaction;
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw new Error("Failed to update transaction");
  }
}

export async function deleteTransaction(id: string) {
  const userId = await requireUserId();

  try {
    await prisma.transaction.delete({
      where: { id, userId },
    });
    revalidatePath("/dashboard");
    revalidatePath("/transactions");
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw new Error("Failed to delete transaction");
  }
}

export async function createDefaultTransactionCategories(userId: string) {
  const defaultCategories = [
    { name: "Salário", type: TransactionType.INCOME, icon: "Wallet", color: "#10b981" },
    { name: "Renda Extra", type: TransactionType.INCOME, icon: "PlusCircle", color: "#34d399" },
    { name: "Alimentação", type: TransactionType.EXPENSE, icon: "Utensils", color: "#ef4444" },
    { name: "Moradia", type: TransactionType.EXPENSE, icon: "Home", color: "#3b82f6" },
    { name: "Transporte", type: TransactionType.EXPENSE, icon: "Car", color: "#f59e0b" },
    { name: "Lazer", type: TransactionType.EXPENSE, icon: "Gamepad", color: "#8b5cf6" },
    { name: "Mercado", type: TransactionType.EXPENSE, icon: "ShoppingCart", color: "#10b981" },
    { name: "Saúde", type: TransactionType.EXPENSE, icon: "Heart", color: "#ec4899" },
  ];

  try {
    await prisma.transactionCategory.createMany({
      data: defaultCategories.map(cat => ({
        ...cat,
        userId,
      })),
      skipDuplicates: true,
    });
  } catch (error) {
    console.error("Error creating default categories:", error);
  }
}

export async function getTransactionCategories(type?: TransactionType) {
  const userId = await requireUserId();
  try {
    let categories = await prisma.transactionCategory.findMany({
      where: {
        userId,
        ...(type ? { type } : {}),
      },
      orderBy: { name: "asc" },
    });

    // Se não houver categorias, cria as padrões e busca novamente
    if (categories.length === 0) {
      await createDefaultTransactionCategories(userId);
      categories = await prisma.transactionCategory.findMany({
        where: {
          userId,
          ...(type ? { type } : {}),
        },
        orderBy: { name: "asc" },
      });
    }

    return categories;
  } catch (error) {
    console.error("Error fetching transaction categories:", error);
    return [];
  }
}

export async function createTransactionCategory(data: {
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
}) {
  const userId = await requireUserId();
  try {
    return await prisma.transactionCategory.create({
      data: {
        ...data,
        userId,
      },
    });
  } catch (error) {
    console.error("Error creating transaction category:", error);
    throw new Error("Failed to create category");
  }
}
