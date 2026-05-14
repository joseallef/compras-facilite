"use client";

import { Button } from "@/shared/ui/button";
import { CurrencyInput } from "@/shared/ui/currency-input";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { formatCurrency } from "@/shared/utils/currency";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createRecurringAction, getTransactionCategoriesAction, updateRecurringAction } from "../actions/recurring-actions";
import { createRecurringSchema } from "../schemas/recurring-schemas";
const FrequencyType = {
  MONTHLY: "MONTHLY",
  WEEKLY: "WEEKLY",
  YEARLY: "YEARLY",
} as const;

const TransactionType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;

interface RecurringFormProps {
  onSuccess: () => void;
  onClose: () => void;
  initialData?: any;
}

export function RecurringForm({ onSuccess, onClose, initialData }: RecurringFormProps) {
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
    resolver: zodResolver(createRecurringSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      type: initialData?.type || TransactionType.EXPENSE,
      categoryId: initialData?.categoryId || "",
      defaultAmount: initialData?.defaultAmount ? formatCurrency(initialData.defaultAmount) : "",
      frequency: initialData?.frequency || FrequencyType.MONTHLY,
      dueDay: initialData?.dueDay?.toString() || "",
      startDate: initialData?.startDate || new Date(),
      endDate: initialData?.endDate || undefined,
    },
  });

  const selectedType = watch("type");

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await getTransactionCategoriesAction(selectedType);
        setCategories(cats);
        if (cats.length > 0) {
          if (!initialData?.categoryId) {
            setValue("categoryId", cats[0].id);
          } else {
            const exists = cats.some(c => c.id === initialData.categoryId);
            if (!exists) {
              setValue("categoryId", cats[0].id);
            }
          }
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
      if (initialData?.id) {
        await updateRecurringAction(initialData.id, values);
        toast.success("Conta recorrente atualizada com sucesso!");
      } else {
        await createRecurringAction(values);
        toast.success("Conta recorrente criada com sucesso!");
      }
      onSuccess();
      onClose();
    } catch {
      toast.error(initialData?.id ? "Erro ao atualizar conta recorrente" : "Erro ao criar conta recorrente");
    } finally {
      setIsLoading(false);
    }
  };

  const typeOptions = [
    { value: TransactionType.EXPENSE, label: "Despesa" },
    { value: TransactionType.INCOME, label: "Receita" },
  ];

  const frequencyOptions = [
    { value: FrequencyType.MONTHLY, label: "Mensal" },
    { value: FrequencyType.WEEKLY, label: "Semanal" },
    { value: FrequencyType.YEARLY, label: "Anual" },
  ];

  const days = Array.from({ length: 31 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `Dia ${i + 1}`,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="grid grid-cols-2 gap-2 p-1 bg-muted/50 rounded-2xl border border-border/50">
        {typeOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setValue("type", opt.value)}
            className={`py-2.5 text-sm font-bold rounded-xl transition-all ${
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
        placeholder="Ex: Luz, Internet, Salário..."
        {...register("title")}
        error={errors.title?.message as string}
      />

      <div className="grid grid-cols-2 gap-3">
        <Controller
          name="defaultAmount"
          control={control}
          render={({ field }) => (
            <CurrencyInput
              label="Valor Padrão"
              value={field.value}
              onChange={(formatted) => field.onChange(formatted)}
              error={errors.defaultAmount?.message as string}
            />
          )}
        />

        <Controller
          name="frequency"
          control={control}
          render={({ field }) => (
            <Select
              label="Frequência"
              value={field.value as string}
              onChange={field.onChange}
              options={frequencyOptions}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
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
                label: cat.name
              }))}
            />
          )}
        />

        <Controller
          name="dueDay"
          control={control}
          render={({ field }) => (
            <Select
              label="Dia de Vencimento"
              value={field.value?.toString() || ""}
              onChange={field.onChange}
              placeholder="Opcional"
              options={days}
            />
          )}
        />
      </div>

      <Input
        label="Descrição (opcional)"
        placeholder="Alguma observação sobre essa conta..."
        {...register("description")}
      />

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1 rounded-2xl font-bold h-11"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          className="flex-1 rounded-2xl font-bold h-11 bg-emerald-600 text-white"
        >
          Salvar
        </Button>
      </div>
    </form>
  );
}
