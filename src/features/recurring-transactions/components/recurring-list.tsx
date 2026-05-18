"use client";

import { ConfirmModal } from "@/shared/ui/confirm-modal";
import { cn } from "@/shared/utils/cn";
import { formatCurrency } from "@/shared/utils/format";
import { FrequencyType, TransactionType } from "@prisma/client";
import { ArrowDownCircle, ArrowUpCircle, Pencil, PiggyBank, Play, StopCircle, Trash2 } from "lucide-react";
import { useState } from "react";

const TransactionTypeValues = {
  INCOME: TransactionType.INCOME,
  EXPENSE: TransactionType.EXPENSE,
} as const;

const FrequencyTypeValues = {
  MONTHLY: FrequencyType.MONTHLY,
  WEEKLY: FrequencyType.WEEKLY,
  YEARLY: FrequencyType.YEARLY,
} as const;

interface RecurringTransaction {
  id: string;
  title: string;
  description?: string | null;
  type: TransactionType;
  categoryId: string;
  category: {
    name: string;
    color?: string;
  };
  defaultAmount: number;
  frequency: FrequencyType;
  dueDay?: number | null;
  active: boolean;
}

interface RecurringListProps {
  recurrings: RecurringTransaction[];
  onEdit: (recurring: RecurringTransaction) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

export function RecurringList({
  recurrings,
  onEdit,
  onDelete,
  onToggleActive,
}: RecurringListProps) {
  const [recurringToDelete, setRecurringToDelete] = useState<string | null>(null);

  const getFrequencyLabel = (freq: FrequencyType) => {
    switch (freq) {
      case FrequencyTypeValues.MONTHLY:
        return "Mensal";
      case FrequencyTypeValues.WEEKLY:
        return "Semanal";
      case FrequencyTypeValues.YEARLY:
        return "Anual";
      default:
        return freq;
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

  return (
    <div className="space-y-4">
      <ConfirmModal
        isOpen={!!recurringToDelete}
        onClose={() => setRecurringToDelete(null)}
        onConfirm={() => {
          if (recurringToDelete) {
            onDelete(recurringToDelete);
            setRecurringToDelete(null);
          }
        }}
        title="Excluir Conta Recorrente"
        description="Tem certeza que deseja excluir esta conta? Isso não afetará as transações já geradas."
        confirmText="Excluir"
        variant="danger"
      />

      <div className="flex items-center justify-between px-4">
        <p className="text-sm text-muted-foreground font-medium">
          Mostrando <span className="text-foreground font-bold">{recurrings.length}</span> contas
        </p>
      </div>

      {recurrings.length === 0 && (
        <div className="bg-card rounded-[2.5rem] border border-border p-20 text-center space-y-4">
          <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <ArrowDownCircle size={40} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Nenhuma conta recorrente</h3>
            <p className="text-muted-foreground mt-2">
              Crie suas contas recorrentes para começar a gerenciar suas finanças
            </p>
          </div>
        </div>
      )}

      {recurrings.length > 0 && (
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
                    Frequência
                  </th>
                  <th className="px-8 py-4 text-xs font-bold text-muted/60 uppercase tracking-wider">
                    Dia
                  </th>
                  <th className="px-8 py-4 text-xs font-bold text-muted/60 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-8 py-4 text-xs font-bold text-muted/60 uppercase tracking-wider text-right">
                    Valor Padrão
                  </th>
                  <th className="px-8 py-4 text-xs font-bold text-muted/60 uppercase tracking-wider text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recurrings.map((recurring) => (
                  <tr
                    key={recurring.id}
                    className={cn(
                      "hover:bg-muted/5 transition-colors",
                      !recurring.active && "opacity-50"
                    )}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-xl", getTypeStyles(recurring.type))}>
                          {getTransactionIcon(recurring.type)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold">{recurring.title}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: recurring.category.color || "#cbd5e1" }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {recurring.category.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm text-muted-foreground font-medium">
                        {getFrequencyLabel(recurring.frequency)}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm text-muted-foreground font-medium">
                        {recurring.dueDay ? `Dia ${recurring.dueDay}` : "-"}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-lg text-xs font-bold",
                          recurring.active
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                        )}
                      >
                        {recurring.active ? "Ativa" : "Pausada"}
                      </span>
                    </td>
                    <td
                      className={cn(
                        "px-8 py-5 text-right font-bold",
                        getAmountColor(recurring.type)
                      )}
                    >
                      {recurring.type === TransactionTypeValues.INCOME ? "+" : "-"}{" "}
                      {formatCurrency(recurring.defaultAmount)}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(recurring)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                          <Pencil size={16} className="text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => onToggleActive(recurring.id, !recurring.active)}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            recurring.active
                              ? "hover:bg-amber-50 text-amber-600"
                              : "hover:bg-emerald-50 text-emerald-600"
                          )}
                        >
                          {recurring.active ? <StopCircle size={16} /> : <Play size={16} />}
                        </button>
                        <button
                          onClick={() => setRecurringToDelete(recurring.id)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
