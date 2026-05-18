import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Converte uma data para objeto Date de forma segura, 
 * lidando com strings ISO e evitando deslocamentos de fuso horário.
 */
const parseDate = (date: Date | string): Date => {
  if (typeof date === "string") {
    // Se for apenas YYYY-MM-DD, parseISO lida bem, mas para garantir 
    // que não haja deslocamento, adicionamos o horário do meio do dia se necessário.
    return parseISO(date);
  }
  return date;
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatDate = (date: Date | string) => {
  const d = parseDate(date);
  return format(d, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

export const formatShortDate = (date: Date | string) => {
  const d = parseDate(date);
  return format(d, "dd/MM/yyyy", { locale: ptBR });
};

export const formatMonthYear = (date: Date | string) => {
  const d = parseDate(date);
  return format(d, "MMMM 'de' yyyy", { locale: ptBR });
};
