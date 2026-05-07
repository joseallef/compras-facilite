"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { CATEGORIES, Category } from "@/types";
import { CATEGORY_ICONS } from "@/utils/category-icons";
import { Plus, Tag } from "lucide-react";
import { FormEvent, useState } from "react";
import { AddItemFormProps } from "../types";

export function AddItemForm({ onAdd, isLoading }: AddItemFormProps) {
  // 1. STATES
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("Alimentos");
  const [nameError, setNameError] = useState("");

  // 2. VARIÁVEIS
  const categoryOptions = CATEGORIES.map(cat => ({
    value: cat,
    label: cat,
    icon: CATEGORY_ICONS[cat]
  }));

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
          <Input
            id="add-item-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError("");
            }}
            placeholder="O que você precisa comprar?"
            disabled={isLoading}
            error={nameError}
            containerClassName="space-y-2"
            inputClassName="text-foreground"
          />
        </div>
        <Select
          value={category}
          onChange={(val) => setCategory(val as Category)}
          disabled={isLoading}
          options={categoryOptions}
          leftIcon={<Tag size={18} />}
          containerClassName="space-y-0 w-full md:w-64"
          selectClassName="text-foreground"
        />
        <Button
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
        </Button>
      </div>
    </form>
  );
}
