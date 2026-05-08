"use client";

import { getTransactions } from "@/features/transactions/services/transaction-service";
import { TransactionType } from "@prisma/client";
import { format, startOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useDashboard() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Para os KPIs e Gráfico de Pizza, precisamos do mês selecionado.
      // Mas para o Gráfico de Evolução (Barras), ainda precisamos de um histórico (ex: 6 meses atrás do mês selecionado).
      const endDate = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59);
      const startDate = startOfMonth(subMonths(new Date(selectedYear, selectedMonth, 1), 5));
      
      const data = await getTransactions({ startDate, endDate });
      setTransactions(data);
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
    // Filtra transações do mês selecionado para os KPIs e Pizza
    const currentMonthTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });

    const incomes = currentMonthTransactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((acc, t) => acc + t.amount, 0);
    
    const expenses = currentMonthTransactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => acc + t.amount, 0);
    
    const marketExpenses = currentMonthTransactions
      .filter((t) => t.type === TransactionType.EXPENSE && t.category.name === "Mercado")
      .reduce((acc, t) => acc + t.amount, 0);
    
    const balance = incomes - expenses;

    // Agrupar por categoria (mês atual)
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

    // Evolução Mensal (6 meses terminando no mês selecionado)
    const monthlyData: Record<string, { month: string; income: number; expense: number; rawDate: Date }> = {};
    const baseDate = new Date(selectedYear, selectedMonth, 1);
    
    // Inicializa os 6 meses com zero
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(baseDate, i);
      const key = format(date, "MMM", { locale: ptBR });
      monthlyData[key] = {
        month: key.charAt(0).toUpperCase() + key.slice(1),
        income: 0,
        expense: 0,
        rawDate: date
      };
    }

    transactions.forEach(t => {
      const date = new Date(t.date);
      const key = format(date, "MMM", { locale: ptBR });
      if (monthlyData[key]) {
        if (t.type === TransactionType.INCOME) {
          monthlyData[key].income += t.amount;
        } else {
          monthlyData[key].expense += t.amount;
        }
      }
    });

    const monthlyEvolution = Object.values(monthlyData).sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());

    return {
      incomes,
      expenses,
      balance,
      marketExpenses,
      categoryExpenses: Object.values(categoryData).sort((a, b) => b.value - a.value),
      monthlyEvolution,
      recentTransactions: transactions.slice(0, 10),
    };
  }, [transactions, selectedMonth, selectedYear]);

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
