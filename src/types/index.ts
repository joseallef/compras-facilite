export type Category =
  | "Alimentos"
  | "Bebidas"
  | "Higiene"
  | "Limpeza"
  | "Hortifruti"
  | "Acougue"
  | "Padaria"
  | "Outros";

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  isPicked: boolean;
  category: Category;
}

export type ListStatus = "ABERTA" | "CONCLUIDA";

export interface ShoppingList {
  id: string;
  name: string;
  userId: string;
  items: ShoppingItem[];
  status: ListStatus;
  totalValue?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShoppingListTemplate {
  name: string;
  items: Omit<ShoppingItem, "id" | "isPicked">[];
}

export * from "./auth.types";

export const CATEGORIES: Category[] = [
  "Alimentos",
  "Bebidas",
  "Hortifruti",
  "Padaria",
  "Acougue",
  "Limpeza",
  "Higiene",
  "Outros",
];
