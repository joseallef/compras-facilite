"use client";

import { createRecurringAction, updateRecurringAction } from "@/features/recurring-transactions/actions/recurring-actions";
import { createRecurringSchema } from "@/features/recurring-transactions/schemas/recurring-schemas";
import { Button } from "@/shared/ui/button";
import { CurrencyInput } from "@/shared/ui/currency-input";
import { DatePicker } from "@/shared/ui/date-picker";
import { Input } from "@/shared/ui/input";
import { Modal } from "@/shared/ui/modal";
import { Select } from "@/shared/ui/select";
import { formatCurrency, parseCurrency } from "@/shared/utils/currency";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Icons from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCategories } from "../hooks/use-categories";
import { createTransactionSchema } from "../schemas/transaction-schemas";
import { createTransaction, updateTransaction } from "../services/transaction-service";

const TransactionType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
  INVESTMENT: "INVESTMENT",
} as const;

const TransactionStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
} as const;

const FrequencyType = {
  MONTHLY: "MONTHLY",
  WEEKLY: "WEEKLY",
  YEARLY: "YEARLY",
} as const;

type TransactionType = typeof TransactionType[keyof typeof TransactionType];
type FrequencyType = typeof FrequencyType[keyof typeof FrequencyType];
type TransactionStatus = typeof TransactionStatus[keyof typeof TransactionStatus];

type Mode = "single" | "recurring";

const getIconComponent = (iconName: string) => {
  const Icon = (Icons as any)[iconName];
  return Icon ? <Icon size={18} /> : <Icons.Circle size={18} />;
};

interface UnifiedTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialMode?: Mode;
  initialData?: any;
}

export function UnifiedTransactionModal({
  isOpen,
  onClose,
  onSuccess,
  initialMode = "single",
  initialData,
}: UnifiedTransactionModalProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(
      mode === "single" ? createTransactionSchema : createRecurringSchema
    ),
    defaultValues: mode === "single"
      ? {
          title: initialData?.title || "",
          notes: initialData?.notes || "",
          amount: initialData?.amount?.toString() || "",
          type: initialData?.type || TransactionType.EXPENSE,
          categoryId: initialData?.categoryId || "",
          status: initialData?.status || TransactionStatus.PENDING,
          dueDate: initialData?.dueDate || undefined,
        }
      : {
          title: initialData?.title || "",
          description: initialData?.description || "",
          type: initialData?.type || TransactionType.EXPENSE,
          categoryId: initialData?.categoryId || "",
          defaultAmount: initialData?.defaultAmount ? formatCurrency(initialData.defaultAmount) : "",
          frequency: initialData?.frequency || FrequencyType.MONTHLY,
          dueDay: initialData?.dueDay?.toString() || "",
        },
  });

  const selectedType = watch("type");
  const { categories } = useCategories(selectedType === TransactionType.INVESTMENT ? undefined : selectedType);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      reset(
        initialMode === "single"
          ? {
              title: initialData?.title || "",
              notes: initialData?.notes || "",
              amount: initialData?.amount?.toString() || "",
              type: initialData?.type || TransactionType.EXPENSE,
              categoryId: initialData?.categoryId || "",
              status: initialData?.status || TransactionStatus.PENDING,
              dueDate: initialData?.dueDate || undefined,
            }
          : {
              title: initialData?.title || "",
              description: initialData?.description || "",
              type: initialData?.type || TransactionType.EXPENSE,
              categoryId: initialData?.categoryId || "",
              defaultAmount: initialData?.defaultAmount ? formatCurrency(initialData.defaultAmount) : "",
              frequency: initialData?.frequency || FrequencyType.MONTHLY,
              dueDay: initialData?.dueDay?.toString() || "",
            }
      );
    }
  }, [isOpen, initialData, initialMode]);

  useEffect(() => {
    if (isOpen && !isEditing) {
      const defaultValues = mode === "single"
        ? {
            title: initialData?.title || "",
            notes: initialData?.notes || "",
            amount: initialData?.amount?.toString() || "",
            type: initialData?.type || TransactionType.EXPENSE,
            categoryId: initialData?.categoryId || "",
            status: initialData?.status || TransactionStatus.PENDING,
            dueDate: initialData?.dueDate || undefined,
          }
        : {
            title: initialData?.title || "",
            description: initialData?.description || "",
            type: initialData?.type || TransactionType.EXPENSE,
            categoryId: initialData?.categoryId || "",
            defaultAmount: initialData?.defaultAmount ? formatCurrency(initialData.defaultAmount) : "",
            frequency: initialData?.frequency || FrequencyType.MONTHLY,
            dueDay: initialData?.dueDay?.toString() || "",
          };
      reset(defaultValues);
    }
  }, [mode, isOpen, isEditing, initialData, reset]);

  useEffect(() => {
    if (categories.length > 0 && selectedType !== TransactionType.INVESTMENT) {
      if (!initialData?.categoryId || (initialData && initialData.type !== selectedType)) {
        setValue("categoryId", categories[0].id);
      } else {
        const exists = categories.some((c: any) => c.id === initialData.categoryId);
        if (!exists) {
          setValue("categoryId", categories[0].id);
        }
      }
    } else if (selectedType === TransactionType.INVESTMENT) {
      setValue("categoryId", "");
    }
  }, [categories, selectedType, setValue, initialData]);

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      const finalValues = { ...values };

      if (values.type === TransactionType.INVESTMENT) {
        const investmentCategory = categories.find((cat) => cat.name === "Aplicações/Investimentos");
        if (investmentCategory) {
          finalValues.categoryId = investmentCategory.id;
        }
      }

      if (mode === "single") {
        const amount = parseCurrency(finalValues.amount);
        if (isEditing && initialData?.id) {
          await updateTransaction(initialData.id, {
            ...finalValues,
            amount,
          });
          toast.success("Transação atualizada com sucesso!");
        } else {
          await createTransaction({
            ...finalValues,
            amount,
          });
          toast.success("Transação criada com sucesso!");
        }
      } else {
        if (isEditing && initialData?.id) {
          await updateRecurringAction(initialData.id, {
            ...finalValues,
            dueDay: finalValues.dueDay,
          });
          toast.success("Conta recorrente atualizada com sucesso!");
        } else {
          await createRecurringAction({
            ...finalValues,
            dueDay: finalValues.dueDay,
          });
          toast.success("Conta recorrente criada com sucesso!");
        }
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(
        isEditing
          ? mode === "single"
            ? "Erro ao atualizar transação"
            : "Erro ao atualizar conta recorrente"
          : mode === "single"
          ? "Erro ao criar transação"
          : "Erro ao criar conta recorrente"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeOptions = (): Array<{ value: TransactionType; label: string }> => {
    const options = [
      { value: TransactionType.EXPENSE, label: "Despesa" },
      { value: TransactionType.INCOME, label: "Receita" },
    ] as Array<{ value: TransactionType; label: string }>;
    
    if (mode === "recurring") {
      options.push({ value: TransactionType.INVESTMENT, label: "Investimento" });
    }
    
    return options;
  };

  const statusOptions = [
    { value: TransactionStatus.PENDING, label: "Pendente", icon: <Icons.Clock size={18} /> },
    { value: TransactionStatus.PAID, label: "Pago", icon: <Icons.CheckCircle2 size={18} /> },
    { value: TransactionStatus.OVERDUE, label: "Atrasado", icon: <Icons.AlertCircle size={18} /> },
  ];

  const frequencyOptions = [
    { value: FrequencyType.MONTHLY, label: "Mensal", icon: <Icons.Calendar size={18} /> },
    { value: FrequencyType.WEEKLY, label: "Semanal", icon: <Icons.CalendarDays size={18} /> },
    { value: FrequencyType.YEARLY, label: "Anual", icon: <Icons.CalendarCheck2 size={18} /> },
  ];

  const days = Array.from({ length: 31 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `Dia ${i + 1}`,
  }));

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i - 2);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEditing
          ? mode === "single"
            ? "Editar Transação"
            : "Editar Conta Fixa"
          : mode === "single"
          ? "Nova Transação"
          : "Nova Conta Fixa"
      }
    >
      {/* Mode Toggle */}
      {!isEditing && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1 bg-muted/50 rounded-2xl border border-border/50 mb-4">
          <button
            type="button"
            onClick={() => setMode("single")}
            className={`py-2.5 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              mode === "single"
                ? "bg-white dark:bg-zinc-800 shadow-sm text-emerald-600"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Icons.Calendar size={16} />
            Transação Única
          </button>
          <button
            type="button"
            onClick={() => setMode("recurring")}
            className={`py-2.5 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              mode === "recurring"
                ? "bg-white dark:bg-zinc-800 shadow-sm text-emerald-600"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Icons.Repeat size={16} />
            Conta Fixa
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Type Toggle */}
        <div className={`grid gap-2 p-1 bg-muted/50 rounded-2xl border border-border/50 ${
          mode === "single" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3"
        }`}>
          {getTypeOptions().map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => !isEditing && setValue("type", opt.value)}
              disabled={isEditing}
              className={`py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                isEditing 
                  ? watch("type") === opt.value 
                    ? "bg-white dark:bg-zinc-800 shadow-sm" 
                    : "text-muted-foreground cursor-not-allowed opacity-50"
                  : watch("type") === opt.value
                    ? "bg-white dark:bg-zinc-800 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Title */}
        <Input
          label={
            selectedType === TransactionType.INCOME 
              ? "Origem da Receita" 
              : selectedType === TransactionType.EXPENSE 
                ? "Descrição da Despesa" 
                : "Investimento"
          }
          placeholder={
            mode === "single" 
              ? (selectedType === TransactionType.INCOME 
                  ? "Ex: Salário, Freelance..." 
                  : selectedType === TransactionType.EXPENSE 
                    ? "Ex: Aluguel, Supermercado..." 
                    : "Ex: CDB, Ações, FIIs...")
              : (selectedType === TransactionType.INCOME 
                  ? "Ex: Salário Mensal..." 
                  : selectedType === TransactionType.EXPENSE 
                    ? "Ex: Luz, Internet..." 
                    : "Ex: Investimento Mensal...")
          }
          {...register("title")}
          error={errors.title?.message as string}
        />

        {mode === "single" ? (
          <>
            {/* Amount and Status (specific per type) */}
            {selectedType !== TransactionType.INVESTMENT ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      label={
                        selectedType === TransactionType.INCOME 
                          ? "Valor Recebido" 
                          : "Valor da Despesa"
                      }
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
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      label="Valor Investido"
                      value={field.value}
                      onChange={(formatted) => field.onChange(formatted)}
                      error={errors.amount?.message as string}
                    />
                  )}
                />

                <Controller
                  name="dueDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Data de Aplicação"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            )}

            {/* Category and Date - only show for single transactions and non-investment */}
            {selectedType !== TransactionType.INVESTMENT && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      options={categories.filter((cat) => cat.name !== "Aplicações/Investimentos").map((cat) => ({
                        value: cat.id,
                        label: cat.name,
                        icon: getIconComponent(cat.icon || "Circle"),
                      }))}
                    />
                  )}
                />

                {/* Date fields specific per type */}
                {selectedType === TransactionType.EXPENSE && (
                  <Controller
                    name="dueDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="Data de Vencimento (opcional)"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                )}

                {selectedType === TransactionType.INCOME && (
                  <Controller
                    name="dueDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="Data de Recebimento (opcional)"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                )}
              </div>
            )}

            {/* Notes (specific per type) */}
            <Input
              label="Observações (opcional)"
              placeholder={
                selectedType === TransactionType.INCOME 
                  ? "Ex: Bônus, CLT..." 
                  : selectedType === TransactionType.EXPENSE 
                    ? "Ex: Supermercado do mês..." 
                    : "Ex: Aplicado no CDB..."
              }
              {...register("notes")}
            />
          </>
        ) : (
          <>
            {/* Default Amount and Frequency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Controller
                name="defaultAmount"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    label={
                      selectedType === TransactionType.INCOME 
                        ? "Valor Padrão Recebido" 
                        : selectedType === TransactionType.EXPENSE 
                          ? "Valor Padrão" 
                          : "Valor Padrão Investido"
                    }
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

            {/* Category and Due Day (only for non-investment) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedType !== TransactionType.INVESTMENT && (
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
                      options={categories.filter((cat) => cat.name !== "Aplicações/Investimentos").map((cat) => ({
                        value: cat.id,
                        label: cat.name,
                        icon: getIconComponent(cat.icon || "Circle"),
                      }))}
                    />
                  )}
                />
              )}

              {selectedType !== TransactionType.INVESTMENT && (
                <Controller
                  name="dueDay"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label={
                        selectedType === TransactionType.INCOME 
                          ? "Dia de Recebimento" 
                          : "Dia de Vencimento"
                      }
                      value={field.value?.toString() || ""}
                      onChange={field.onChange}
                      placeholder="Opcional"
                      options={days}
                    />
                  )}
                />
              )}

              {/* For investments, just fill the space */}
              {selectedType === TransactionType.INVESTMENT && (
                <div className="sm:col-span-2" />
              )}
            </div>

            {/* Description */}
            <Input
              label="Descrição (opcional)"
              placeholder={
                selectedType === TransactionType.INCOME 
                  ? "Ex: Salário mensal CLT..." 
                  : selectedType === TransactionType.EXPENSE 
                    ? "Ex: Energia elétrica..." 
                    : "Ex: Investimento mensal..."
              }
              {...register("description")}
            />
          </>
        )}

        {/* Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
          <Button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            variant="ghost"
            className="flex-1 h-12 px-6 rounded-2xl font-bold text-muted-foreground hover:text-foreground disabled:opacity-50 w-full"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
            className="flex-1 bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95 disabled:opacity-50 w-full"
          >
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
