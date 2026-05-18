import * as z from "zod";

const TransactionType = z.enum(["INCOME", "EXPENSE", "INVESTMENT"]);
const TransactionStatus = z.enum(["PENDING", "PAID", "OVERDUE"]);

const transactionSchemaFields = {
  title: z.string().min(1, "Título é obrigatório"),
  amount: z.string().min(1, "Valor é obrigatório"),
  type: TransactionType,
  status: TransactionStatus.default("PENDING"),
  competencyMonth: z.coerce.number().int().min(0).max(11),
  competencyYear: z.coerce.number().int(),
  categoryId: z.string().optional(),
  notes: z.string().optional(),
  dueDate: z.date().optional(),
  paidAt: z.date().optional(),
};

const transactionBaseSchema = z.object(transactionSchemaFields);

function hasRequiredCategory(data: {
  type?: z.infer<typeof TransactionType>;
  categoryId?: string;
}) {
  if (data.type !== "INVESTMENT" && !data.categoryId) {
    return false;
  }
  return true;
}

export const createTransactionSchema = transactionBaseSchema.refine(hasRequiredCategory, {
  message: "Categoria é obrigatória para receitas e despesas",
  path: ["categoryId"],
});

export const updateTransactionSchema = transactionBaseSchema.partial().refine((data) => {
  if (!data.type) {
    return true;
  }

  return hasRequiredCategory(data);
}, {
  message: "Categoria é obrigatória para receitas e despesas",
  path: ["categoryId"],
});
