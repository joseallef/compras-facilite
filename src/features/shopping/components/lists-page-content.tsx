"use client";

import { useShoppingLists } from "@/features/shopping/hooks/use-shopping-lists";
import { Button } from "@/shared/ui/button";
import { ConfirmModal } from "@/shared/ui/confirm-modal";
import {
    ShoppingListCardSkeleton
} from "@/shared/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { FileText, Plus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingListCard } from "./shopping-list-card";

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
        <Button
          onClick={onCreateMonthlyList}
          disabled={isCreating}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2.5 rounded-xl font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors disabled:opacity-50"
        >
          <FileText size={20} />
          Lista do Mês
        </Button>
        <Button
          onClick={onCreateList}
          className="hidden md:flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
        >
          <Plus size={20} />
          Nova Lista
        </Button>
      </div>
    </div>
  );
}

export function ListsPageContent() {
  const router = useRouter();
  const { lists, isLoaded, createList, deleteList } = useShoppingLists();
  const [isCreating, setIsCreating] = useState(false);
  const [listToDelete, setListToDelete] = useState<string | null>(null);

  const handleCreateMonthlyList = async () => {
    setIsCreating(true);
    try {
      const now = new Date();
      const monthName = format(now, "MMMM", { locale: ptBR });
      const year = now.getFullYear();
      const listName = `Compras ${monthName} ${year}`;
      
      const newList = await createList(listName, true);
      toast.success("Lista mensal criada com sucesso!");
      router.push(`/shopping/edit/${newList.id}`);
    } catch (error) {
      toast.error("Erro ao criar lista mensal");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <ListsPageHeader
        isCreating={isCreating}
        onCreateMonthlyList={handleCreateMonthlyList}
        onCreateList={() => router.push("/shopping/create")}
      />

      {!isLoaded ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <ShoppingListCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {lists.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 px-4 text-center bg-card rounded-[3rem] border-2 border-dashed border-border shadow-sm"
            >
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-6 rounded-full mb-6">
                <ShoppingCart size={48} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Nenhuma lista ainda</h2>
              <p className="text-muted max-w-md mb-8">
                Crie sua primeira lista de compras para começar a organizar seus gastos de mercado.
              </p>
              <Button
                onClick={() => router.push("/shopping/create")}
                className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
              >
                Criar Minha Primeira Lista
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lists.map((list, index) => (
                <ShoppingListCard
                  key={list.id}
                  list={list}
                  index={index}
                  onDelete={() => setListToDelete(list.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmModal
        isOpen={!!listToDelete}
        onClose={() => setListToDelete(null)}
        onConfirm={async () => {
          if (listToDelete) {
            try {
              await deleteList(listToDelete);
              toast.success("Lista excluída com sucesso");
            } catch (error) {
              toast.error("Erro ao excluir lista");
            } finally {
              setListToDelete(null);
            }
          }
        }}
        title="Excluir Lista"
        description="Tem certeza que deseja excluir esta lista? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        variant="danger"
      />
    </div>
  );
}
