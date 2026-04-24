"use client";

import { ShoppingItem } from "@/types";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, MinusCircle, PlusCircle, Trash2 } from "lucide-react";
import { ShoppingItemRowProps } from "../types";

interface ShoppingItemRowProps {
  item: ShoppingItem;
  isAtMarket: boolean;
  onToggle: () => void;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export function ShoppingItemRow({
  item,
  isAtMarket,
  onToggle,
  onQuantityChange,
  onRemove,
}: ShoppingItemRowProps) {
  // 1. STATES

  // 2. VARIÁVEIS

  // 3. FUNÇÕES

  // 4. EFFECTS

  // 5. RETURN (JSX)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group flex items-center gap-4 p-4 rounded-2xl border transition-all",
        item.isPicked
          ? "bg-muted/5 border-border opacity-60"
          : "bg-card border-border shadow-sm hover:border-emerald-200 dark:hover:border-emerald-800"
      )}
    >
      <button
        onClick={onToggle}
        className={cn(
          "transition-colors flex-shrink-0",
          item.isPicked
            ? "text-emerald-500"
            : "text-muted/30 hover:text-emerald-400"
        )}
        aria-label={item.isPicked ? "Marcar como não pego" : "Marcar como pego"}
      >
        {item.isPicked ? (
          <CheckCircle2 size={28} />
        ) : (
          <Circle size={28} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-lg font-semibold truncate transition-all",
            item.isPicked ? "line-through text-muted" : "text-foreground"
          )}
        >
          {item.name}
        </p>
        <p className="text-muted text-sm">
          {item.quantity} {item.unit}
        </p>
      </div>

      {!isAtMarket && (
        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center bg-background border border-border rounded-xl p-1">
            <button
              onClick={() => onQuantityChange(Math.max(1, item.quantity - 1))}
              className="p-1 hover:text-emerald-600 transition-colors"
              aria-label="Diminuir quantidade"
            >
              <MinusCircle size={20} />
            </button>
            <span className="w-8 text-center font-bold">{item.quantity}</span>
            <button
              onClick={() => onQuantityChange(item.quantity + 1)}
              className="p-1 hover:text-emerald-600 transition-colors"
              aria-label="Aumentar quantidade"
            >
              <PlusCircle size={20} />
            </button>
          </div>
          <button
            onClick={onRemove}
            className="text-muted/50 hover:text-red-500 p-2 transition-colors"
            aria-label="Remover item"
          >
            <Trash2 size={20} />
          </button>
        </div>
      )}

      {isAtMarket && !item.isPicked && (
        <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold uppercase flex-shrink-0">
          Falta
        </span>
      )}
    </motion.div>
  );
}
