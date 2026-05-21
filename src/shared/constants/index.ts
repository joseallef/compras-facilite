import {
    FrequencyType as PrismaFrequencyType,
    TransactionStatus as PrismaTransactionStatus,
    TransactionType as PrismaTransactionType,
} from "@prisma/client";

export const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
] as const;

export const YEARS = (() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 7 }, (_, i) => currentYear + i - 3);
})();

export const TransactionType = {
  INCOME: PrismaTransactionType.INCOME,
  EXPENSE: PrismaTransactionType.EXPENSE,
  INVESTMENT: PrismaTransactionType.INVESTMENT,
} as const;

export const TransactionStatus = {
  PENDING: PrismaTransactionStatus.PENDING,
  PAID: PrismaTransactionStatus.PAID,
  OVERDUE: PrismaTransactionStatus.OVERDUE,
} as const;

export const FrequencyType = {
  MONTHLY: PrismaFrequencyType.MONTHLY,
  WEEKLY: PrismaFrequencyType.WEEKLY,
  YEARLY: PrismaFrequencyType.YEARLY,
} as const;

export type TransactionType = PrismaTransactionType;
export type TransactionStatus = PrismaTransactionStatus;
export type FrequencyType = PrismaFrequencyType;

export const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f43f5e",
  "#14b8a6",
  "#6366f1",
];
