import { useMarketLists } from "@/features/mercado/hooks/use-market-lists";
import { MarketItem } from "@/shared/types";
import { useMemo } from "react";

export function useListDetail(listId: string | null) {
  const { lists, ...actions } = useMarketLists();

  const list = useMemo(() => 
    listId ? lists.find((l) => l.id === listId) : undefined,
  [lists, listId]);

  const stats = useMemo(() => {
    if (!list) return { pickedCount: 0, totalCount: 0, progress: 0 };
    
    const pickedCount = list.items.filter((i: MarketItem) => i.isPicked).length;
    const totalCount = list.items.length;
    const progress = totalCount > 0 ? (pickedCount / totalCount) * 100 : 0;
    
    return { pickedCount, totalCount, progress };
  }, [list]);

  return {
    list,
    ...stats,
    ...actions,
  };
}
