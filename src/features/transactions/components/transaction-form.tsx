"use client";

import { getTransactionCategoriesAction } from "@/features/recurring-transactions/actions/recurring-actions";
import { Button } from "@/shared/ui/button";
import { CurrencyInput } from "@/shared/ui/currency-input";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { parseCurrency } from "@/shared/utils/currency";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createTransactionSchema } from "../schemas/transaction-schemas";
import { createTransaction, updateTransaction } from "../services/transaction-service";
const TransactionType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;

const TransactionStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
} as const;

interface TransactionFormProps {
  onSuccess: () => void;
  onClose: () => void;
  initialData?: any;
}

export function TransactionForm({ onSuccess, onClose, initialData }: TransactionFormProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      title: initialData?.title || "",
      notes: initialData?.notes || "",
      amount: initialData?.amount?.toString() || "",
      type: initialData?.type || TransactionType.EXPENSE,
      categoryId: initialData?.categoryId || "",
      status: initialData?.status || TransactionStatus.PENDING,
      competencyMonth: initialData?.competencyMonth || new Date().getMonth(),
      competencyYear: initialData?.competencyYear || new Date().getFullYear(),
    },
  });

  const selectedType = watch("type");

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await getTransactionCategoriesAction(selectedType);
        setCategories(cats);
        if (cats.length > 0 && !initialData?.categoryId) {
          setValue("categoryId", cats[0].id);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    }
    loadCategories();
  }, [selectedType, setValue, initialData]);

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      const amount = parseCurrency(values.amount);
      
      if (initialData?.id) {
        await updateTransaction(initialData.id, {
          ...values,
          amount,
        });
        toast.success("Transação atualizada com sucesso!");
      } else {
        await createTransaction({
          ...values,
          amount,
        });
        toast.success("Transação criada com sucesso!");
      }
      
      onSuccess();
      onClose();
    } catch {
      toast.error(initialData?.id ? "Erro ao atualizar transação" : "Erro ao criar transação");
    } finally {
      setIsLoading(false);
    }
  };

  const typeOptions = [
    { value: TransactionType.EXPENSE, label: "Despesa" },
    { value: TransactionType.INCOME, label: "Receita" },
  ];

  const statusOptions = [
    { value: TransactionStatus.PENDING, label: "Pendente" },
    { value: TransactionStatus.PAID, label: "Pago" },
    { value: TransactionStatus.OVERDUE, label: "Atrasado" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-2 p-1 bg-muted/50 rounded-2xl border border-border/50">
        {typeOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setValue("type", opt.value)}
            className={`py-3 text-sm font-bold rounded-xl transition-all ${
              selectedType === opt.value
                ? "bg-white dark:bg-zinc-800 shadow-sm text-emerald-600"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <Input
        label="Título"
        placeholder="Ex: Aluguel, Salário..."
        {...register("title")}
        error={errors.title?.message as string}
      />

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <CurrencyInput
              label="Valor"
              value={field.value}
              onChange={(formatted) => field.onChange(formatted)}
              error={errors.amount?.message as string}
            />
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              label="Status"
              value={field.value as string}
              onChange={field.onChange}
              options={statusOptions}
            />
          )}
        />
      </div>

      <Controller
        name="categoryId"
        control={control}
        render={({ field }) => (
          <Select
            label="Categoria"
            value={field.value}
            onChange={field.onChange}
            error={errors.categoryId?.message as string}
            placeholder={categories.length === 0 ? "Carregando..." : "Selecione"}
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
          />
        )}
      />

      <Input
        label="Observações (opcional)"
        placeholder="Alguma observação sobre essa transação..."
        {...register("notes")}
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1 rounded-2xl font-bold h-12"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          className="flex-1 rounded-2xl font-bold h-12 bg-emerald-600 text-white"
        >
          Salvar
        </Button>
      </div>
    </form>
  );
}
