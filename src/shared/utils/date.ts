import { startOfDay, endOfDay, addHours, parseISO } from "date-fns";

/**
 * Normaliza uma data para o meio do dia (12:00) em UTC.
 * Isso evita que mudanças de fuso horário (como o de Brasília -03:00) 
 * desloquem a data para o dia anterior ou posterior ao converter para UTC no banco de dados.
 */
export const normalizeToUTC = (date: Date | string | number): Date => {
  const d = typeof date === "string" ? parseISO(date) : new Date(date);
  // Definimos 12:00 para garantir que, independente do fuso (até +/- 12h), 
  // a data permaneça no mesmo dia calendário.
  const normalized = startOfDay(d);
  return addHours(normalized, 12);
};

/**
 * Retorna o início do dia para uma data, garantindo consistência.
 */
export const getStartOfDay = (date: Date | string | number): Date => {
  return startOfDay(normalizeToUTC(date));
};

/**
 * Retorna o fim do dia para uma data, garantindo consistência.
 */
export const getEndOfDay = (date: Date | string | number): Date => {
  return endOfDay(normalizeToUTC(date));
};

/**
 * Converte uma data vinda do banco (UTC) para exibição local sem deslocamento.
 */
export const toLocalDate = (date: Date | string): Date => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d;
};
