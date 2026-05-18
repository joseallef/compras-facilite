import * as z from "zod";

const TransactionType = z.enum(["INCOME", "EXPENSE", "INVESTMENT"]);
const FrequencyType = z.enum(["MONTHLY", "WEEKLY", "YEARLY"]);

const recurringSchemaFields = {
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  type: TransactionType,
  categoryId: z.string().optional(),
  defaultAmount: z.string().min(1, "Valor é obrigatório"),
  frequency: FrequencyType.default("MONTHLY"),
  dueDay: z.coerce.number().int().min(1).max(31).optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
};

const recurringBaseSchema = z.object(recurringSchemaFields);

function hasRequiredCategory(data: {
  type?: z.infer<typeof TransactionType>;
  categoryId?: string;
}) {
  if (data.type !== "INVESTMENT" && !data.categoryId) {
    return false;
  }
  return true;
}

export const createRecurringSchema = recurringBaseSchema.refine(hasRequiredCategory, {
  message: "Categoria é obrigatória para receitas e despesas",
  path: ["categoryId"],
});

export const updateRecurringSchema = recurringBaseSchema.partial().refine((data) => {
  if (!data.type) {
    return true;
  }

  return hasRequiredCategory(data);
}, {
  message: "Categoria é obrigatória para receitas e despesas",
  path: ["categoryId"],
});
