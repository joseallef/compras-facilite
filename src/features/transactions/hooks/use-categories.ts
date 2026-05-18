import { useState, useEffect, useRef } from "react";
import { getTransactionCategoriesAction } from "@/features/recurring-transactions/actions/recurring-actions";
import { TransactionType } from "@prisma/client";

interface CachedCategories {
  [key: string]: {
    data: any[];
    timestamp: number;
  };
}

const CACHE_TTL = 5 * 60 * 1000;
let globalCache: CachedCategories = {};

export function useCategories(type?: TransactionType) {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const cacheKey = type || "all";
  const fetchInProgress = useRef<Set<string>>(new Set());

  useEffect(() => {
    async function loadCategories() {
      const now = Date.now();
      const cached = globalCache[cacheKey];

      if (cached && now - cached.timestamp < CACHE_TTL) {
        setCategories(cached.data);
        return;
      }

      if (fetchInProgress.current.has(cacheKey)) {
        return;
      }

      fetchInProgress.current.add(cacheKey);
      setIsLoading(true);

      try {
        const cats = await getTransactionCategoriesAction(type);
        globalCache[cacheKey] = {
          data: cats,
          timestamp: now,
        };
        setCategories(cats);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setIsLoading(false);
        fetchInProgress.current.delete(cacheKey);
      }
    }

    loadCategories();
  }, [type, cacheKey]);

  return {
    categories,
    isLoading,
    refresh: () => {
      delete globalCache[cacheKey];
    },
    clearCache: () => {
      globalCache = {};
    },
  };
}
