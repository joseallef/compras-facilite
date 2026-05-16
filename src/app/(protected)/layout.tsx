"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { Footer } from "@/shared/layout/footer";
import { Header } from "@/shared/layout/header";
import { MobileNav } from "@/shared/layout/mobile-nav";
import { DashboardSkeleton, ShoppingListEditPageSkeleton, ShoppingListFormPageSkeleton } from "@/shared/ui/skeleton";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const redirectingRef = useRef(false);

  useEffect(() => {
    if (isLoading || redirectingRef.current) {
      return;
    }

    if (!isAuthenticated) {
      redirectingRef.current = true;
      const loginUrl = new URL("/login", window.location.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      router.replace(loginUrl.toString());
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const renderContent = () => {
    if (isLoading) {
      if (pathname.startsWith("/mercado/create")) {
        return <ShoppingListFormPageSkeleton />;
      }

      if (pathname.startsWith("/mercado/edit")) {
        return <ShoppingListEditPageSkeleton />;
      }

      if (pathname.startsWith("/dashboard")) {
        return <DashboardSkeleton />;
      }

      return (
        <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-background">
          <div className="h-8 w-8 rounded-full bg-muted/30 animate-pulse" />
        </div>
      );
    }
    
    if (!isAuthenticated) {
      return null;
    }

    return children;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex-1">
        {renderContent()}
      </div>
      <Footer />
      <MobileNav />
    </div>
  );
}
