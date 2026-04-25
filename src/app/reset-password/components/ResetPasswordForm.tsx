"use client";

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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // 2. VARIÁVEIS
  const { resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? null;

  // 3. FUNÇÕES
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      if (!token) {
        setError("Token de recuperação ausente.");
        return;
      }

      if (!password || !confirmPassword) {
        setError("Preencha todos os campos");
        return;
      }

      if (password !== confirmPassword) {
        setError("As senhas não coincidem");
        return;
      }

      if (password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres");
        return;
      }

      await resetPassword({ token, password });
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
      setError(errorMessage);
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
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Nova senha
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
              <input
                id="password"
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-muted hover:text-foreground hover:bg-muted/10 transition-all"
                aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                disabled={isLoading}
              >
                {isPasswordVisible ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirmar nova senha
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
              <input
                id="confirmPassword"
                type={isConfirmPasswordVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-muted hover:text-foreground hover:bg-muted/10 transition-all"
                aria-label={isConfirmPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                disabled={isLoading}
              >
                {isConfirmPasswordVisible ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
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
          </button>
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
