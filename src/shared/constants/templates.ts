import { MarketItem } from "@/shared/types";

export const MONTHLY_SHOPPING_TEMPLATE: Omit<MarketItem, "id" | "isPicked">[] = [
  // Alimentos
  { name: "Arroz (5kg)", quantity: 2, unit: "pct", category: "Alimentos" },
  { name: "Feijão (1kg)", quantity: 4, unit: "pct", category: "Alimentos" },
  { name: "Açúcar (1kg)", quantity: 2, unit: "pct", category: "Alimentos" },
  { name: "Sal (1kg)", quantity: 1, unit: "pct", category: "Alimentos" },
  { name: "Óleo de Soja", quantity: 3, unit: "un", category: "Alimentos" },
  { name: "Café", quantity: 2, unit: "pct", category: "Alimentos" },
  { name: "Macarrão", quantity: 4, unit: "pct", category: "Alimentos" },
  { name: "Molho de Tomate", quantity: 5, unit: "un", category: "Alimentos" },
  
  // Hortifruti
  { name: "Batata", quantity: 2, unit: "kg", category: "Hortifruti" },
  { name: "Cebola", quantity: 1, unit: "kg", category: "Hortifruti" },
  { name: "Tomate", quantity: 1, unit: "kg", category: "Hortifruti" },
  { name: "Banana", quantity: 1, unit: "dz", category: "Hortifruti" },
  { name: "Alface", quantity: 2, unit: "un", category: "Hortifruti" },

  // Higiene
  { name: "Papel Higiênico (12rl)", quantity: 2, unit: "pct", category: "Higiene" },
  { name: "Sabonete", quantity: 6, unit: "un", category: "Higiene" },
  { name: "Pasta de Dente", quantity: 3, unit: "un", category: "Higiene" },
  { name: "Shampoo", quantity: 1, unit: "un", category: "Higiene" },

  // Limpeza
  { name: "Detergente", quantity: 5, unit: "un", category: "Limpeza" },
  { name: "Sabão em Pó (1kg)", quantity: 2, unit: "pct", category: "Limpeza" },
  { name: "Amaciante", quantity: 1, unit: "un", category: "Limpeza" },
  { name: "Água Sanitária", quantity: 1, unit: "un", category: "Limpeza" },
  { name: "Desinfetante", quantity: 1, unit: "un", category: "Limpeza" },

  // Padaria
  { name: "Pão de Forma", quantity: 2, unit: "pct", category: "Padaria" },
  { name: "Leite (1L)", quantity: 12, unit: "un", category: "Padaria" },
  { name: "Manteiga", quantity: 1, unit: "un", category: "Padaria" },
];
