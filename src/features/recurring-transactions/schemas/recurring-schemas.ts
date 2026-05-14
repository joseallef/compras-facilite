import * as z from "zod";

const TransactionType = z.enum(["INCOME", "EXPENSE"]);
const FrequencyType = z.enum(["MONTHLY", "WEEKLY", "YEARLY"]);

export const createRecurringSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  type: TransactionType,
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  defaultAmount: z.string().min(1, "Valor é obrigatório"),
  frequency: FrequencyType.default("MONTHLY"),
  dueDay: z.coerce.number().int().min(1).max(31).optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
});

export const updateRecurringSchema = createRecurringSchema.partial();
