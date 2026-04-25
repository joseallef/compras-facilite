"use client";

import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export function LoginForm() {
  // 1. STATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 2. VARIÁVEIS
  const { login } = useAuth();
  const router = useRouter();

  // 3. FUNÇÕES
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError("Preencha todos os campos");
        return;
      }

      if (!email.includes("@")) {
        setError("Digite um email válido");
        return;
      }

      await login(email, password);
      toast.success("Login realizado com sucesso!");
      router.push("/lista");
    } catch {
      const errorMessage = "Erro ao fazer login. Verifique suas credenciais.";
      setError(errorMessage);
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
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Senha
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

            <button
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
            </button>
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
