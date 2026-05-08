"use client";

import { KpiCard } from "./kpi-card";
import { DollarSign, TrendingUp, TrendingDown, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/shared/utils/format";

interface FinancialKpisProps {
  balance: number;
  incomes: number;
  expenses: number;
  marketExpenses: number;
}

export function FinancialKpis({ balance, incomes, expenses, marketExpenses }: FinancialKpisProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        title="Saldo Atual"
        value={formatCurrency(balance)}
        icon={DollarSign}
        iconClassName="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
      />
      <KpiCard
        title="Receitas do Mês"
        value={formatCurrency(incomes)}
        icon={TrendingUp}
        iconClassName="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
      />
      <KpiCard
        title="Despesas do Mês"
        value={formatCurrency(expenses)}
        icon={TrendingDown}
        iconClassName="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
      />
      <KpiCard
        title="Gasto em Mercado"
        value={formatCurrency(marketExpenses)}
        icon={ShoppingCart}
        iconClassName="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
      />
    </div>
  );
}
