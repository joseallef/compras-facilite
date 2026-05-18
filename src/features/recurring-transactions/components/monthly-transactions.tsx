"use client";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils/cn";
import { formatCurrency, formatShortDate } from "@/shared/utils/format";
import { TransactionStatus, TransactionType } from "@prisma/client";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  Clock,
  Edit,
  PiggyBank,
  Trash2,
  XCircle
} from "lucide-react";

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

interface MonthlyTransactionsProps {
  transactions: Transaction[];
  onToggleStatus: (id: string, status: TransactionStatus) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  month: number;
  year: number;
}

export function MonthlyTransactions({
  transactions,
  onToggleStatus,
  onEdit,
  onDelete,
}: MonthlyTransactionsProps) {
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

  const getStatusBadge = (status: TransactionStatus, id: string) => {
    switch (status) {
      case TransactionStatusValues.PAID:
        return (
          <button
            onClick={() => onToggleStatus(id, TransactionStatusValues.PENDING)}
            className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg w-fit hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
          >
            <CheckCircle2 size={14} />
            <span className="text-xs font-bold">Pago</span>
          </button>
        );
      case TransactionStatusValues.PENDING:
        return (
          <button
            onClick={() => onToggleStatus(id, TransactionStatusValues.PAID)}
            className="flex items-center gap-1.5 text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg w-fit hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
          >
            <Clock size={14} />
            <span className="text-xs font-bold">Pendente</span>
          </button>
        );
      case TransactionStatusValues.OVERDUE:
        return (
          <button
            onClick={() => onToggleStatus(id, TransactionStatusValues.PAID)}
            className="flex items-center gap-1.5 text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg w-fit hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <XCircle size={14} />
            <span className="text-xs font-bold">Atrasado</span>
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4">
        <p className="text-sm text-muted-foreground font-medium">
          Mostrando <span className="text-foreground font-bold">{transactions.length}</span> transações
        </p>
      </div>
      <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
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
                <th className="px-8 py-4 text-xs font-bold text-muted/60 uppercase tracking-wider text-right">
                  Ações
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
                      <div className={cn("p-2 rounded-xl", getTypeStyles(transaction.type))}>
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
                  <td className="px-8 py-5">{getStatusBadge(transaction.status, transaction.id)}</td>
                  <td className="px-8 py-5 text-sm text-muted">
                    {transaction.dueDate && formatShortDate(transaction.dueDate)}
                  </td>
                  <td
                    className={cn(
                      "px-8 py-5 text-right font-bold",
                      getAmountColor(transaction.type)
                    )}
                  >
                    {transaction.type === TransactionTypeValues.INCOME ? "+" : "-"}{" "}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(transaction)}
                        className="h-9 w-9 rounded-xl hover:bg-muted"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(transaction.id)}
                        className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-muted">
                    Nenhuma transação gerada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
