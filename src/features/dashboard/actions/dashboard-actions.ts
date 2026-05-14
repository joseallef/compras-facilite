"use server";

import { requireValidSession } from "@/core/auth/server-utils";
import { prisma } from "@/core/db/prisma";
import { getTransactions } from "@/features/transactions/services/transaction-service";

export async function getDashboardTransactionsAction(month: number, year: number) {
  await requireValidSession();
  return await getTransactions({ month, year });
}

export async function getYearlyDataAction(year: number) {
  const userId = await requireValidSession();

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      competencyYear: year,
    },
    include: {
      category: true,
    },
    orderBy: [
      { competencyYear: "asc" },
      { competencyMonth: "asc" },
    ],
  });

  const categories = await prisma.transactionCategory.findMany({
    where: { userId },
  });

  return {
    transactions,
    categories,
  };
}
