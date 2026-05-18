"use client";

import { cn } from "@/shared/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import {
    forwardRef,
    type ReactNode,
    useEffect,
    useRef,
    useState
} from "react";

export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface SelectProps {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  selectClassName?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    label,
    error,
    leftIcon,
    containerClassName,
    labelClassName,
    selectClassName,
    options,
    value,
    onChange,
    placeholder = "Selecione uma opção",
    disabled,
    className,
    id,
  },
  ref
) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={cn("space-y-2 relative w-full", containerClassName)} ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className={cn("block text-sm font-bold text-muted/60 uppercase tracking-wider ml-1", labelClassName)}
        >
          {label}
        </label>
      )}

      <div className={cn("relative", className)}>
        <button
          ref={ref}
          type="button"
          id={id}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "w-full flex items-center bg-card border rounded-2xl py-2.5 outline-none transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon ? "pl-12" : "pl-5",
            "pr-12 text-left shadow-sm",
            error
              ? "border-red-500 ring-4 ring-red-500/10"
              : isOpen 
                ? "border-emerald-500 ring-4 ring-emerald-500/10" 
                : "border-border hover:border-emerald-200 dark:hover:border-emerald-800",
            selectClassName
          )}
        >
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
              {leftIcon}
            </div>
          )}

          <div className="flex items-center gap-3 flex-1 overflow-hidden">
            {selectedOption?.icon && (
              <span className="text-emerald-500 flex-shrink-0">
                {selectedOption.icon}
              </span>
            )}
            <span className={cn(
              "truncate font-bold",
              !selectedOption ? "text-muted/60" : "text-foreground"
            )}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>

          <div className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 text-muted transition-transform duration-200",
            isOpen && "rotate-180 text-emerald-500"
          )}>
            <ChevronDown size={20} />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 5, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute z-[110] w-full mt-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden py-2"
            >
              <div className="max-h-32 overflow-y-auto custom-scrollbar">
                {options.length > 0 ? (
                  options.map((option) => {
                    const isSelected = option.value === value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSelect(option.value)}
                        className={cn(
                          "w-full flex items-center gap-3 px-5 py-3 transition-colors text-left",
                          isSelected 
                            ? "bg-emerald-500 text-white" 
                            : "hover:bg-muted/10 text-foreground"
                        )}
                      >
                        {option.icon && (
                          <span className={cn(
                            "flex-shrink-0",
                            isSelected ? "text-white" : "text-emerald-500"
                          )}>
                            {option.icon}
                          </span>
                        )}
                        <span className="flex-1 font-bold">{option.label}</span>
                        {isSelected && (
                          <Check size={18} className="text-white flex-shrink-0" />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="px-5 py-6 text-center text-muted-foreground">
                    <p className="text-sm font-medium">Nenhuma opção disponível</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="text-xs font-bold text-red-500 ml-1 mt-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
});
