"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useShoppingLists } from "@/hooks/useShoppingLists";
import { ShoppingItem } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingListForm } from "../../lista/components/ShoppingListForm";
import { Loader2 } from "lucide-react";

export default function EdicaoPage() {
  const router = useRouter();
  const params = useParams();
  const listId = params.id as string;
  const { lists, updateList, addItemToList, removeItemFromList, isLoaded } = useShoppingLists();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const list = lists.find((l) => l.id === listId);

  const handleSubmit = async (name: string, items: Omit<ShoppingItem, "id" | "isPicked">[]) => {
    setIsSubmitting(true);
    try {
      // 1. Update name
      await updateList(listId, { name });

      // 2. Simplistic update: remove all current items and add new ones
      // This is not very efficient but works for now
      if (list) {
        for (const item of list.items) {
          await removeItemFromList(listId, item.id);
        }
      }

      for (const item of items) {
        await addItemToList(listId, item);
      }

      toast.success("Lista atualizada com sucesso!");
      router.push("/lista");
    } catch (error) {
      toast.error("Erro ao atualizar lista");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!list) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Lista não encontrada</h2>
            <button
              onClick={() => router.push("/lista")}
              className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Voltar para minhas listas
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8">
        <ShoppingListForm
          title="Editar Lista"
          initialData={list}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </main>
      <Footer />
    </div>
  );
}
