"use server";

import { requireValidSession } from "@/core/auth/server-utils";
import { deleteTransaction, getTransactionCategories, getTransactions, updateTransaction } from "@/features/transactions/services/transaction-service";
import { parseCurrency } from "@/shared/utils/currency";
import { TransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { createRecurringSchema } from "../schemas/recurring-schemas";
import {
    createRecurring,
    deleteRecurring,
    ensureMonthlyTransactions,
    getRecurrings,
    updateRecurring,
} from "../services/recurring-service";

export async function getRecurringsAction() {
  return await getRecurrings();
}

export async function getTransactionsAction(month: number, year: number) {
  return await getTransactions({ month, year });
}

export async function getTransactionCategoriesAction(type?: TransactionType) {
  return await getTransactionCategories(type);
}

export async function createRecurringAction(data: any) {
  const validated = createRecurringSchema.parse(data);
  const defaultAmount = parseCurrency(validated.defaultAmount);

  await createRecurring({
    ...validated,
    defaultAmount,
    dueDay: validated.dueDay,
  });

  revalidatePath("/financas");
  revalidatePath("/dashboard");
}

export async function updateRecurringAction(id: string, data: any) {
  const updateData: any = { ...data };
  if (updateData.defaultAmount) {
    updateData.defaultAmount = parseCurrency(updateData.defaultAmount);
  }
  
  await updateRecurring(id, updateData);
  revalidatePath("/financas");
  revalidatePath("/dashboard");
}

export async function deleteRecurringAction(id: string) {
  await deleteRecurring(id);
  revalidatePath("/financas");
  revalidatePath("/dashboard");
}

export async function ensureMonthlyTransactionsAction(month: number, year: number) {
  const userId = await requireValidSession();
  await ensureMonthlyTransactions(userId, month, year);
  revalidatePath("/financas");
  revalidatePath("/dashboard");
}

export async function updateTransactionAction(id: string, data: any) {
  await updateTransaction(id, data);
  revalidatePath("/financas");
  revalidatePath("/dashboard");
}

export async function deleteTransactionAction(id: string) {
  await deleteTransaction(id);
  revalidatePath("/financas");
  revalidatePath("/dashboard");
}
