"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  addShoppingItem,
  createShoppingList,
  createShoppingListFromTemplate,
  deleteShoppingList,
  getShoppingLists,
  removeShoppingItem,
  toggleShoppingItem,
  updateShoppingItemQuantity,
  updateShoppingList
} from "@/services/shopping-lists.service";
import { useCallback, useEffect, useState } from "react";
import { MONTHLY_SHOPPING_TEMPLATE } from "../data/templates";
import { ShoppingItem, ShoppingList } from "../types";

// Logic moved to Server Actions in src/app/actions/shopping-lists.ts

export function useShoppingLists() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLists = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const data = await getShoppingLists(user.id);
      // Prisma returns Date objects, which is fine for date-fns
      setLists(data as unknown as ShoppingList[]);
    } catch (error) {
      console.error("Failed to fetch lists", error);
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
  }, [isAuthLoading, isAuthenticated, fetchLists]);

  const createList = async (name: string, useTemplate = false) => {
    if (!user?.id) throw new Error("User not authenticated");
    
    setIsLoading(true);
    try {
      let newList;
      if (useTemplate) {
        newList = await createShoppingListFromTemplate(user.id, name, MONTHLY_SHOPPING_TEMPLATE);
      } else {
        newList = await createShoppingList(user.id, name);
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
            items: l.items.filter(i => i.id !== itemId),
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
    const list = lists.find(l => l.id === listId);
    const item = list?.items.find(i => i.id === itemId);
    
    if (!item) return;
    
    try {
      const updatedItem = await toggleShoppingItem(listId, itemId, !item.isPicked);
      setLists(prev => prev.map(l => {
        if (l.id === listId) {
          return {
            ...l,
            items: l.items.map(i => 
              i.id === itemId ? { ...i, isPicked: updatedItem.isPicked } : i
            ),
            updatedAt: new Date()
          };
        }
        return l;
      }));
    } catch (error) {
      console.error("Failed to toggle item", error);
    }
  };

  const updateItemQuantity = async (listId: string, itemId: string, quantity: number) => {
    try {
      await updateShoppingItemQuantity(listId, itemId, quantity);
      setLists(prev => prev.map(l => {
        if (l.id === listId) {
          return {
            ...l,
            items: l.items.map(i => 
              i.id === itemId ? { ...i, quantity } : i
            ),
            updatedAt: new Date()
          };
        }
        return l;
      }));
    } catch (error) {
      console.error("Failed to update item quantity", error);
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
  };
}
