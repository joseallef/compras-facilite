import { Features } from "@/features/landing/components/features";
import { Hero } from "@/features/landing/components/hero";
import { Header } from "@/shared/layout/header";
import { Footer } from "@/shared/layout/footer";

export default function LandingPage() {
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
