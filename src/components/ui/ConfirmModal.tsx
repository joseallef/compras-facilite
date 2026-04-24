"use client";

import { cn } from "@/utils/cn";
import { AlertCircle, Loader2 } from "lucide-react";
import { Modal } from "./Modal";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "info",
  isLoading = false,
}: ConfirmModalProps) {
  const variantStyles = {
    danger: "bg-red-500 hover:bg-red-600 shadow-red-500/20 text-white",
    warning: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 text-white",
    info: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 text-white",
  };

  const iconStyles = {
    danger: "text-red-500 bg-red-50 dark:bg-red-900/20",
    warning: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
    info: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} description={description}>
      <div className="flex flex-col items-center text-center gap-6">
        <div className={cn("p-4 rounded-3xl", iconStyles[variant])}>
          <AlertCircle size={40} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-3.5 rounded-2xl font-bold border border-border hover:bg-muted/10 transition-all active:scale-95 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "flex-1 px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed",
              variantStyles[variant]
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processando...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
