"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { Footer } from "@/shared/layout/footer";
import { Header } from "@/shared/layout/header";
import { MobileNav } from "@/shared/layout/mobile-nav";
import { DashboardSkeleton, ShoppingListEditPageSkeleton, ShoppingListFormPageSkeleton } from "@/shared/ui/skeleton";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname() ?? "";

  if (isLoading) {
    if (pathname.startsWith("/shopping/create")) {
      return <ShoppingListFormPageSkeleton />;
    }

    if (pathname.startsWith("/shopping/edit")) {
      return <ShoppingListEditPageSkeleton />;
    }

    if (pathname.startsWith("/dashboard")) {
      return <DashboardSkeleton />;
    }

    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="h-8 w-8 rounded-full bg-muted/30 animate-pulse" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="h-8 w-8 rounded-full bg-muted/30 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
      <MobileNav />
    </div>
  );
}
