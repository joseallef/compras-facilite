"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { Footer } from "@/shared/layout/footer";
import { Header } from "@/shared/layout/header";
import { MobileNav } from "@/shared/layout/mobile-nav";
import { ShoppingListEditPageSkeleton, ShoppingListFormPageSkeleton } from "@/shared/ui/skeleton";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

/**
 * Layout para rotas protegidas.
 * A proteção principal é feita pelo middleware.ts.
 * Este layout garante que o estado da sessão esteja carregado,
 * redireciona se necessário e fornece a estrutura de navegação comum.
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
  // Aqui apenas mostramos o spinner enquanto a sessão inicial é hidratada no cliente.
  if (isLoading) {
    if (pathname.startsWith("/shopping/create")) {
      return <ShoppingListFormPageSkeleton />;
    }

    if (pathname.startsWith("/shopping/edit")) {
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
      <MobileNav />
    </div>
  );
}
