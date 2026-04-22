"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useShoppingLists } from "@/hooks/useShoppingLists";
import { ShoppingItem } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingListForm } from "../lista/components/ShoppingListForm";

export default function CadastroPage() {
  const router = useRouter();
  const { createList, addItemToList } = useShoppingLists();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (name: string, items: Omit<ShoppingItem, "id" | "isPicked">[]) => {
    setIsSubmitting(true);
    try {
      const newList = await createList(name, false);
      
      // Add items one by one (this could be optimized in the service/action)
      for (const item of items) {
        await addItemToList(newList.id, item);
      }
      
      toast.success("Lista criada com sucesso!");
      router.push("/lista");
    } catch (error) {
      toast.error("Erro ao criar lista");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8">
        <ShoppingListForm
          title="Nova Lista"
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </main>
      <Footer />
    </div>
  );
}
