export const formatCurrency = (value: string | number): string => {
  let number: number;
  
  if (typeof value === "number") {
    number = value;
  } else {
    const numericValue = value.replace(/[^\d]/g, "");
    if (!numericValue) return "";
    number = parseInt(numericValue, 10) / 100;
  }
  
  return number.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const parseCurrency = (value: string): number => {
  if (!value) return 0;
  const numericValue = value.replace(/[^\d]/g, "");
  return parseInt(numericValue, 10) / 100;
};

export const formatCurrencyInput = (value: string): string => {
  return formatCurrency(value);
};
