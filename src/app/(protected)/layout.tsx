"use client";

import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

/**
 * Layout para rotas protegidas.
 * A proteção principal é feita pelo middleware (proxy.ts).
 * Este layout apenas garante que o estado da sessão esteja carregado
 * para evitar flashes de conteúdo não autenticado no cliente.
 */
export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  // O middleware já redireciona se não estiver autenticado.
  // Aqui apenas mostramos o spinner enquanto a sessão inicial é hidratada no cliente,
  // embora passar a sessão via RootLayout já deva resolver isso.
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  // Se o middleware falhar por algum motivo, este é o fallback de segurança.
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
