import * as z from "zod";

const TransactionType = z.enum(["INCOME", "EXPENSE"]);
const TransactionStatus = z.enum(["PENDING", "PAID", "OVERDUE"]);

export const createTransactionSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  amount: z.string().min(1, "Valor é obrigatório"),
  type: TransactionType,
  status: TransactionStatus.default("PENDING"),
  competencyMonth: z.coerce.number().int().min(0).max(11),
  competencyYear: z.coerce.number().int(),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  notes: z.string().optional(),
  dueDate: z.date().optional(),
  paidAt: z.date().optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();
