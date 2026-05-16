"use client";

import { MarketListForm } from "@/features/mercado/components/market-list-form";
import { useMarketLists } from "@/features/mercado/hooks/use-market-lists";
import { MarketItem } from "@/shared/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function CreatePageClient() {
  const router = useRouter();
  const { createList, addItemToList } = useMarketLists();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (name: string, items: Omit<MarketItem, "id" | "isPicked">[]) => {
    setIsSubmitting(true);
    try {
      const newList = await createList(name, false);
      
      // Add items one by one (this could be optimized in the service/action)
      for (const item of items) {
        await addItemToList(newList.id, item);
      }
      
      toast.success("Lista criada com sucesso!");
      router.push("/mercado");
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
      <MarketListForm
        title="Nova Lista"
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </main>
  );
}
