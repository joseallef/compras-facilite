import * as z from "zod";

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z
      .string()
      .trim()
      .min(1, "E-mail é obrigatório")
      .email("E-mail inválido"),
    currentPassword: z
      .string()
      .trim()
      .min(1, "Senha atual é obrigatória"),
    newPassword: z
      .string()
      .trim()
      .min(6, "Nova senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z
      .string()
      .trim()
      .min(1, "Confirmação de senha é obrigatória"),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Confirmação de senha não corresponde",
        path: ["confirmPassword"],
      });
    }
  });
