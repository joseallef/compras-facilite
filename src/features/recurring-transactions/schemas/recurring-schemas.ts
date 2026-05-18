import * as z from "zod";

const TransactionType = z.enum(["INCOME", "EXPENSE", "INVESTMENT"]);
const FrequencyType = z.enum(["MONTHLY", "WEEKLY", "YEARLY"]);

function hasRequiredCategory(data: {
  type?: z.infer<typeof TransactionType>;
  categoryId?: string;
}) {
  if (data.type !== "INVESTMENT" && !data.categoryId) {
    return false;
  }
  return true;
}

const recurringBaseSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  type: TransactionType,
  categoryId: z.string().optional(),
  defaultAmount: z.string().min(1, "Valor é obrigatório"),
  frequency: FrequencyType.default("MONTHLY"),
  dueDay: z.any().transform((val) => {
    if (val === "" || val === undefined || val === null) {
      return undefined;
    }
    const num = typeof val === "string" ? parseInt(val, 10) : val;
    if (Number.isInteger(num) && num >= 1 && num <= 31) {
      return num;
    }
    return undefined;
  }).optional(),
});

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
