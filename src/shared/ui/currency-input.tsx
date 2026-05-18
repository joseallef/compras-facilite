"use client";

import { Input, InputProps } from "@/shared/ui/input";
import { formatCurrency, parseCurrency } from "@/shared/utils/currency";
import { useEffect, useState } from "react";

interface CurrencyInputProps extends Omit<InputProps, "onChange" | "value"> {
  value?: string | number;
  onChange?: (value: string, rawValue: number) => void;
}

export function CurrencyInput({
  value,
  onChange,
  placeholder = "0,00",
  ...props
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    if (value !== undefined && value !== null) {
      setDisplayValue(formatCurrency(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatCurrency(rawValue);
    setDisplayValue(formatted);
    
    if (onChange) {
      const numericValue = parseCurrency(formatted);
      onChange(formatted, numericValue);
    }
  };

  return (
    <Input
      placeholder={placeholder}
      value={displayValue}
      onChange={handleChange}
      inputMode="decimal"
      {...props}
    />
  );
}
