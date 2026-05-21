"use client";

import { formatCurrency } from "@/shared/utils/format";
import { TransactionStatus, TransactionType } from "@prisma/client";

const TransactionTypeValues = {
  INCOME: TransactionType.INCOME,
  EXPENSE: TransactionType.EXPENSE,
} as const;

const TransactionStatusValues = {
  PENDING: TransactionStatus.PENDING,
  PAID: TransactionStatus.PAID,
  OVERDUE: TransactionStatus.OVERDUE,
} as const;

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
}

interface MonthlySummaryProps {
  transactions: Transaction[];
  month: number;
  year: number;
}

const BalanceIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const IncomeIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

const ExpenseIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 14l-7 7m0 0l-7-7m7 7V3"
    />
  </svg>
);

const PaidIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const PendingIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const OverdueIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const SummaryCard = ({ 
  title, 
  value, 
  icon, 
  colorClass 
}: { 
  title: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
}) => (
  <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm font-bold text-muted/60 uppercase tracking-wider">
        {title}
      </span>
      <div className={colorClass}>{icon}</div>
    </div>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export function MonthlySummary({ transactions }: MonthlySummaryProps) {
  const totalIncome = transactions
    .filter((t) => t.type === TransactionTypeValues.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === TransactionTypeValues.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPaid = transactions
    .filter((t) => t.status === TransactionStatusValues.PAID)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPending = transactions
    .filter((t) => t.status === TransactionStatusValues.PENDING)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOverdue = transactions
    .filter((t) => t.status === TransactionStatusValues.OVERDUE)
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <SummaryCard
        title="Saldo"
        value={formatCurrency(balance)}
        icon={<BalanceIcon />}
        colorClass={balance >= 0 ? "text-emerald-600" : "text-red-600"}
      />
      <SummaryCard
        title="Receitas"
        value={`+ ${formatCurrency(totalIncome)}`}
        icon={<IncomeIcon />}
        colorClass="text-emerald-600"
      />
      <SummaryCard
        title="Despesas"
        value={`- ${formatCurrency(totalExpense)}`}
        icon={<ExpenseIcon />}
        colorClass="text-red-600"
      />
      <SummaryCard
        title="Pagas"
        value={formatCurrency(totalPaid)}
        icon={<PaidIcon />}
        colorClass="text-emerald-600"
      />
      <SummaryCard
        title="Pendentes"
        value={formatCurrency(totalPending)}
        icon={<PendingIcon />}
        colorClass="text-amber-600"
      />
      <SummaryCard
        title="Atrasadas"
        value={formatCurrency(totalOverdue)}
        icon={<OverdueIcon />}
        colorClass="text-red-600"
      />
    </div>
  );
}
