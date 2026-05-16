export type Category =
  | "Alimentos"
  | "Bebidas"
  | "Higiene"
  | "Limpeza"
  | "Hortifruti"
  | "Acougue"
  | "Padaria"
  | "Outros";

export interface MarketItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  isPicked: boolean;
  category: Category;
}

export type ListStatus = "ABERTA" | "CONCLUIDA";

export interface MarketList {
  id: string;
  name: string;
  userId: string;
  items: MarketItem[];
  status: ListStatus;
  totalValue?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketListTemplate {
  name: string;
  items: Omit<MarketItem, "id" | "isPicked">[];
}

export * from "@/features/auth/types/auth-types";

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
