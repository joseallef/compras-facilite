"use client";

import { Button } from "@/components/ui/Button";
import { EditItemModal } from "@/components/ui/EditItemModal";
import { Input } from "@/components/ui/Input";
import { Category, ShoppingItem } from "@/types";
import { ArrowLeft, Save, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddItemForm } from "./AddItemForm";
import { CategorySection } from "./CategorySection";

interface ShoppingListFormProps {
  initialData?: {
    id: string;
    name: string;
    items: ShoppingItem[];
  };
  onSubmit: (name: string, items: Omit<ShoppingItem, "id" | "isPicked">[]) => Promise<void>;
  title: string;
  isSubmitting?: boolean;
}

export function ShoppingListForm({
  initialData,
  onSubmit,
  title,
  isSubmitting = false,
}: ShoppingListFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || "");
  const [items, setItems] = useState<ShoppingItem[]>(initialData?.items || []);
  const [nameError, setNameError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleAddItem = (itemName: string, category: Category) => {
    const newItem: ShoppingItem = {
      id: Math.random().toString(36).substr(2, 9), // Temporary ID for UI
      name: itemName,
      quantity: 1,
      unit: "un",
      category,
      isPicked: false,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItemRequest = (itemId: string) => {
    setItemToDelete(itemId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setItems(items.filter((i) => i.id !== itemToDelete));
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setItems(
      items.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  const handleEditItem = (item: ShoppingItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleUpdateItem = async (data: { name: string; category: Category; quantity: number; unit: string }) => {
    if (!editingItem) return;
    setItems(
      items.map((i) => (i.id === editingItem.id ? { ...i, ...data } : i))
    );
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async () => {
    const nameValue = name.trim();
    if (!nameValue) {
      setNameError("Informe o nome da lista.");
      return;
    }
    setNameError("");
    await onSubmit(
      nameValue,
      items.map(({ name, quantity, unit, category }) => ({
        name,
        quantity,
        unit,
        category,
      }))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => router.back()}
          className="bg-card p-2.5 rounded-2xl border border-border text-muted hover:text-emerald-600 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all active:scale-90"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight flex-1">{title}</h1>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !name.trim()}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
        >
          <Save size={20} />
          Salvar
        </Button>
      </div>

      <div className="bg-card p-6 rounded-[2.5rem] border border-border shadow-sm space-y-4">
        <Input
          id="shopping-list-name"
          type="text"
          label="Nome da Lista"
          labelClassName="text-sm font-bold text-muted/60 uppercase tracking-wider ml-1"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError("");
          }}
          placeholder="Ex: Compras da Semana"
          error={nameError}
          containerClassName="space-y-2"
          inputClassName="text-xl font-bold rounded-2xl px-4"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <ShoppingBag size={18} className="text-emerald-500" />
          <h2 className="font-bold text-lg">Itens da Lista</h2>
          <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>

        <AddItemForm onAdd={handleAddItem} />

        <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
          <CategorySection
            items={items}
            isAtMarket={false}
            onToggle={() => {}} // Not needed in form mode
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemoveItemRequest}
            onEdit={handleEditItem}
          />
          
          {items.length === 0 && (
            <div className="p-12 text-center space-y-2">
              <p className="text-muted font-medium">Sua lista está vazia</p>
              <p className="text-sm text-muted/60">Adicione alguns itens acima para começar</p>
            </div>
          )}
        </div>
      </div>

      <EditItemModal
        item={editingItem}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingItem(null);
        }}
        onConfirm={handleUpdateItem}
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
      />
    </div>
  );
}
