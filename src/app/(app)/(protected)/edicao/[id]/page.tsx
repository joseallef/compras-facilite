"use client";

import { Button } from "@/components/ui/Button";
import { FinishShoppingModal } from "@/components/ui/FinishShoppingModal";
import { Input } from "@/components/ui/Input";
import { ShoppingListEditPageSkeleton } from "@/components/ui/Skeleton";
import { useListDetail } from "@/hooks/useListDetail";
import { Category } from "@/types";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, DollarSign, Lock, ShoppingCart } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { AddItemForm } from "../../lista/components/AddItemForm";
import { CategorySection } from "../../lista/components/CategorySection";

export default function EdicaoPage() {
  const router = useRouter();
  const params = useParams();
  
  const rawId = params?.id;
  const listId = typeof rawId === "string" && rawId.length > 0 ? rawId : null;

  const { 
    list, 
    pickedCount, 
    totalCount, 
    progress, 
    updateList, 
    addItemToList, 
    removeItemFromList, 
    toggleItemPicked, 
    updateItemQuantity, 
    isLoaded 
  } = useListDetail(listId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAtMarket, setIsAtMarket] = useState(false);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && !listId) {
      router.replace("/lista");
    }
  }, [isLoaded, listId, router]);

  const handleUpdateListName = useDebouncedCallback(async (name: string) => {
    if (!listId) return;
    try {
      await updateList(listId, { name });
    } catch (error) {
      console.error("[handleUpdateListName]", error);
      toast.error("Erro ao atualizar nome da lista");
    }
  }, 500);

  const handleAddItem = async (name: string, category: Category) => {
    if (!listId) return;
    setIsSubmitting(true);
    try {
      await addItemToList(listId, { name, quantity: 1, unit: "un", category });
    } catch (error) {
      console.error("[handleAddItem]", error);
      toast.error("Erro ao adicionar item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishShopping = async (totalValue: number) => {
    if (!listId) return;
    setIsSubmitting(true);
    try {
      await updateList(listId, { 
        status: "CONCLUIDA", 
        totalValue 
      });
      toast.success("Compra finalizada com sucesso!");
    } catch (error) {
      console.error("[handleFinishShopping]", error);
      toast.error("Erro ao finalizar compra");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReopenShopping = async () => {
    if (!listId) return;
    setIsSubmitting(true);
    try {
      await updateList(listId, { 
        status: "ABERTA" 
      });
      toast.success("Lista reaberta para edição");
    } catch (error) {
      console.error("[handleReopenShopping]", error);
      toast.error("Erro ao reabrir lista");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return <ShoppingListEditPageSkeleton />;
  }

  if (!listId || !list) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Lista não encontrada</h2>
          <Button
            onClick={() => router.push("/lista")}
            className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Voltar para minhas listas
          </Button>
        </div>
      </div>
    );
  }

  const isClosed = list.status === "CONCLUIDA";

  return (
    <main className="max-w-4xl mx-auto w-full p-4 md:p-8">
      <motion.div
        key="detail"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6 pb-24"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-4 flex-1">
            <Button
              onClick={() => router.push("/lista")}
              className="bg-card p-2.5 rounded-2xl border border-border text-muted hover:text-emerald-600 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all active:scale-90"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex-1 relative group">
              <Input
                type="text"
                defaultValue={list.name}
                onChange={(e) => handleUpdateListName(e.target.value)}
                placeholder="Nome da Lista"
                containerClassName="space-y-0"
                inputClassName="text-2xl md:text-3xl font-bold bg-transparent border-none p-0 focus:ring-0 text-foreground outline-none rounded-none"
              />
              {isClosed && (
                <div className="absolute -top-6 left-0 flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
                  <Lock size={10} />
                  Lista Concluída
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isClosed && list.totalValue != null && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 font-bold shadow-sm">
                <DollarSign size={18} />
                <span>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(list.totalValue)}
                </span>
              </div>
            )}
            
            <Button
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
            </Button>
          </div>
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

        {!isAtMarket && !isClosed && (
          <AddItemForm onAdd={handleAddItem} isLoading={isSubmitting} />
        )}

        {isClosed && !isAtMarket && (
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-3xl p-6 text-center space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-amber-800 dark:text-amber-300">Esta lista está concluída</h3>
              <p className="text-sm text-amber-700/70 dark:text-amber-400/70">
                Você pode revisar os itens abaixo ou reabrir a lista para fazer alterações.
              </p>
            </div>
            <Button
              onClick={handleReopenShopping}
              className="px-6 py-2 bg-white dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 rounded-xl font-bold hover:bg-amber-100 transition-all active:scale-95"
            >
              Reabrir Lista
            </Button>
          </div>
        )}

        <CategorySection
          items={list.items}
          isAtMarket={isAtMarket}
          onToggle={(itemId) => toggleItemPicked(listId, itemId)}
          onQuantityChange={(itemId, qty) => updateItemQuantity(listId, itemId, qty)}
          onRemove={(itemId) => removeItemFromList(listId, itemId)}
        />
      </motion.div>

      {(isAtMarket || (pickedCount === totalCount && totalCount > 0 && !isClosed)) && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/80 backdrop-blur-md border-t border-border flex justify-center z-10">
          <div className="max-w-4xl w-full flex justify-between items-center px-4">
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-xs text-muted uppercase font-bold text-[10px]">Pegos</p>
                <p className="text-xl font-bold text-emerald-600">{pickedCount}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted uppercase font-bold text-[10px]">Faltam</p>
                <p className="text-xl font-bold text-amber-500">
                  {totalCount - pickedCount}
                </p>
              </div>
            </div>

            {pickedCount === totalCount && totalCount > 0 && !isClosed ? (
              <Button
                onClick={() => setIsFinishModalOpen(true)}
                className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95"
              >
                <CheckCircle2 size={20} />
                Finalizar Compra
              </Button>
            ) : isAtMarket ? (
              <div className="flex items-center gap-3">
                 <Button
                  onClick={() => setIsFinishModalOpen(true)}
                  className="bg-muted/10 hover:bg-muted/20 text-foreground px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 border border-border"
                >
                  Fechar
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <FinishShoppingModal
        isOpen={isFinishModalOpen}
        onClose={() => setIsFinishModalOpen(false)}
        onConfirm={handleFinishShopping}
        isLoading={isSubmitting}
      />
    </main>
  );
}
