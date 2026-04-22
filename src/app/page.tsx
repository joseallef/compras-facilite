import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Features } from "./components/Features";
import { Hero } from "./components/Hero";

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
