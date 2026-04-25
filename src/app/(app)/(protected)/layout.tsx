"use client";

import { ShoppingListEditPageSkeleton, ShoppingListFormPageSkeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

/**
 * Layout para rotas protegidas.
 * A proteção principal é feita pelo middleware (proxy.ts).
 * Este layout apenas garante que o estado da sessão esteja carregado
 * para evitar flashes de conteúdo não autenticado no cliente.
 */
export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname() ?? "";
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // O middleware já redireciona se não estiver autenticado.
  // Aqui apenas mostramos o spinner enquanto a sessão inicial é hidratada no cliente,
  // embora passar a sessão via RootLayout já deva resolver isso.
  if (isLoading) {
    if (pathname.startsWith("/cadastro")) {
      return <ShoppingListFormPageSkeleton />;
    }

    if (pathname.startsWith("/edicao")) {
      return <ShoppingListEditPageSkeleton />;
    }

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 rounded-full bg-muted/30 animate-pulse" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 rounded-full bg-muted/30 animate-pulse" />
      </div>
    );
  }

  return <>{children}</>;
}
