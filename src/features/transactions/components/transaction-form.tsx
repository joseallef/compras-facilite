"use client";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { getCards } from "@/features/cards/services/card-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionStatus, TransactionType } from "@prisma/client";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { createTransaction, getTransactionCategories } from "../services/transaction-service";

const transactionSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.string().min(1, "Valor é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  type: z.nativeEnum(TransactionType),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  cardId: z.string().optional(),
  observation: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface AddTransactionModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function TransactionForm({ onSuccess, onClose }: AddTransactionModalProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: TransactionType.EXPENSE,
      date: new Date().toISOString().split("T")[0],
      categoryId: "",
      cardId: "",
      description: "",
      amount: "",
    },
  });

  const selectedType = watch("type");

  useEffect(() => {
    async function loadData() {
      const [cats, crds] = await Promise.all([
        getTransactionCategories(selectedType),
        getCards(),
      ]);
      setCategories(cats);
      setCards(crds);
      
      if (cats.length > 0) {
        setValue("categoryId", cats[0].id);
      }
    }
    loadData();
  }, [selectedType, setValue]);

  const onSubmit = async (values: TransactionFormValues) => {
    setIsLoading(true);
    try {
      const amount = parseFloat(values.amount.replace(",", "."));
      await createTransaction({
        ...values,
        amount,
        date: new Date(values.date),
        status: TransactionStatus.COMPLETED,
      });
      toast.success("Transação criada com sucesso!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Erro ao criar transação");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
        <button
          type="button"
          onClick={() => setValue("type", TransactionType.EXPENSE)}
          className={`py-2 text-sm font-bold rounded-lg transition-all ${
            selectedType === TransactionType.EXPENSE
              ? "bg-white shadow-sm text-red-600"
              : "text-muted-foreground"
          }`}
        >
          Despesa
        </button>
        <button
          type="button"
          onClick={() => setValue("type", TransactionType.INCOME)}
          className={`py-2 text-sm font-bold rounded-lg transition-all ${
            selectedType === TransactionType.INCOME
              ? "bg-white shadow-sm text-emerald-600"
              : "text-muted-foreground"
          }`}
        >
          Receita
        </button>
      </div>

      <Input
        label="Descrição"
        placeholder="Ex: Aluguel, Salário..."
        {...register("description")}
        error={errors.description?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Valor"
          placeholder="0,00"
          {...register("amount")}
          error={errors.amount?.message}
        />
        <Input
          label="Data"
          type="date"
          {...register("date")}
          error={errors.date?.message}
        />
      </div>

      <div className="space-y-2">
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <Select
              label="Categoria"
              value={field.value}
              onChange={field.onChange}
              error={errors.categoryId?.message}
              options={categories.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
            />
          )}
        />
      </div>

      {selectedType === TransactionType.EXPENSE && (
        <div className="space-y-2">
          <Controller
            name="cardId"
            control={control}
            render={({ field }) => (
              <Select
                label="Cartão (Opcional)"
                value={field.value || ""}
                onChange={field.onChange}
                placeholder="Nenhum"
                options={[
                  { value: "", label: "Nenhum" },
                  ...cards.map((card) => ({
                    value: card.id,
                    label: card.name,
                  })),
                ]}
              />
            )}
          />
        </div>
      )}

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
