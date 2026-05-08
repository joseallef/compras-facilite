"use client";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { createGoal } from "../services/goal-service";

const goalSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  targetAmount: z.string().min(1, "Valor alvo é obrigatório"),
  currentAmount: z.string().optional(),
  deadline: z.string().optional(),
});

type GoalFormValues = z.infer<typeof goalSchema>;

interface GoalFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function GoalForm({ onSuccess, onClose }: GoalFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: "",
      targetAmount: "",
      currentAmount: "0",
      deadline: "",
    },
  });

  const onSubmit = async (values: GoalFormValues) => {
    setIsLoading(true);
    try {
      const targetAmount = parseFloat(values.targetAmount.replace(",", "."));
      const currentAmount = values.currentAmount ? parseFloat(values.currentAmount.replace(",", ".")) : 0;
      
      await createGoal({
        title: values.title,
        targetAmount,
        currentAmount,
        deadline: values.deadline ? new Date(values.deadline) : undefined,
      });

      toast.success("Meta criada com sucesso!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Erro ao criar meta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Título da Meta"
        placeholder="Ex: Reserva de Emergência, Notebook..."
        {...register("title")}
        error={errors.title?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Valor Alvo (R$)"
          placeholder="0,00"
          {...register("targetAmount")}
          error={errors.targetAmount?.message}
        />
        <Input
          label="Já tenho (R$)"
          placeholder="0,00"
          {...register("currentAmount")}
          error={errors.currentAmount?.message}
        />
      </div>

      <Input
        label="Prazo (Opcional)"
        type="date"
        {...register("deadline")}
        error={errors.deadline?.message}
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
