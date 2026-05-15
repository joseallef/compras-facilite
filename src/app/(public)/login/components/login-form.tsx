"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function LoginForm() {
  // 1. STATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  // 2. VARIÁVEIS
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 3. EFFECTS
  useEffect(() => {
    const sessionParam = searchParams.get("session");
    if (sessionParam === "expired") {
      toast.warning("Sua sessão expirou. Por favor, faça login novamente.");
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("session");
      router.replace(newUrl.toString(), { scroll: false });
    }
  }, [searchParams, router]);

  // 3. FUNÇÕES
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFieldErrors({});
    setIsLoading(true);

    try {
      const nextErrors: typeof fieldErrors = {};
      const emailValue = email.trim();
      const passwordValue = password;

      if (!emailValue) nextErrors.email = "Informe seu e-mail.";
      else if (!isValidEmail(emailValue)) nextErrors.email = "Digite um e-mail válido.";

      if (!passwordValue) nextErrors.password = "Informe sua senha.";

      if (Object.keys(nextErrors).length > 0) {
        setFieldErrors(nextErrors);
        return;
      }

      await login(emailValue, passwordValue);
      toast.success("Login realizado com sucesso!");
      
      const callbackUrl = searchParams.get("callbackUrl");
      router.push(callbackUrl || "/dashboard");
    } catch {
      const errorMessage = "Erro ao fazer login. Verifique suas credenciais.";
      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. EFFECTS

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
            Bem-vindo de volta
          </h2>
          <p className="mt-2 text-muted">
            Ou{" "}
            <Link href="/register" className="text-emerald-600 hover:text-emerald-500 font-medium">
              cadastre-se gratuitamente
            </Link>
          </p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
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

            <Input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              label="Senha"
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted">
            <p>
              Esqueceu sua senha?{" "}
              <Link href="/forgot-password" className="text-emerald-600 hover:text-emerald-500 font-medium">
                Recupere aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
