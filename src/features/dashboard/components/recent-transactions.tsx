"use client";

import { cn } from "@/shared/utils/cn";
import { formatCurrency, formatShortDate } from "@/shared/utils/format";
import { TransactionStatus, TransactionType } from "@prisma/client";
import { ArrowDownCircle, ArrowUpCircle, CheckCircle2, Clock, PiggyBank, XCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  categoryId: string;
  category: {
    name: string;
    color?: string;
  };
  dueDate?: Date | null;
  paidAt?: Date | null;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const pathname = usePathname();
  const isTransactionsPage = pathname === "/financas";

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionTypeValues.INCOME:
        return <ArrowUpCircle size={20} />;
      case TransactionTypeValues.EXPENSE:
        return <ArrowDownCircle size={20} />;
      default:
        return <PiggyBank size={20} />;
    }
  };

  const getTypeStyles = (type: TransactionType) => {
    switch (type) {
      case TransactionTypeValues.INCOME:
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400";
      case TransactionTypeValues.EXPENSE:
        return "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-500";
    }
  };

  const getAmountColor = (type: TransactionType) => {
    switch (type) {
      case TransactionTypeValues.INCOME:
        return "text-emerald-600";
      case TransactionTypeValues.EXPENSE:
        return "text-red-600";
      default:
        return "text-emerald-700";
    }
  };

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatusValues.PAID:
        return (
          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg w-fit">
            <CheckCircle2 size={14} />
            <span className="text-xs font-bold">Pago</span>
          </div>
        );
      case TransactionStatusValues.PENDING:
        return (
          <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg w-fit">
            <Clock size={14} />
            <span className="text-xs font-bold">Pendente</span>
          </div>
        );
      case TransactionStatusValues.OVERDUE:
        return (
          <div className="flex items-center gap-1.5 text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg w-fit">
            <XCircle size={14} />
            <span className="text-xs font-bold">Atrasado</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
      {!isTransactionsPage && (
        <div className="p-8 border-b border-border flex items-center justify-between">
          <h3 className="text-xl font-bold">Transações Recentes</h3>
          <Link
            href="/financas"
            className="text-emerald-600 hover:text-emerald-500 font-bold text-sm"
          >
            Ver Todas
          </Link>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/5 text-left border-b border-border">
              <th className="px-8 py-4 text-xs font-bold text-muted/60 uppercase tracking-wider">
                Título
              </th>
              <th className="px-8 py-4 text-xs font-bold text-muted/60 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-8 py-4 text-xs font-bold text-muted/60 uppercase tracking-wider">
                Status
              </th>
              <th className="px-8 py-4 text-xs font-bold text-muted/60 uppercase tracking-wider">
                Vencimento
              </th>
              <th className="px-8 py-4 text-xs font-bold text-muted/60 uppercase tracking-wider text-right">
                Valor
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="hover:bg-muted/5 transition-colors"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn("p-2 rounded-xl", getTypeStyles(transaction.type))}
                    >
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">{transaction.title}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: transaction.category.color || "#cbd5e1" }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {transaction.category.name}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">{getStatusBadge(transaction.status)}</td>
                <td className="px-8 py-5 text-sm text-muted">
                  {transaction.dueDate && formatShortDate(transaction.dueDate)}
                </td>
                <td
                  className={cn(
                    "px-8 py-5 text-right font-bold",
                    getAmountColor(transaction.type)
                  )}
                >
                  {transaction.type === TransactionType.INCOME ? "+" : "-"}{" "}
                  {formatCurrency(transaction.amount)}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-muted">
                  Nenhuma transação para este mês.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
