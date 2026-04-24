"use client";

import { Category, ShoppingItem } from "@/types";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Trash2, Plus, ShoppingBag } from "lucide-react";
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

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter((i) => i.id !== itemId));
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setItems(
      items.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    await onSubmit(
      name,
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
        <button
          onClick={() => router.back()}
          className="bg-card p-2.5 rounded-2xl border border-border text-muted hover:text-emerald-600 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all active:scale-90"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold tracking-tight flex-1">{title}</h1>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !name.trim()}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
        >
          <Save size={20} />
          Salvar
        </button>
      </div>

      <div className="bg-card p-6 rounded-[2.5rem] border border-border shadow-sm space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-bold text-muted/60 uppercase tracking-wider ml-1">
            Nome da Lista
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-xl font-bold bg-background border border-border rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            placeholder="Ex: Compras da Semana"
          />
        </label>
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
            onRemove={handleRemoveItem}
          />
          
          {items.length === 0 && (
            <div className="p-12 text-center space-y-2">
              <p className="text-muted font-medium">Sua lista está vazia</p>
              <p className="text-sm text-muted/60">Adicione alguns itens acima para começar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
