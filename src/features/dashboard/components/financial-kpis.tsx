"use client";

import { formatCurrency } from "@/shared/utils/format";
import { CheckCircle2, Clock, DollarSign, TrendingDown, TrendingUp, XCircle } from "lucide-react";
import { KpiCard } from "./kpi-card";

interface FinancialKpisProps {
  balance: number;
  incomes: number;
  expenses: number;
  pending: number;
  paid: number;
  overdue: number;
}

export function FinancialKpis({ 
  balance, 
  incomes, 
  expenses, 
  pending,
  paid,
  overdue
}: FinancialKpisProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <KpiCard
        title="Saldo"
        value={formatCurrency(balance)}
        icon={DollarSign}
        iconClassName={cn(
          "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
          balance < 0 && "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
        )}
      />
      <KpiCard
        title="Receitas"
        value={formatCurrency(incomes)}
        icon={TrendingUp}
        iconClassName="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
      />
      <KpiCard
        title="Despesas"
        value={formatCurrency(expenses)}
        icon={TrendingDown}
        iconClassName="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
      />
      <KpiCard
        title="Pagas"
        value={formatCurrency(paid)}
        icon={CheckCircle2}
        iconClassName="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
      />
      <KpiCard
        title="Pendentes"
        value={formatCurrency(pending)}
        icon={Clock}
        iconClassName="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
      />
      <KpiCard
        title="Atrasadas"
        value={formatCurrency(overdue)}
        icon={XCircle}
        iconClassName="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
      />
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
