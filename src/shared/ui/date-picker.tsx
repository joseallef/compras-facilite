"use client";

import { Button } from "@/shared/ui/button";
import { Modal } from "@/shared/ui/modal";
import { cn } from "@/shared/utils/cn";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

interface DatePickerProps {
  label?: string;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = "Selecione uma data",
  disabled,
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-bold text-muted/60 uppercase tracking-wider ml-1">
          {label}
        </label>
      )}

      <Button
        variant="ghost"
        onClick={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between bg-card border rounded-2xl py-2.5 outline-none transition-all shadow-sm hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed relative",
          "pl-5 pr-12 text-left",
          !value && "text-muted/60"
        )}
      >
        <span className="font-bold truncate">
          {value ? format(value, "dd/MM/yyyy") : placeholder}
        </span>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {value && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onChange?.(null);
              }}
              className="text-muted hover:text-foreground p-1 cursor-pointer"
            >
              <X size={16} />
            </div>
          )}
          <CalendarIcon className="text-muted h-4 w-4 pointer-events-none" />
        </div>
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={value ? format(value, "MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
        className="w-fit p-0 overflow-hidden"
      >
        <div className="p-4">
          <style>{`
            .rdp-root {
              --rdp-accent-color: #10b981;
              --rdp-accent-bg: #10b98120;
              --rdp-range-color: white;
              --rdp-range-bg: #10b981;
              font-family: inherit;
            }
            .rdp-day_button {
              font-weight: 500;
            }
            .rdp-nav_button {
              color: inherit;
            }
            .rdp-caption {
              font-weight: 700;
              text-transform: capitalize;
            }
          `}</style>
          <DayPicker
            locale={ptBR}
            mode="single"
            selected={value || undefined}
            onSelect={(date) => {
              onChange?.(date || null);
              setIsOpen(false);
            }}
            showOutsideDays
            fixedWeeks
          />
        </div>
      </Modal>
    </div>
  );
}
