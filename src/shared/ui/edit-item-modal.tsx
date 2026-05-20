"use client";

import { CATEGORIES, Category, MarketItem } from "@/shared/types";
import { CATEGORY_ICONS } from "@/shared/utils/category-icons";
import { cn } from "@/shared/utils/cn";
import { Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Modal } from "./modal";

interface EditItemModalProps {
  item: MarketItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { name: string; category: Category; quantity: number; unit: string }) => Promise<void>;
  isLoading?: boolean;
}

export function EditItemModal({
  item,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: EditItemModalProps) {
  const [name, setName] = useState(() => item ? item.name : "");
  const [category, setCategory] = useState<Category>(() => item ? item.category : "Outros");
  const [quantity, setQuantity] = useState(() => item ? item.quantity : 1);
  const [unit, setUnit] = useState(() => item ? item.unit : "un");
  const lastItemRef = useRef(item);

  useEffect(() => {
    if (lastItemRef.current !== item) {
      lastItemRef.current = item;
      if (item) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setName(item.name);
         
        setCategory(item.category);
         
        setQuantity(item.quantity);
         
        setUnit(item.unit);
      }
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await onConfirm({
      name: name.trim(),
      category,
      quantity,
      unit,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Item"
      description="Altere as informações do item selecionado."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input
            label="Nome do Item"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Arroz"
            required
            autoFocus
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantidade"
              type="number"
              min="0.1"
              step="0.1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
            <Input
              label="Unidade"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="Ex: kg, un, pct"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted/60 uppercase tracking-wider ml-1">
              Categoria
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl text-[10px] font-bold transition-all border",
                    category === cat
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-card border-border text-muted hover:border-emerald-200 dark:hover:border-emerald-800"
                  )}
                >
                  <span className={cn(
                    "transition-colors",
                    category === cat ? "text-white" : "text-emerald-500"
                  )}>
                    {CATEGORY_ICONS[cat]}
                  </span>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="w-full sm:flex-1 rounded-2xl font-bold py-3 cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="w-full sm:flex-1 bg-emerald-600 text-white rounded-2xl font-bold py-3 transition-all shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Save size={18} />
            Salvar Alterações
          </Button>
        </div>
      </form>
    </Modal>
  );
}
