"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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

            <Input
              id="name"
              type="text"
              label="Nome completo"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) {
                  setFieldErrors((prev) => ({ ...prev, name: undefined }));
                }
                if (formError) setFormError("");
              }}
              placeholder="Seu nome"
              disabled={isLoading}
              leftIcon={<User className="h-5 w-5" />}
              error={fieldErrors.name}
              containerClassName="space-y-1"
              inputClassName="py-2.5"
            />

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
              containerClassName="space-y-1"
              inputClassName="py-2.5"
            />

            <Input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              label="Senha"
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
              containerClassName="space-y-1"
              inputClassName="py-2.5"
            />

            <Input
              id="confirmPassword"
              type={isConfirmPasswordVisible ? "text" : "password"}
              label="Confirmar senha"
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
              containerClassName="space-y-1"
              inputClassName="py-2.5"
            />

            <Button
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
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
