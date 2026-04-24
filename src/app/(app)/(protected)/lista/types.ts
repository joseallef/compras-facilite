import { Category, ShoppingItem, ShoppingList } from "@/types";

export interface ShoppingListCardProps {
  list: ShoppingList;
  onClick: () => void;
  onDelete: () => void;
}

export interface AddItemFormProps {
  onAdd: (name: string, category: Category) => void;
  isLoading?: boolean;
}

export interface CategorySectionProps {
  items: ShoppingItem[];
  isAtMarket: boolean;
  onToggle: (itemId: string) => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export interface ShoppingItemRowProps {
  item: ShoppingItem;
  isAtMarket: boolean;
  onToggle: () => void;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}
