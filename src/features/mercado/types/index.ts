import { Category, MarketItem, MarketList } from "@/shared/types";

export type { Category, MarketItem, MarketList };

export interface MarketListCardProps {
  list: MarketList;
  onClick: () => void;
  onDelete: () => void;
}

export interface AddItemFormProps {
  onAdd: (name: string, category: Category) => void;
  isLoading?: boolean;
}

export interface CategorySectionProps {
  items: MarketItem[];
  isAtMarket: boolean;
  onToggle: (itemId: string) => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  onEdit: (item: MarketItem) => void;
}

export interface MarketItemRowProps {
  item: MarketItem;
  isAtMarket: boolean;
  onToggle: () => void;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  onEdit: () => void;
}
