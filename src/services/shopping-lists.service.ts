"use server";

import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getShoppingLists(userId: string) {
  try {
    return await prisma.shoppingList.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching shopping lists:", error);
    return [];
  }
}

export async function createShoppingList(userId: string, name: string) {
  try {
    const list = await prisma.shoppingList.create({
      data: {
        name,
        userId,
      },
    });
    revalidatePath("/lista");
    return list;
  } catch (error) {
    console.error("Error creating shopping list:", error);
    throw new Error("Failed to create list");
  }
}

export async function deleteShoppingList(listId: string) {
  try {
    await prisma.shoppingList.delete({
      where: { id: listId },
    });
    revalidatePath("/lista");
  } catch (error) {
    console.error("Error deleting shopping list:", error);
    throw new Error("Failed to delete list");
  }
}

export async function updateShoppingList(listId: string, data: { 
  name?: string; 
  status?: "ABERTA" | "CONCLUIDA"; 
  totalValue?: number | null 
}) {
  try {
    const list = await prisma.shoppingList.update({
      where: { id: listId },
      data,
    });
    revalidatePath("/lista");
    revalidatePath(`/edicao/${listId}`);
    return list;
  } catch (error) {
    console.error("Error updating shopping list:", error);
    throw new Error("Failed to update list");
  }
}

export async function createShoppingListFromTemplate(userId: string, name: string, items: {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}[]) {
  try {
    const list = await prisma.shoppingList.create({
      data: {
        name,
        userId,
        items: {
          create: items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            category: item.category as Category,
          })),
        },
      },
      include: { items: true },
    });
    revalidatePath("/lista");
    return list;
  } catch (error) {
    console.error("Error creating shopping list from template:", error);
    throw new Error("Failed to create list from template");
  }
}

export async function addShoppingItem(listId: string, data: {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}) {
  try {
    const item = await prisma.shoppingItem.create({
      data: {
        name: data.name,
        quantity: data.quantity,
        unit: data.unit,
        category: data.category as Category,
        shoppingListId: listId,
      },
    });
    revalidatePath(`/edicao/${listId}`);
    return item;
  } catch (error) {
    console.error("Error adding shopping item:", error);
    throw new Error("Failed to add item");
  }
}

export async function removeShoppingItem(listId: string, itemId: string) {
  try {
    await prisma.shoppingItem.delete({
      where: { id: itemId },
    });
    revalidatePath(`/edicao/${listId}`);
  } catch (error) {
    console.error("Error removing shopping item:", error);
    throw new Error("Failed to remove item");
  }
}

export async function toggleShoppingItem(listId: string, itemId: string, isPicked: boolean) {
  try {
    const item = await prisma.shoppingItem.update({
      where: { id: itemId },
      data: { isPicked },
    });
    revalidatePath(`/edicao/${listId}`);
    return item;
  } catch (error) {
    console.error("Error toggling shopping item:", error);
    throw new Error("Failed to toggle item");
  }
}

export async function updateShoppingItemQuantity(listId: string, itemId: string, quantity: number) {
  try {
    const item = await prisma.shoppingItem.update({
      where: { id: itemId },
      data: { quantity },
    });
    revalidatePath(`/edicao/${listId}`);
    return item;
  } catch (error) {
    console.error("Error updating shopping item quantity:", error);
    throw new Error("Failed to update quantity");
  }
}
