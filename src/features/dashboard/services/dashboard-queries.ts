import { MarketList } from "@/shared/types";

export interface DashboardStats {
  totalSpent: number;
  avgSpent: number;
  totalItems: number;
  completionRate: number;
  count: number;
  completedCount: number;
}

export function calculateDashboardStats(lists: MarketList[]): DashboardStats {
  const completedLists = lists.filter(l => l.status === "CONCLUIDA");
  const totalSpent = completedLists.reduce((sum, l) => sum + (l.totalValue || 0), 0);
  const avgSpent = completedLists.length > 0 ? totalSpent / completedLists.length : 0;
  const totalItems = lists.reduce((sum, l) => sum + l.items.length, 0);
  const completionRate = lists.length > 0 
    ? (completedLists.length / lists.length) * 100 
    : 0;

  return {
    totalSpent,
    avgSpent,
    totalItems,
    completionRate,
    count: lists.length,
    completedCount: completedLists.length
  };
}
