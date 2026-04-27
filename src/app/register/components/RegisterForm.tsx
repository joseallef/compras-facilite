"use client";

import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function RegisterForm() {
  // 1. STATES
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // 2. VARIÁVEIS
  const { register, login } = useAuth();
  const router = useRouter();

  // 3. FUNÇÕES
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFieldErrors({});
    setIsLoading(true);

    try {
      const nextErrors: typeof fieldErrors = {};
      const nameValue = name.trim();
      const emailValue = email.trim();
      const passwordValue = password;
      const confirmPasswordValue = confirmPassword;

      if (!nameValue) nextErrors.name = "Informe seu nome.";
      else if (nameValue.length < 2) nextErrors.name = "O nome deve ter pelo menos 2 caracteres.";

      if (!emailValue) nextErrors.email = "Informe seu e-mail.";
      else if (!isValidEmail(emailValue)) nextErrors.email = "Digite um e-mail válido.";

      if (!passwordValue) nextErrors.password = "Crie uma senha.";
      else if (passwordValue.length < 6) nextErrors.password = "A senha deve ter pelo menos 6 caracteres.";

      if (!confirmPasswordValue) nextErrors.confirmPassword = "Confirme sua senha.";
      else if (passwordValue && passwordValue !== confirmPasswordValue) {
        nextErrors.confirmPassword = "As senhas não coincidem.";
      }

      if (Object.keys(nextErrors).length > 0) {
        setFieldErrors(nextErrors);
        return;
      }

      await register({ name: nameValue, email: emailValue, password: passwordValue });
      
      toast.success("Conta criada com sucesso! Fazendo login...");

      // Auto-login after registration
      await login(emailValue, passwordValue);
      router.push("/lista");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao criar conta. Tente novamente.";
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
            Crie sua conta
          </h2>
          <p className="mt-2 text-muted">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-emerald-600 hover:text-emerald-500 font-medium">
              Entre aqui
            </Link>
          </p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">
                {formError}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) {
                      setFieldErrors((prev) => ({ ...prev, name: undefined }));
                    }
                    if (formError) setFormError("");
                  }}
                  placeholder="Seu nome"
                  className={`w-full pl-12 pr-4 py-2.5 bg-background border rounded-xl focus:ring-2 outline-none transition-all ${
                    fieldErrors.name
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-border focus:ring-emerald-500 focus:border-emerald-500"
                  }`}
                  disabled={isLoading}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? "register-name-error" : undefined}
                />
              </div>
              {fieldErrors.name && (
                <p id="register-name-error" className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) {
                      setFieldErrors((prev) => ({ ...prev, email: undefined }));
                    }
                    if (formError) setFormError("");
                  }}
                  placeholder="seu@email.com"
                  className={`w-full pl-12 pr-4 py-2.5 bg-background border rounded-xl focus:ring-2 outline-none transition-all ${
                    fieldErrors.email
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-border focus:ring-emerald-500 focus:border-emerald-500"
                  }`}
                  disabled={isLoading}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? "register-email-error" : undefined}
                />
              </div>
              {fieldErrors.email && (
                <p id="register-email-error" className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
                <input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password || fieldErrors.confirmPassword) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        password: undefined,
                        confirmPassword: undefined,
                      }));
                    }
                    if (formError) setFormError("");
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-2.5 bg-background border rounded-xl focus:ring-2 outline-none transition-all ${
                    fieldErrors.password
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-border focus:ring-emerald-500 focus:border-emerald-500"
                  }`}
                  disabled={isLoading}
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={fieldErrors.password ? "register-password-error" : undefined}
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
              {fieldErrors.password && (
                <p id="register-password-error" className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirmar senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
                <input
                  id="confirmPassword"
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (fieldErrors.confirmPassword) {
                      setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }
                    if (formError) setFormError("");
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-2.5 bg-background border rounded-xl focus:ring-2 outline-none transition-all ${
                    fieldErrors.confirmPassword
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-border focus:ring-emerald-500 focus:border-emerald-500"
                  }`}
                  disabled={isLoading}
                  aria-invalid={Boolean(fieldErrors.confirmPassword)}
                  aria-describedby={fieldErrors.confirmPassword ? "register-confirm-password-error" : undefined}
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
              {fieldErrors.confirmPassword && (
                <p
                  id="register-confirm-password-error"
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Criando conta...
                </>
              ) : (
                <>
                  Criar conta
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
