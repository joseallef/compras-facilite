"use client";

import { CATEGORIES } from "@/types";
import { cn } from "@/utils/cn";
import { CategorySectionProps } from "../types";

import { ShoppingItemRow } from "./ShoppingItemRow";

export function CategorySection({
  items,
  isAtMarket,
  onToggle,
  onQuantityChange,
  onRemove,
  onEdit,
}: CategorySectionProps) {
  // 1. STATES

  // 2. VARIÁVEIS

  // 3. FUNÇÕES

  // 4. EFFECTS

  // 5. RETURN (JSX)
  return (
    <div className="space-y-8">
      {CATEGORIES.map((category) => {
        const categoryItems = items.filter((i) => i.category === category);
        if (categoryItems.length === 0) return null;

        const allPicked = categoryItems.every((i) => i.isPicked);

        return (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2 px-2">
              <h2
                className={cn(
                  "text-lg font-bold uppercase tracking-wider",
                  allPicked ? "text-muted/40" : "text-muted"
                )}
              >
                {category}
              </h2>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="space-y-2">
              {categoryItems.map((item) => (
                <ShoppingItemRow
                  key={item.id}
                  item={item}
                  isAtMarket={isAtMarket}
                  onToggle={() => onToggle(item.id)}
                  onQuantityChange={(qty) => onQuantityChange(item.id, qty)}
                  onRemove={() => onRemove(item.id)}
                  onEdit={() => onEdit(item)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
