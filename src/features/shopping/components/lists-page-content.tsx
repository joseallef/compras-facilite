"use client";

import { useShoppingLists } from "@/features/shopping/hooks/use-shopping-lists";
import { Button } from "@/shared/ui/button";
import { ConfirmModal } from "@/shared/ui/confirm-modal";
import { Modal } from "@/shared/ui/modal";
import {
  ShoppingListCardSkeleton
} from "@/shared/ui/skeleton";
import { motion } from "framer-motion";
import { Copy, Plus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingListCard } from "./shopping-list-card";

function ListsPageHeader({
  isCreating,
  onCreateList,
}: {
  isCreating: boolean;
  onCreateList: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Minhas Compras</h1>
        <p className="text-muted mt-1 text-lg">
          Gerencie suas listas de compras
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          onClick={onCreateList}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
          disabled={isCreating}
        >
          <Plus size={20} />
          Nova Lista
        </Button>
      </div>
    </div>
  );
}

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  lists: any[];
  onDuplicate: (listId: string) => void;
  onCreateFromScratch: () => void;
  isLoading: boolean;
}

function CreateListModal({
  isOpen,
  onClose,
  lists,
  onDuplicate,
  onCreateFromScratch,
  isLoading,
}: CreateListModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Lista" description="Como você quer criar sua lista?">
      <div className="space-y-4 pt-4">
        <Button
          onClick={onCreateFromScratch}
          className="w-full bg-emerald-600 text-white hover:bg-emerald-700 justify-start h-14 px-4 rounded-2xl shadow-lg shadow-emerald-600/20"
          disabled={isLoading}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Plus size={22} className="text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-base">Criar do zero</p>
              <p className="text-xs text-white/70">Uma lista completamente nova</p>
            </div>
          </div>
        </Button>

        {lists.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-2">
              <div className="h-px flex-1 bg-border" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Ou copie de uma lista
              </p>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {lists.map((list) => (
                <button
                  key={list.id}
                  type="button"
                  onClick={() => onDuplicate(list.id)}
                  disabled={isLoading}
                  className="w-full p-4 rounded-2xl text-left border border-border bg-card hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all duration-200 disabled:opacity-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                      <Copy size={20} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{list.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {list.items?.length || 0} {list.items?.length === 1 ? 'item' : 'itens'}
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-600" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center pt-2">
          <Button
            onClick={onClose}
            variant="ghost"
            className="h-12 px-6 rounded-2xl font-bold text-muted-foreground hover:text-foreground"
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function ListsPageContent() {
  const router = useRouter();
  const { lists, isLoaded, createList, deleteList, duplicateList } = useShoppingLists();
  const [isCreating, setIsCreating] = useState(false);
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateFromScratch = async () => {
    setShowCreateModal(false);
    setIsCreating(true);
    try {
      const newList = await createList("Nova Lista", false);
      toast.success("Lista criada com sucesso!");
      router.push(`/mercado/edit/${newList.id}`);
    } catch {
      toast.error("Erro ao criar lista");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDuplicate = async (listId: string) => {
    setShowCreateModal(false);
    setIsCreating(true);
    try {
      const originalList = lists.find((l) => l.id === listId);
      const listName = `Cópia de ${originalList?.name || "Lista"}`;
      const newList = await duplicateList(listId, listName);
      toast.success("Lista duplicada com sucesso!");
      router.push(`/mercado/edit/${newList.id}`);
    } catch {
      toast.error("Erro ao duplicar lista");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <ListsPageHeader
        isCreating={isCreating}
        onCreateList={() => setShowCreateModal(true)}
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
                onClick={() => setShowCreateModal(true)}
                className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
              >
                Criar Minha Primeira Lista
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lists.map((list) => (
                <ShoppingListCard
                  key={list.id}
                  list={list}
                  onDelete={() => setListToDelete(list.id)}
                  onClick={() => router.push(`/mercado/edit/${list.id}`)}
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
            } catch {
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

      <CreateListModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        lists={lists}
        onDuplicate={handleDuplicate}
        onCreateFromScratch={handleCreateFromScratch}
        isLoading={isCreating}
      />
    </div>
  );
}
