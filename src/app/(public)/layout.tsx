import { Header } from "@/shared/layout/header";
import { Footer } from "@/shared/layout/footer";
import { ReactNode } from "react";

/**
 * Layout para rotas públicas (Login, Registro, etc.)
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
