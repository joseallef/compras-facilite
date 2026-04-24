"use client";

import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  PageHeaderSkeleton,
  ShoppingListCardSkeleton,
} from "@/components/ui/Skeleton";
import { useShoppingLists } from "@/hooks/useShoppingLists";
import { format, isSameMonth, isSameYear } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { FileText, Plus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingListCard } from "./ShoppingListCard";

function ListsPageHeader({
  isCreating,
  onCreateMonthlyList,
  onCreateList,
}: {
  isCreating: boolean;
  onCreateMonthlyList: () => void;
  onCreateList: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Minhas Compras</h1>
        <p className="text-muted mt-1 text-lg">
          Gerencie suas listas de compras
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onCreateMonthlyList}
          disabled={isCreating}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2.5 rounded-xl font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors disabled:opacity-50"
        >
          <FileText size={20} />
          Lista do Mês
        </button>
        <button
          onClick={onCreateList}
          className="hidden md:flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
        >
          <Plus size={20} />
          Nova Lista
        </button>
      </div>
    </div>
  );
}

export function ListsPageContent() {
  // 1. STATES
  const [isCreating, setIsCreating] = useState(false);
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 2. VARIÁVEIS
  const router = useRouter();
  const { lists, createList, deleteList, isLoaded } = useShoppingLists();

  // 3. FUNÇÕES
  const handleCreateListFromTemplate = async () => {
    setIsCreating(true);
    try {
      const now = new Date();
      const name = `Compras de ${format(now, "MMMM", { locale: ptBR })}`
      
      // Check if a list was already created in the current month and year
      const existingList = lists.find(l => 
        isSameMonth(new Date(l.createdAt), now) && 
        isSameYear(new Date(l.createdAt), now)
      );
      
      if (existingList) {
        toast.info(`Você já possui a lista de ${format(now, "MMMM", { locale: ptBR })} aberta`);
        router.push(`/edicao/${existingList.id}`);
        return;
      }

      const newList = await createList(name, true);
      router.push(`/edicao/${newList.id}`);
    } catch (error) {
      console.error("[handleCreateListFromTemplate]", error);
      toast.error("Erro ao criar lista");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!listToDelete) return;

    setIsDeleting(true);
    try {
      await deleteList(listToDelete);
      toast.success("Lista excluída com sucesso");
      setListToDelete(null);
    } catch (error) {
      console.error("[handleDeleteConfirm]", error);
      toast.error("Erro ao excluir lista");
    } finally {
      setIsDeleting(false);
    }
  };

  // 4. EFFECTS

  // 5. RETURN (JSX)
  return (
    <main className="max-w-4xl mx-auto w-full p-4 md:p-8">
      <div className="space-y-8">
        {!isLoaded ? (
          <>
            <PageHeaderSkeleton />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <ShoppingListCardSkeleton key={i} highlighted={i === 2} />
              ))}
            </div>
          </>
        ) : lists.length === 0 ? (
          <>
            <ListsPageHeader
              isCreating={isCreating}
              onCreateMonthlyList={handleCreateListFromTemplate}
              onCreateList={() => router.push("/cadastro")}
            />

          <div className="bg-card border-2 border-dashed border-border rounded-3xl p-12 text-center">
            <div className="bg-muted/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
              <ShoppingCart size={32} className="text-muted" />
            </div>
            <h3 className="text-xl font-bold">Nenhuma lista criada</h3>
            <p className="text-muted mt-2 max-w-sm mx-auto">
              Comece criando sua primeira lista de compras ou use o nosso modelo
              pré-montado.
            </p>
          </div>
          </>
        ) : (
          <>
            <ListsPageHeader
              isCreating={isCreating}
              onCreateMonthlyList={handleCreateListFromTemplate}
              onCreateList={() => router.push("/cadastro")}
            />

            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {lists.map((list) => (
                <ShoppingListCard
                  key={list.id}
                  list={list}
                  onClick={() => router.push(`/edicao/${list.id}`)}
                  onDelete={() => setListToDelete(list.id)}
                />
              ))}
            </motion.div>
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={!!listToDelete}
        onClose={() => setListToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        variant="danger"
        title="Excluir Lista"
        description="Tem certeza que deseja excluir esta lista? Todos os itens serão removidos permanentemente. Esta ação não pode ser desfeita."
        confirmText="Sim, excluir"
        cancelText="Cancelar"
      />
    </main>
  );
}
