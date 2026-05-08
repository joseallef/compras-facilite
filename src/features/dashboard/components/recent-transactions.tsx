"use client";

import { cn } from "@/shared/utils/cn";
import { formatCurrency, formatShortDate } from "@/shared/utils/format";
import { TransactionType } from "@prisma/client";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: Date;
  type: TransactionType;
  category: {
    name: string;
    icon?: string;
    color?: string;
  };
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const pathname = usePathname();
  const isTransactionsPage = pathname === "/transactions";

  return (
    <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
      {!isTransactionsPage && (
        <div className="p-8 border-b border-border flex items-center justify-between">
          <h3 className="text-xl font-bold">Transações Recentes</h3>
          <Link href="/transactions" className="text-emerald-600 hover:text-emerald-500 font-bold text-sm">
            Ver todas
          </Link>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/5 text-left border-b border-border">
              <th className="px-8 py-4 text-xs font-bold text-muted/60 uppercase tracking-wider">Descrição</th>
              <th className="px-8 py-4 text-xs font-bold text-muted/60 uppercase tracking-wider">Categoria</th>
              <th className="px-8 py-4 text-xs font-bold text-muted/60 uppercase tracking-wider">Data</th>
              <th className="px-8 py-4 text-xs font-bold text-muted/60 uppercase tracking-wider text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-muted/5 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-xl",
                      transaction.type === TransactionType.INCOME 
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                        : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    )}>
                      {transaction.type === TransactionType.INCOME ? (
                        <ArrowUpCircle size={20} />
                      ) : (
                        <ArrowDownCircle size={20} />
                      )}
                    </div>
                    <span className="font-bold">{transaction.description}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: transaction.category.color || "#cbd5e1" }} 
                    />
                    <span className="text-sm text-muted-foreground">{transaction.category.name}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-muted">
                  {formatShortDate(transaction.date)}
                </td>
                <td className={cn(
                  "px-8 py-5 text-right font-bold",
                  transaction.type === TransactionType.INCOME ? "text-emerald-600" : "text-red-600"
                )}>
                  {transaction.type === TransactionType.INCOME ? "+" : "-"} {formatCurrency(transaction.amount)}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-muted">
                  Nenhuma transação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
