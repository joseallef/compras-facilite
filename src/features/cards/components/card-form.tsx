"use client";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { createCard } from "../services/card-service";

const cardSchema = z.object({
  name: z.string().min(1, "Nome do cartão é obrigatório"),
  bank: z.string().min(1, "Banco é obrigatório"),
  limit: z.string().min(1, "Limite é obrigatório"),
  closingDay: z.string().min(1, "Dia de fechamento é obrigatório"),
  dueDay: z.string().min(1, "Dia de vencimento é obrigatório"),
  color: z.string().optional(),
});

type CardFormValues = z.infer<typeof cardSchema>;

interface CardFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function CardForm({ onSuccess, onClose }: CardFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      name: "",
      bank: "",
      limit: "",
      closingDay: "",
      dueDay: "",
      color: "#8a05be",
    },
  });

  const onSubmit = async (values: CardFormValues) => {
    setIsLoading(true);
    try {
      const limit = parseFloat(values.limit.replace(",", "."));
      const closingDay = parseInt(values.closingDay);
      const dueDay = parseInt(values.dueDay);
      
      await createCard({
        name: values.name,
        bank: values.bank,
        limit,
        closingDay,
        dueDay,
        color: values.color,
      });

      toast.success("Cartão cadastrado com sucesso!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Erro ao cadastrar cartão");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Nome do Cartão"
          placeholder="Ex: Nubank, Inter..."
          {...register("name")}
          error={errors.name?.message}
        />
        <Input
          label="Banco"
          placeholder="Ex: Nubank S.A."
          {...register("bank")}
          error={errors.bank?.message}
        />
      </div>

      <Input
        label="Limite Total (R$)"
        placeholder="0,00"
        {...register("limit")}
        error={errors.limit?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Dia de Fechamento"
          type="number"
          min="1"
          max="31"
          {...register("closingDay")}
          error={errors.closingDay?.message}
        />
        <Input
          label="Dia de Vencimento"
          type="number"
          min="1"
          max="31"
          {...register("dueDay")}
          error={errors.dueDay?.message}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-muted/60 uppercase tracking-wider ml-1">
          Cor do Cartão
        </label>
        <div className="flex gap-2">
          {["#8a05be", "#ff5f00", "#000000", "#10b981", "#3b82f6", "#ef4444"].map((color) => (
            <label key={color} className="relative cursor-pointer group">
              <input
                type="radio"
                className="sr-only"
                value={color}
                {...register("color")}
              />
              <div 
                className="w-8 h-8 rounded-full border-2 border-transparent group-hover:scale-110 transition-all"
                style={{ backgroundColor: color }}
              />
            </label>
          ))}
        </div>
      </div>

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
