"use client";

import { AuthLoading } from "@/features/auth/components/auth-loading";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { motion } from "framer-motion";
import { Apple, ArrowRight, Beef, Carrot, Eye, EyeOff, Lock, Mail, Milk, Package, ShoppingBag, ShoppingCart, TrendingUp, Wallet } from "lucide-react";
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
  const sideIcons = [
    { Icon: ShoppingCart, color: "text-emerald-500", delay: 0 },
    { Icon: ShoppingBag, color: "text-blue-500", delay: 0.2 },
    { Icon: TrendingUp, color: "text-purple-500", delay: 0.4 },
    { Icon: Wallet, color: "text-orange-500", delay: 0.6 },
    { Icon: Package, color: "text-pink-500", delay: 0.8 },
    { Icon: Apple, color: "text-red-500", delay: 1 },
    { Icon: Carrot, color: "text-orange-600", delay: 1.2 },
    { Icon: Beef, color: "text-rose-600", delay: 1.4 },
    { Icon: Milk, color: "text-sky-500", delay: 1.6 },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30 relative overflow-hidden">
      {/* Animações nas laterais (desktop) e topo/baixo (mobile) - apenas durante loading */}
      {isLoading && (
        <>
          <div className="hidden lg:block absolute left-4 top-1/2 -translate-y-1/2 space-y-8">
            {sideIcons.slice(0, 5).map(({ Icon, color, delay }, index) => (
              <motion.div
                key={`left-${index}`}
                initial={{ x: -100, opacity: 0 }}
                animate={{
                  x: [0, 20, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: delay,
                  ease: "easeInOut",
                }}
              >
                <div className="bg-muted/30 p-3 rounded-2xl">
                  <Icon className={`h-7 w-7 ${color}`} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 space-y-8">
            {sideIcons.slice(5).map(({ Icon, color, delay }, index) => (
              <motion.div
                key={`right-${index}`}
                initial={{ x: 100, opacity: 0 }}
                animate={{
                  x: [0, -20, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: delay,
                  ease: "easeInOut",
                }}
              >
                <div className="bg-muted/30 p-3 rounded-2xl">
                  <Icon className={`h-7 w-7 ${color}`} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Animações no topo e baixo para mobile - apenas durante loading */}
          <div className="lg:hidden absolute top-4 left-1/2 -translate-x-1/2 flex gap-4">
            {sideIcons.slice(0, 4).map(({ Icon, color, delay }, index) => (
              <motion.div
                key={`top-${index}`}
                initial={{ y: -50, opacity: 0 }}
                animate={{
                  y: [0, 15, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: delay * 0.5,
                  ease: "easeInOut",
                }}
              >
                <div className="bg-muted/30 p-2 rounded-xl">
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
            {sideIcons.slice(5).map(({ Icon, color, delay }, index) => (
              <motion.div
                key={`bottom-${index}`}
                initial={{ y: 50, opacity: 0 }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: delay * 0.5,
                  ease: "easeInOut",
                }}
              >
                <div className="bg-muted/30 p-2 rounded-xl">
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      <div className="max-w-md w-full space-y-8 relative z-10">
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
                  <AuthLoading />
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
