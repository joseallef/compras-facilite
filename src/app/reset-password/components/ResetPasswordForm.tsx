"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { toast } from "sonner";

function ResetPasswordFormContent() {
  // 1. STATES
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [success, setSuccess] = useState(false);

  // 2. VARIÁVEIS
  const { resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? null;

  // 3. FUNÇÕES
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFieldErrors({});
    setSuccess(false);
    setIsLoading(true);

    try {
      if (!token) {
        setFormError("Token de recuperação ausente.");
        return;
      }

      const nextErrors: typeof fieldErrors = {};
      const passwordValue = password;
      const confirmPasswordValue = confirmPassword;

      if (!passwordValue) nextErrors.password = "Crie uma nova senha.";
      else if (passwordValue.length < 6) nextErrors.password = "A senha deve ter pelo menos 6 caracteres.";

      if (!confirmPasswordValue) nextErrors.confirmPassword = "Confirme sua nova senha.";
      else if (passwordValue && passwordValue !== confirmPasswordValue) {
        nextErrors.confirmPassword = "As senhas não coincidem.";
      }

      if (Object.keys(nextErrors).length > 0) {
        setFieldErrors(nextErrors);
        return;
      }

      await resetPassword({ token, password: passwordValue });
      setSuccess(true);
      toast.success("Senha redefinida com sucesso!");
      
      // Redirect to login after a few seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao redefinir senha. O link pode ter expirado.";
      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 5. RETURN (JSX)
  if (!token) {
    return (
      <div className="bg-card border border-border rounded-3xl p-8 shadow-xl text-center space-y-4">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">
          Link de recuperação inválido ou expirado.
        </div>
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-500 font-medium"
        >
          Solicitar novo link
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
      {success ? (
        <div className="text-center space-y-4">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl text-sm">
            Senha redefinida com sucesso! Redirecionando para o login...
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {formError && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">
              {formError}
            </div>
          )}

          <Input
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            label="Nova senha"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) {
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }
              if (formError) setFormError("");
            }}
            placeholder="••••••••"
            disabled={isLoading}
            leftIcon={<Lock className="h-5 w-5" />}
            rightSlot={
              <Button
                type="button"
                onClick={() => setIsPasswordVisible((prev) => !prev)}
                className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-muted/10 transition-all"
                aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                disabled={isLoading}
              >
                {isPasswordVisible ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </Button>
            }
            error={fieldErrors.password}
          />

          <Input
            id="confirmPassword"
            type={isConfirmPasswordVisible ? "text" : "password"}
            label="Confirmar nova senha"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (fieldErrors.confirmPassword) {
                setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }
              if (formError) setFormError("");
            }}
            placeholder="••••••••"
            disabled={isLoading}
            leftIcon={<Lock className="h-5 w-5" />}
            rightSlot={
              <Button
                type="button"
                onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
                className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-muted/10 transition-all"
                aria-label={isConfirmPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                disabled={isLoading}
              >
                {isConfirmPasswordVisible ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </Button>
            }
            error={fieldErrors.confirmPassword}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Redefinindo...
              </>
            ) : (
              <>
                Redefinir senha
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}

export function ResetPasswordForm() {
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
            Redefinir sua senha
          </h2>
          <p className="mt-2 text-muted">
            Crie uma nova senha para sua conta
          </p>
        </div>

        <Suspense fallback={
          <div className="bg-card border border-border rounded-3xl p-8 shadow-xl flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        }>
          <ResetPasswordFormContent />
        </Suspense>
      </div>
    </div>
  );
}
