"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { CATEGORIES, Category } from "@/types";
import { Plus } from "lucide-react";
import { FormEvent, useState } from "react";
import { AddItemFormProps } from "../types";

export function AddItemForm({ onAdd, isLoading }: AddItemFormProps) {
  // 1. STATES
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("Alimentos");
  const [nameError, setNameError] = useState("");

  // 2. VARIÁVEIS

  // 3. FUNÇÕES
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nameValue = name.trim();
    if (!nameValue) {
      setNameError("Digite o nome do item.");
      return;
    }
    setNameError("");

    onAdd(nameValue, category);
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
        <div className="flex-1">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError("");
            }}
            placeholder="O que você precisa comprar?"
            className={`w-full bg-background border rounded-xl px-4 py-3 focus:ring-2 transition-all outline-none text-foreground ${
              nameError
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-border focus:ring-emerald-500 focus:border-emerald-500"
            }`}
            disabled={isLoading}
            aria-invalid={Boolean(nameError)}
            aria-describedby={nameError ? "add-item-name-error" : undefined}
          />
          {nameError && (
            <p id="add-item-name-error" className="mt-2 text-sm text-red-600 dark:text-red-400">
              {nameError}
            </p>
          )}
        </div>
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
            <>
              <Skeleton className="h-5 w-5 rounded-full bg-background/30" />
              <Skeleton className="h-4 w-20 rounded bg-background/30" />
            </>
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
