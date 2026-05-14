"use client";

import { getTransactions } from "@/features/transactions/services/transaction-service";
import { useCallback, useEffect, useMemo, useState } from "react";
const TransactionType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;

const TransactionStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
} as const;

export function useDashboard() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const transData = await getTransactions({
        month: selectedMonth,
        year: selectedYear,
      });
      setTransactions(transData);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = useMemo(() => {
    const currentMonthTransactions = transactions;

    const incomes = currentMonthTransactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((acc, t) => acc + t.amount, 0);
    
    const expenses = currentMonthTransactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => acc + t.amount, 0);

    const pending = currentMonthTransactions
      .filter((t) => t.status === TransactionStatus.PENDING)
      .reduce((acc, t) => acc + t.amount, 0);

    const paid = currentMonthTransactions
      .filter((t) => t.status === TransactionStatus.PAID)
      .reduce((acc, t) => acc + t.amount, 0);

    const overdue = currentMonthTransactions
      .filter((t) => t.status === TransactionStatus.OVERDUE)
      .reduce((acc, t) => acc + t.amount, 0);
    
    const balance = incomes - expenses;

    const categoryData: Record<string, { name: string; value: number; color: string }> = {};
    currentMonthTransactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .forEach((t) => {
        if (!categoryData[t.category.id]) {
          categoryData[t.category.id] = {
            name: t.category.name,
            value: 0,
            color: t.category.color || "#cbd5e1",
          };
        }
        categoryData[t.category.id].value += t.amount;
      });

    return {
      incomes,
      expenses,
      balance,
      pending,
      paid,
      overdue,
      categoryExpenses: Object.values(categoryData).sort((a, b) => b.value - a.value),
      recentTransactions: transactions.slice(0, 10),
    };
  }, [transactions]);

  return {
    ...stats,
    isLoading,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    refresh: fetchDashboardData,
  };
}
