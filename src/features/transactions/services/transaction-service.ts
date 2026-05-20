"use server";

import { requireValidSession } from "@/core/auth/server-utils";
import { prisma } from "@/core/db/prisma";
import { TransactionStatus, TransactionType } from "@prisma/client";

export async function getTransactions(filters?: {
  month?: number;
  year?: number;
  type?: TransactionType;
  status?: TransactionStatus;
  categoryId?: string;
  isRecurring?: boolean;
}) {
  const userId = await requireValidSession();
  const { month, year, type, status, categoryId, isRecurring } = filters || {};

  const where: any = { userId };

  if (type) where.type = type;
  if (status) where.status = status;
  if (categoryId) where.categoryId = categoryId;
  if (isRecurring !== undefined) {
    if (isRecurring) {
      where.recurringTransactionId = { not: null };
    } else {
      where.recurringTransactionId = null;
    }
  }

  if (month !== undefined && year !== undefined) {
    where.competencyMonth = month;
    where.competencyYear = year;
  }

  try {
    let transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: true,
        recurringTransaction: true,
      },
      orderBy: [
        { updatedAt: "desc" },
        { status: "asc" },
        { dueDate: "asc" },
      ],
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const transactionsToUpdate = transactions.filter(
      (t) =>
        t.status === TransactionStatus.PENDING &&
        t.dueDate
    );

    for (const transaction of transactionsToUpdate) {
      const dueDate = new Date(transaction.dueDate!);
      dueDate.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        await prisma.transaction.update({
          where: { id: transaction.id, userId },
          data: { status: TransactionStatus.OVERDUE },
        });
      }
    }

    if (transactionsToUpdate.length > 0) {
      transactions = await prisma.transaction.findMany({
        where,
        include: {
          category: true,
          recurringTransaction: true,
        },
        orderBy: [
          { updatedAt: "desc" },
          { status: "asc" },
          { dueDate: "asc" },
        ],
      });
    }

    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

export async function createTransaction(data: {
  title: string;
  amount: number;
  type: TransactionType;
  status?: TransactionStatus;
  competencyMonth?: number;
  competencyYear?: number;
  categoryId?: string;
  notes?: string;
  dueDate?: Date;
  shoppingListId?: string;
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
          icon: "PiggyBank",
          color: "#059669",
          userId,
        },
      });
    }

    finalData.categoryId = investmentCategory.id;
  }

  try {
    if (!finalData.categoryId) {
      throw new Error("Categoria é obrigatória para criar a transação");
    }

    const referenceDate = finalData.dueDate || new Date();
    const competencyMonth = finalData.competencyMonth ?? referenceDate.getMonth();
    const competencyYear = finalData.competencyYear ?? referenceDate.getFullYear();

    const transaction = await prisma.transaction.create({
      data: {
        ...finalData,
        competencyMonth,
        competencyYear,
        categoryId: finalData.categoryId,
        userId,
        shoppingListId: finalData.shoppingListId,
      },
    });

    return transaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw new Error("Failed to create transaction");
  }
}

export async function updateTransaction(
  id: string,
  data: Partial<{
    title: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    competencyMonth?: number;
    competencyYear?: number;
    categoryId?: string;
    notes: string | null;
    dueDate: Date | null;
    paidAt: Date | null;
  }>
) {
  const userId = await requireValidSession();

  try {
    const updateData = { ...data };
    
    if (updateData.dueDate) {
      updateData.competencyMonth = updateData.competencyMonth ?? updateData.dueDate.getMonth();
      updateData.competencyYear = updateData.competencyYear ?? updateData.dueDate.getFullYear();
    }

    const transaction = await prisma.transaction.update({
      where: { id, userId },
      data: {
        ...updateData,
        paidAt: data.status === TransactionStatus.PAID ? new Date() : null,
      },
    });

    return transaction;
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw new Error("Failed to update transaction");
  }
}

export async function deleteTransaction(id: string) {
  const userId = await requireValidSession();

  try {
    await prisma.transaction.delete({
      where: { id, userId },
    });

  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw new Error("Failed to delete transaction");
  }
}

export async function getTransactionCategories(type?: TransactionType) {
  const userId = await requireValidSession();
  try {
    let categories = await prisma.transactionCategory.findMany({
      where: {
        userId,
        ...(type ? { type } : {}),
      },
      orderBy: { name: "asc" },
    });

    if (categories.length === 0) {
      await createDefaultTransactionCategories(userId);
      categories = await prisma.transactionCategory.findMany({
        where: {
          userId,
          ...(type ? { type } : {}),
        },
        orderBy: { name: "asc" },
      });
    } else {
      const existingNames = categories.map(c => c.name);
      const defaultCategories = [
        { name: "Salário", type: TransactionType.INCOME, icon: "Wallet", color: "#10b981" },
        { name: "Renda Extra", type: TransactionType.INCOME, icon: "PlusCircle", color: "#34d399" },
        { name: "Alimentação", type: TransactionType.EXPENSE, icon: "Utensils", color: "#ef4444" },
        { name: "Moradia", type: TransactionType.EXPENSE, icon: "Home", color: "#3b82f6" },
        { name: "Transporte", type: TransactionType.EXPENSE, icon: "Car", color: "#f59e0b" },
        { name: "Lazer", type: TransactionType.EXPENSE, icon: "Gamepad", color: "#8b5cf6" },
        { name: "Mercado", type: TransactionType.EXPENSE, icon: "ShoppingCart", color: "#10b981" },
        { name: "Saúde", type: TransactionType.EXPENSE, icon: "Heart", color: "#ec4899" },
        { name: "Educação", type: TransactionType.EXPENSE, icon: "BookOpen", color: "#8b5cf6" },
        { name: "Aplicações/Investimentos", type: TransactionType.INVESTMENT, icon: "PiggyBank", color: "#059669" },
      ];

      let created = false;
      for (const cat of defaultCategories) {
        if (!existingNames.includes(cat.name)) {
          try {
            await prisma.transactionCategory.create({
              data: {
                ...cat,
                userId,
              },
            });
            created = true;
          } catch {
            // Ignora erros de duplicata
          }
        }
      }


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
    { name: "Educação", type: TransactionType.EXPENSE, icon: "BookOpen", color: "#8b5cf6" },
    { name: "Aplicações/Investimentos", type: TransactionType.INVESTMENT, icon: "TrendingUp", color: "#059669" },
  ];

  try {
    for (const cat of defaultCategories) {
      try {
        await prisma.transactionCategory.create({
          data: {
            ...cat,
            userId,
          },
        });
      } catch {
        // Ignora erros de duplicata
      }
    }
  } catch (error) {
    console.error("Error creating default categories:", error);
  }
}

export async function createTransactionCategory(data: {
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
}) {
  const userId = await requireValidSession();
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

export async function createOrUpdateShoppingListTransaction(
  shoppingListId: string,
  data: {
    title: string;
    amount: number;
    type: TransactionType;
    status?: TransactionStatus;
    competencyMonth?: number;
    competencyYear?: number;
    categoryId: string;
    notes?: string;
  }
) {
  const userId = await requireValidSession();
  
  // Check if transaction already exists for this shopping list
  const existingTransaction = await prisma.transaction.findFirst({
    where: {
      userId,
      shoppingListId,
    },
  });

  const referenceDate = new Date();
  const competencyMonth = data.competencyMonth ?? referenceDate.getMonth();
  const competencyYear = data.competencyYear ?? referenceDate.getFullYear();

  if (existingTransaction) {
    // Update existing transaction
    return await prisma.transaction.update({
      where: { id: existingTransaction.id, userId },
      data: {
        ...data,
        competencyMonth,
        competencyYear,
      },
    });
  } else {
    // Create new transaction
    return await prisma.transaction.create({
      data: {
        ...data,
        competencyMonth,
        competencyYear,
        userId,
        shoppingListId,
      },
    });
  }
}
