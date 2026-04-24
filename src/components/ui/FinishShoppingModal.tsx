"use client";

import { Modal } from "@/components/ui/Modal";
import { CheckCircle2, DollarSign } from "lucide-react";
import { useState } from "react";

interface FinishShoppingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (totalValue: number) => Promise<void>;
  isLoading?: boolean;
}

export function FinishShoppingModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: FinishShoppingModalProps) {
  const [value, setValue] = useState<string>("");

  const formatCurrency = (val: string) => {
    // Remove all non-digits
    const digits = val.replace(/\D/g, "");
    if (!digits) return "";

    // Convert to number (cents)
    const amount = parseInt(digits) / 100;
    
    // Format using pt-BR locale
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleConfirm = async () => {
    // Remove dots and replace comma with dot to get a float
    const rawDigits = value.replace(/\D/g, "");
    const numValue = rawDigits ? parseInt(rawDigits) / 100 : 0;
    
    await onConfirm(numValue);
    onClose();
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setValue(formatted);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Compra Concluída!" 
      description="Parabéns por completar sua lista. Gostaria de registrar o valor total gasto nesta compra?"
    >
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="totalValue" className="text-sm font-bold text-muted/60 uppercase tracking-wider ml-1">
            Valor Total Gasto (R$)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
            <input
              id="totalValue"
              type="text"
              inputMode="decimal"
              value={value}
              onChange={handleValueChange}
              placeholder="0,00"
              className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-xl font-bold"
              disabled={isLoading}
            />
          </div>
          <p className="text-[10px] text-muted ml-1 italic">
            * Opcional. Você pode deixar em branco se preferir.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-2xl font-bold border border-border hover:bg-muted/10 transition-all active:scale-95"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-6 py-3 rounded-2xl font-bold bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? "Salvando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
