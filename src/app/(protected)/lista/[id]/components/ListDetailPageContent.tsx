"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useShoppingLists } from "@/hooks/useShoppingLists";
import { Category } from "@/types";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddItemForm } from "./AddItemForm";
import { CategorySection } from "./CategorySection";

interface ListDetailPageContentProps {
  listId: string;
}

export function ListDetailPageContent({ listId }: ListDetailPageContentProps) {
  // 1. STATES
  const [isAtMarket, setIsAtMarket] = useState(false);

  // 2. VARIÁVEIS
  const router = useRouter();
  const { lists, updateList, addItemToList, removeItemFromList, toggleItemPicked, updateItemQuantity, isLoaded } = useShoppingLists();
  const list = lists.find((l) => l.id === listId);

  // 3. FUNÇÕES
  const handleAddItem = (name: string, category: Category) => {
    addItemToList(listId, { name, quantity: 1, unit: "un", category });
  };

  // 4. EFFECTS

  // 5. RETURN (JSX)
  if (!isLoaded) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-card rounded-2xl border border-border w-3/4" />
            <div className="h-16 bg-card rounded-3xl border border-border" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-card rounded-2xl border border-border" />
              ))}
            </div>
          </div>
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

  const pickedCount = list.items.filter((i) => i.isPicked).length;
  const totalCount = list.items.length;
  const progress = totalCount > 0 ? (pickedCount / totalCount) * 100 : 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8">
        <motion.div
          key="detail"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => router.push("/lista")}
              className="bg-card p-2.5 rounded-2xl border border-border text-muted hover:text-emerald-600 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all active:scale-90"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <input
                type="text"
                value={list.name}
                onChange={(e) => updateList(listId, { name: e.target.value })}
                className="text-2xl md:text-3xl font-bold bg-transparent border-none p-0 focus:ring-0 text-foreground w-full outline-none"
                placeholder="Nome da Lista"
              />
            </div>
            <button
              onClick={() => setIsAtMarket(!isAtMarket)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold transition-all shadow-lg active:scale-95",
                isAtMarket
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                  : "bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-700"
              )}
            >
              <ShoppingCart size={20} />
              {isAtMarket ? "Editar Lista" : "No Mercado"}
            </button>
          </div>

          <div className="bg-card p-4 rounded-3xl border border-border shadow-sm flex items-center gap-4">
            <div className="flex-1 h-3 bg-muted/20 rounded-full overflow-hidden border border-muted/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-emerald-500 rounded-full"
              />
            </div>
            <span className="font-bold whitespace-nowrap">
              {pickedCount}/{totalCount} itens
            </span>
          </div>

          {!isAtMarket && <AddItemForm onAdd={handleAddItem} />}

          <CategorySection
            items={list.items}
            isAtMarket={isAtMarket}
            onToggle={(itemId) => toggleItemPicked(listId, itemId)}
            onQuantityChange={(itemId, qty) => updateItemQuantity(listId, itemId, qty)}
            onRemove={(itemId) => removeItemFromList(listId, itemId)}
          />
        </motion.div>
      </main>

      {isAtMarket && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/80 backdrop-blur-md border-t border-border flex justify-center z-10">
          <div className="max-w-4xl w-full flex justify-between items-center">
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-xs text-muted uppercase font-bold">Pegos</p>
                <p className="text-xl font-bold text-emerald-600">{pickedCount}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted uppercase font-bold">Faltam</p>
                <p className="text-xl font-bold text-amber-500">
                  {totalCount - pickedCount}
                </p>
              </div>
            </div>

            {list.items.every((i) => i.isPicked) && list.items.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-emerald-600 text-white px-6 py-2 rounded-2xl font-bold flex items-center gap-2"
              >
                <CheckCircle2 size={20} />
                Lista Completa!
              </motion.div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
