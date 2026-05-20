"use client";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Modal } from "@/shared/ui/modal";
import { CheckCircle2, History, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface FinishMarketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (totalValue: number) => Promise<void>;
  isLoading?: boolean;
  initialValue?: number | null;
}

export function FinishMarketModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  initialValue,
}: FinishMarketModalProps) {
  const [value, setValue] = useState<string>("");
  const lastIsOpenRef = useRef(isOpen);
  const lastInitialValueRef = useRef(initialValue);

  useEffect(() => {
    if (lastIsOpenRef.current !== isOpen || lastInitialValueRef.current !== initialValue) {
      lastIsOpenRef.current = isOpen;
      lastInitialValueRef.current = initialValue;
      if (isOpen && initialValue != null) {
        const formatted = new Intl.NumberFormat("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(initialValue);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setValue(formatted);
      } else if (isOpen) {
         
        setValue("");
      }
    }
  }, [isOpen, initialValue]);

  const formatCurrency = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (!digits) return "";
    const amount = parseInt(digits) / 100;
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleConfirm = async () => {
    const rawDigits = value.replace(/\D/g, "");
    const numValue = rawDigits ? parseInt(rawDigits) / 100 : 0;
    await onConfirm(numValue);
    onClose();
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setValue(formatted);
  };

  const handleUsePreviousValue = () => {
    if (initialValue != null) {
      const formatted = new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(initialValue);
      setValue(formatted);
    }
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
          <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-900/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-200 dark:border-emerald-800 shadow-lg">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>

        {initialValue != null && (
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/80 via-amber-50/50 to-emerald-50/80 dark:from-emerald-900/10 dark:via-amber-900/5 dark:to-emerald-900/10" />
            <div className="relative p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-xl">
                    <History size={18} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                      Valor anterior
                    </p>
                    <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(initialValue)}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleUsePreviousValue}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 shadow-md"
                >
                  <Sparkles size={16} />
                  Usar
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Input
            id="totalValue"
            type="text"
            inputMode="decimal"
            label="Valor Total Gasto"
            labelClassName="text-sm font-bold text-muted/60 uppercase tracking-wider ml-1"
            value={value}
            onChange={handleValueChange}
            placeholder="0,00"
            disabled={isLoading}
            leftIcon={<span className="text-xl font-bold text-muted">R$</span>}
            containerClassName="space-y-2"
            inputClassName="rounded-2xl text-xl font-bold border-border"
          />
          <p className="text-[11px] text-muted/70 ml-1">
            * Opcional. Você pode deixar em branco se preferir.
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <Button
            onClick={onClose}
            className="w-full sm:flex-1 px-6 py-3 rounded-2xl font-bold border border-border hover:bg-muted/10 transition-all active:scale-95 cursor-pointer"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full sm:flex-1 px-6 py-3 rounded-2xl font-bold bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            {isLoading ? "Salvando..." : "Confirmar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
