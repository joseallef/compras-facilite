import AppLayout from "./(app)/layout";
import { Features } from "./components/Features";
import { Hero } from "./components/Hero";

export default function LandingPage() {
  return (
    <AppLayout>
      <Hero />
      <Features />
    </AppLayout>
  );
}
