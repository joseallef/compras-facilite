import { Category, ShoppingItem } from "@/types";

export interface ListDetailPageProps {
  params: {
    id: string;
  };
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
