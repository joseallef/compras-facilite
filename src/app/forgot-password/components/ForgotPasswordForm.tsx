"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, ArrowRight, Loader2, Mail, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function ForgotPasswordForm() {
  // 1. STATES
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string }>({});
  const [success, setSuccess] = useState(false);

  // 2. VARIÁVEIS
  const { forgotPassword } = useAuth();

  // 3. FUNÇÕES
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFieldErrors({});
    setSuccess(false);
    setIsLoading(true);

    try {
      const nextErrors: typeof fieldErrors = {};
      const emailValue = email.trim();

      if (!emailValue) nextErrors.email = "Informe seu e-mail.";
      else if (!isValidEmail(emailValue)) nextErrors.email = "Digite um e-mail válido.";

      if (Object.keys(nextErrors).length > 0) {
        setFieldErrors(nextErrors);
        return;
      }

      await forgotPassword(emailValue);
      setSuccess(true);
      toast.success("E-mail de recuperação enviado!");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao solicitar recuperação. Tente novamente.";
      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 5. RETURN (JSX)
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-8">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-xl">
              <ShoppingCart className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span>ComprasFácil</span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">
            Recuperar senha
          </h2>
          <p className="mt-2 text-muted">
            Enviaremos um link de recuperação para o seu e-mail
          </p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
          {success ? (
            <div className="text-center space-y-6">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl text-sm">
                Se este e-mail estiver cadastrado, você receberá um link de recuperação em instantes.
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-500 font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para o login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {formError && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">
                  {formError}
                </div>
              )}

              <Input
                id="email"
                type="email"
                label="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) {
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }
                  if (formError) setFormError("");
                }}
                placeholder="seu@email.com"
                disabled={isLoading}
                leftIcon={<Mail className="h-5 w-5" />}
                error={fieldErrors.email}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar link
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar para o login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
