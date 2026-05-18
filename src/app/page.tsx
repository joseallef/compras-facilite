"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { Features } from "@/features/landing/components/features";
import { Hero } from "@/features/landing/components/hero";
import { Footer } from "@/shared/layout/footer";
import { Header } from "@/shared/layout/header";
import { MobileNav } from "@/shared/layout/mobile-nav";

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="h-8 w-8 rounded-full bg-muted/30 animate-pulse" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1">
          <Hero />
          <Features />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
