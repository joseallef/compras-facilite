"use client";

import { CATEGORIES, Category } from "@/types";
import { Loader2, Plus } from "lucide-react";
import { FormEvent, useState } from "react";
import { AddItemFormProps } from "../types";

export function AddItemForm({ onAdd, isLoading }: AddItemFormProps) {
  // 1. STATES
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("Alimentos");

  // 2. VARIÁVEIS

  // 3. FUNÇÕES
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd(name.trim(), category);
    setName("");
  };

  // 4. EFFECTS

  // 5. RETURN (JSX)
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-4"
    >
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="O que você precisa comprar?"
          className="flex-1 bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-foreground"
          disabled={isLoading}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-foreground"
          disabled={isLoading}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isLoading || !name.trim()}
          className="bg-foreground text-background px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Plus className="h-5 w-5" />
              Adicionar
            </>
          )}
        </button>
      </div>
    </form>
  );
}
