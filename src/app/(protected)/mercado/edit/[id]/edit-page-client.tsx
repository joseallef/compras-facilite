"use client";

import { AddItemForm } from "@/features/mercado/components/add-item-form";
import { CategorySection } from "@/features/mercado/components/category-section";
import { useListDetail } from "@/features/mercado/hooks/use-list-detail";
import {
  createOrUpdateShoppingListTransaction,
  getTransactionCategories
} from "@/features/transactions/services/transaction-service";
import { Category, MarketItem } from "@/shared/types";
import { Button } from "@/shared/ui/button";
import { ConfirmModal } from "@/shared/ui/confirm-modal";
import { EditItemModal } from "@/shared/ui/edit-item-modal";
import { FinishMarketModal } from "@/shared/ui/finish-market-modal";
import { Input } from "@/shared/ui/input";
import { MarketEditPageSkeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/utils/cn";
import { normalizeString } from "@/shared/utils/string";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, DollarSign, Edit, Lock, Search, ShoppingCart, X } from "lucide-react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { TransactionType } from "@prisma/client";

export function EditPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  
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
    updateItemInList,
    isLoaded 
  } = useListDetail(listId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAtMarket = searchParams.get("mode") === "market";
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MarketItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isLoaded && !listId) {
      router.replace("/mercado");
    }
  }, [isLoaded, listId, router]);

  const filteredItems = useMemo(() => {
    const items = list?.items || [];
    if (!searchQuery.trim()) return items;
    
    const query = normalizeString(searchQuery);
    return items.filter((item: MarketItem) => 
      normalizeString(item.name).includes(query) || 
      normalizeString(item.category).includes(query)
    );
  }, [list?.items, searchQuery]);

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
      const message = error instanceof Error ? error.message : "Erro ao adicionar item";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditItem = (item: MarketItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleRemoveItemRequest = (itemId: string) => {
    setItemToDelete(itemId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!listId || !itemToDelete) return;
    setIsSubmitting(true);
    try {
      await removeItemFromList(listId, itemToDelete);
      toast.success("Item removido com sucesso!");
    } catch (error) {
      console.error("[handleConfirmDelete]", error);
      const message = error instanceof Error ? error.message : "Erro ao remover item";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleUpdateItem = async (data: { name: string; category: Category; quantity: number; unit: string }) => {
    if (!listId || !editingItem) return;
    setIsSubmitting(true);
    try {
      await updateItemInList(listId, editingItem.id, data);
      toast.success("Item atualizado com sucesso!");
    } catch (error) {
      console.error("[handleUpdateItem]", error);
      const message = error instanceof Error ? error.message : "Erro ao atualizar item";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
      setIsEditModalOpen(false);
      setEditingItem(null);
    }
  };

  const handleFinishShopping = async (totalValue: number) => {
    if (!listId || !list) return;
    setIsSubmitting(true);
    try {
      // 1. Atualizar a lista para CONCLUIDA
      await updateList(listId, { 
        status: "CONCLUIDA", 
        totalValue 
      });

      // 2. Criar ou atualizar transação financeira se houver valor
      if (totalValue > 0) {
        const categories = await getTransactionCategories(TransactionType.EXPENSE);
        let marketCategory = categories.find((c: any) => c.name.toLowerCase() === "mercado");
        
        // Se não existir categoria mercado, tenta criar uma ou usa a primeira
        if (!marketCategory) {
          marketCategory = categories[0];
        }

        if (marketCategory) {
          const now = new Date();
          await createOrUpdateShoppingListTransaction(
            listId,
            {
              title: list.name,
              amount: totalValue,
              type: TransactionType.EXPENSE,
              competencyMonth: now.getMonth(),
              competencyYear: now.getFullYear(),
              categoryId: marketCategory.id,
              notes: `Lista de compras concluída`,
            }
          );
        }
      }

      toast.success("Compra finalizada e registrada no financeiro!");
      router.push("/mercado");
    } catch (error) {
      console.error("[handleFinishShopping]", error);
      const message = error instanceof Error ? error.message : "Erro ao finalizar compra";
      toast.error(message);
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
      const message = error instanceof Error ? error.message : "Erro ao reabrir lista";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return <MarketEditPageSkeleton />;
  }

  if (!listId || !list) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Lista não encontrada</h2>
          <Button
            onClick={() => router.push("/mercado")}
            className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Voltar para minhas listas
          </Button>
        </div>
      </div>
    );
  }

  const toggleMarketMode = () => {
    const p = new URLSearchParams(searchParams?.toString());
    if (isAtMarket) {
      p.delete("mode");
    } else {
      p.set("mode", "market");
    }
    router.replace(`${pathname}?${p.toString()}`);
  };

  const isClosed = list.status === "CONCLUIDA";

  return (
    <main className="max-w-7xl mx-auto w-full p-4 md:p-8">
      <motion.div
        key="detail"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6 pb-24 pt-4 md:pt-0"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-4 flex-1">
            <Button
              onClick={() => router.push("/mercado")}
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
                disabled={isClosed}
                containerClassName="space-y-0"
                inputClassName={cn(
                  "text-2xl md:text-3xl font-bold bg-card border border-border p-3 md:p-4 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 text-foreground outline-none pr-12",
                  !isClosed && "hover:border-emerald-300 dark:hover:border-emerald-700 transition-all",
                  isClosed && "opacity-80 cursor-not-allowed"
                )}
              />
              {!isClosed && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  <Edit size={18} />
                </div>
              )}
              {isClosed && (
                <div className="absolute -top-5 md:-top-6 left-0 flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
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
            
            {!isClosed && (
              <Button
                onClick={toggleMarketMode}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold transition-all shadow-lg active:scale-95",
                  isAtMarket
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                    : "bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-70"
                )}
              >
                <ShoppingCart size={20} />
                {isAtMarket ? "Editar Lista" : "No Mercado"}
              </Button>
            )}
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
          <div className="bg-card border-t border-border p-6 shadow-2xl">
            <AddItemForm onAdd={handleAddItem} isLoading={isSubmitting} />
          </div>
        )}

        {isAtMarket && (
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted transition-colors group-focus-within:text-emerald-500" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar itens ou categorias..."
              containerClassName="space-y-0"
              inputClassName="pl-12 pr-12 h-14 bg-card border-border rounded-2xl focus:ring-2 focus:ring-emerald-500/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-muted" />
              </button>
            )}
          </div>
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
          items={filteredItems}
          isAtMarket={isAtMarket || isClosed}
          onToggle={(itemId: string) => !isClosed && toggleItemPicked(listId, itemId)}
          onQuantityChange={(itemId: string, qty: number) => !isClosed && updateItemQuantity(listId, itemId, qty)}
          onRemove={(itemId: string) => !isClosed && handleRemoveItemRequest(itemId)}
          onEdit={(item: MarketItem) => !isClosed && handleEditItem(item)}
        />

        {searchQuery && filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-12 text-center"
          >
            <div className="bg-muted/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
              <Search size={24} className="text-muted" />
            </div>
            <p className="text-muted font-medium">Nenhum item encontrado para "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 text-emerald-600 hover:text-emerald-700 text-sm font-bold"
            >
              Limpar pesquisa
            </button>
          </motion.div>
        )}
      </motion.div>

      {(isAtMarket || (pickedCount === totalCount && totalCount > 0 && !isClosed)) && (
        <div className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] md:bottom-0 left-0 right-0 p-4 bg-card/80 backdrop-blur-md border-t border-border flex justify-center z-10">
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
                className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 hover:bg-emerald-70 transition-all active:scale-95"
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
                  Finalizar Compra
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <FinishMarketModal
        isOpen={isFinishModalOpen}
        onClose={() => setIsFinishModalOpen(false)}
        onConfirm={handleFinishShopping}
        isLoading={isSubmitting}
        initialValue={list?.totalValue}
      />

      <EditItemModal
        item={editingItem}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingItem(null);
        }}
        onConfirm={handleUpdateItem}
        isLoading={isSubmitting}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Remover Item"
        description="Tem certeza que deseja remover este item da lista? Esta ação não pode ser desfeita."
        confirmText="Remover"
        variant="danger"
        isLoading={isSubmitting}
      />
    </main>
  );
}
