"use client";

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
      console.error("[handleSubmit]", error);
      const message = error instanceof Error ? error.message : "Erro ao criar lista";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto w-full p-4 md:p-8">
      <ShoppingListForm
        title="Nova Lista"
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </main>
  );
}

