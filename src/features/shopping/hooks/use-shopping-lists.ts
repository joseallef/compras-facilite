"use client";

import { MONTHLY_SHOPPING_TEMPLATE } from "@/shared/constants/templates";
import { useAuth } from "@/features/auth/hooks/use-auth";
import {
  addShoppingItem,
  createShoppingList,
  createShoppingListFromTemplate,
  deleteShoppingList,
  getShoppingLists,
  removeShoppingItem,
  toggleShoppingItem,
  updateShoppingItem,
  updateShoppingItemQuantity,
  updateShoppingList
} from "@/features/shopping/services/shopping-lists-service";
import { ShoppingItem, ShoppingList } from "@/features/shopping/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useShoppingLists() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fila de sincronização para evitar múltiplas requests simultâneas
  const syncQueue = useRef<Record<string, { listId: string; itemId: string; isPicked: boolean; timeout: NodeJS.Timeout }>>({});

  const fetchLists = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const data = await getShoppingLists();
      // Prisma returns Date objects, which is fine for date-fns
      setLists(data as unknown as ShoppingList[]);
    } catch (error) {
      console.error("Failed to fetch lists", error);
      const message = error instanceof Error ? error.message : "Erro ao carregar listas";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      fetchLists();
    } else if (!isAuthLoading && !isAuthenticated) {
      setLists([]);
      setIsLoading(false);
    }

    // Cleanup dos timeouts de sincronização ao desmontar
    return () => {
      Object.values(syncQueue.current).forEach((item) => {
        clearTimeout(item.timeout);
      });
    };
  }, [isAuthLoading, isAuthenticated, fetchLists]);

  const createList = async (name: string, useTemplate = false) => {
    if (!user?.id) throw new Error("User not authenticated");
    
    setIsLoading(true);
    try {
      let newList;
      if (useTemplate) {
        newList = await createShoppingListFromTemplate(name, MONTHLY_SHOPPING_TEMPLATE);
      } else {
        newList = await createShoppingList(name);
      }
      
      // Update local state or just refetch
      await fetchLists();
      return newList as unknown as ShoppingList;
    } catch (error) {
      console.error("Failed to create list", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteList = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteShoppingList(id);
      setLists(prev => prev.filter(l => l.id !== id));
    } catch (error) {
      console.error("Failed to delete list", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateList = async (id: string, updates: Partial<ShoppingList>) => {
    try {
      const { name, status, totalValue } = updates;
      await updateShoppingList(id, { name, status, totalValue });
      setLists(prev => prev.map(l => 
        l.id === id ? { ...l, ...updates, updatedAt: new Date() } : l
      ));
    } catch (error) {
      console.error("Failed to update list", error);
    }
  };

  const addItemToList = async (listId: string, item: Omit<ShoppingItem, "id" | "isPicked">) => {
    try {
      const newItem = await addShoppingItem(listId, {
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        category: item.category
      });
      
      setLists(prev => prev.map(l => {
        if (l.id === listId) {
          return {
            ...l,
            items: [...(l.items || []), newItem as unknown as ShoppingItem],
            updatedAt: new Date()
          };
        }
        return l;
      }));
    } catch (error) {
      console.error("Failed to add item", error);
    }
  };

  const removeItemFromList = async (listId: string, itemId: string) => {
    try {
      await removeShoppingItem(listId, itemId);
      setLists(prev => prev.map(l => {
        if (l.id === listId) {
          return {
            ...l,
            items: l.items.filter((i: ShoppingItem) => i.id !== itemId),
            updatedAt: new Date()
          };
        }
        return l;
      }));
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  const toggleItemPicked = async (listId: string, itemId: string) => {
    const list = lists.find((l) => l.id === listId);
    const item = list?.items.find((i: ShoppingItem) => i.id === itemId);

    if (!item) return;

    const newIsPicked = !item.isPicked;

    // 1. ATUALIZAÇÃO OTIMISTA (UI instantânea)
    setLists((prev) =>
      prev.map((l) => {
        if (l.id === listId) {
          return {
            ...l,
            items: l.items.map((i: ShoppingItem) =>
              i.id === itemId ? { ...i, isPicked: newIsPicked } : i
            ),
            updatedAt: new Date(),
          };
        }
        return l;
      })
    );

    // 2. ESTRATÉGIA DE SINCRONIZAÇÃO COM DEBOUNCE POR ITEM
    // Cancela o timeout anterior se o usuário clicar no mesmo item rápido demais
    if (syncQueue.current[itemId]) {
      clearTimeout(syncQueue.current[itemId].timeout);
    }

    // Cria um novo timeout para enviar a alteração após 1 segundo de "paz" no item
    const timeout = setTimeout(async () => {
      try {
        await toggleShoppingItem(listId, itemId, newIsPicked);
        delete syncQueue.current[itemId];
      } catch (error) {
        console.error("Failed to toggle item sync", error);
        // Reverte em caso de erro real na sincronização
        setLists((prev) =>
          prev.map((l) => {
            if (l.id === listId) {
              return {
                ...l,
                items: l.items.map((i: ShoppingItem) =>
                  i.id === itemId ? { ...i, isPicked: !newIsPicked } : i
                ),
                updatedAt: new Date(),
              };
            }
            return l;
          })
        );
      }
    }, 1000); // 1 segundo de debounce

    syncQueue.current[itemId] = { listId, itemId, isPicked: newIsPicked, timeout };
  };

  const updateItemQuantity = async (
    listId: string,
    itemId: string,
    quantity: number
  ) => {
    const list = lists.find((l) => l.id === listId);
    const item = list?.items.find((i: ShoppingItem) => i.id === itemId);
    if (!item) return;

    const oldQuantity = item.quantity;

    // 1. ATUALIZAÇÃO OTIMISTA
    setLists((prev) =>
      prev.map((l) => {
        if (l.id === listId) {
          return {
            ...l,
            items: l.items.map((i: ShoppingItem) =>
              i.id === itemId ? { ...i, quantity } : i
            ),
            updatedAt: new Date(),
          };
        }
        return l;
      })
    );

    try {
      await updateShoppingItemQuantity(listId, itemId, quantity);
    } catch (error) {
      console.error("Failed to update item quantity", error);
      // 2. REVERTE
      setLists((prev) =>
        prev.map((l) => {
          if (l.id === listId) {
            return {
              ...l,
              items: l.items.map((i: ShoppingItem) =>
                i.id === itemId ? { ...i, quantity: oldQuantity } : i
              ),
              updatedAt: new Date(),
            };
          }
          return l;
        })
      );
    }
  };

  const updateItemInList = async (listId: string, itemId: string, data: Partial<ShoppingItem>) => {
    try {
      const updatedItem = await updateShoppingItem(listId, itemId, {
        name: data.name,
        quantity: data.quantity,
        unit: data.unit,
        category: data.category
      });
      
      setLists(prev => prev.map(l => {
        if (l.id === listId) {
          return {
            ...l,
            items: l.items.map((i: ShoppingItem) => 
              i.id === itemId ? { ...i, ...updatedItem as unknown as ShoppingItem } : i
            ),
            updatedAt: new Date()
          };
        }
        return l;
      }));
    } catch (error) {
      console.error("Failed to update item", error);
    }
  };

  return {
    lists,
    isLoaded: !isLoading && !isAuthLoading,
    createList,
    deleteList,
    updateList,
    addItemToList,
    removeItemFromList,
    toggleItemPicked,
    updateItemQuantity,
    updateItemInList,
  };
}
