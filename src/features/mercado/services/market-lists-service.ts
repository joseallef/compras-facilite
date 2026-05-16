"use server";

import { requireValidSession } from "@/core/auth/server-utils";
import { prisma } from "@/core/db/prisma";
import { consumeRateLimit, getClientIp } from "@/core/security/rate-limit";
import { Category } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getShoppingLists() {
  const userId = await requireValidSession();
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

export async function getShoppingListForMonth(month: number, year: number) {
  const userId = await requireValidSession();
  try {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    return await prisma.shoppingList.findFirst({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { items: true },
    });
  } catch (error) {
    console.error("Error fetching monthly shopping list:", error);
    return null;
  }
}

export async function duplicateShoppingList(listId: string, newName: string) {
  const userId = await requireValidSession();
  const ip = await getClientIp();

  const limitResult = await consumeRateLimit({
    key: `create-list:${userId}:${ip}`,
    limit: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  });

  if (!limitResult.allowed) {
    throw new Error("Muitas listas criadas. Tente novamente mais tarde.");
  }

  try {
    const originalList = await prisma.shoppingList.findFirst({
      where: { id: listId, userId },
      include: { items: true },
    });

    if (!originalList) {
      throw new Error("Lista original não encontrada");
    }

    const newList = await prisma.shoppingList.create({
      data: {
        name: newName,
        userId,
      },
    });

    if (originalList.items && originalList.items.length > 0) {
      await prisma.shoppingItem.createMany({
        data: originalList.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          category: item.category as Category,
          shoppingListId: newList.id,
          isPicked: false,
        })),
      });
    }

    revalidatePath("/mercado");
    return await prisma.shoppingList.findUnique({
      where: { id: newList.id },
      include: { items: true },
    });
  } catch (error) {
    console.error("Error duplicating shopping list:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to duplicate list");
  }
}

export async function createShoppingList(name: string) {
  const userId = await requireValidSession();
  const ip = await getClientIp();

  const limitResult = await consumeRateLimit({
    key: `create-list:${userId}:${ip}`,
    limit: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  });

  if (!limitResult.allowed) {
    throw new Error("Muitas listas criadas. Tente novamente mais tarde.");
  }

  try {
    const list = await prisma.shoppingList.create({
      data: {
        name,
        userId,
      },
    });
    revalidatePath("/shopping");
    return list;
  } catch (error) {
    console.error("Error creating shopping list:", error);
    throw new Error("Failed to create list");
  }
}

export async function deleteShoppingList(listId: string) {
  const userId = await requireValidSession();
  try {
    const result = await prisma.shoppingList.deleteMany({ where: { id: listId, userId } });
    if (result.count === 0) {
      throw new Error("Not found");
    }
    revalidatePath("/mercado");
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
  const userId = await requireValidSession();
  try {
    const result = await prisma.shoppingList.updateMany({ where: { id: listId, userId }, data });
    if (result.count === 0) {
      throw new Error("Not found");
    }
    revalidatePath("/mercado");
    revalidatePath(`/mercado/edit/${listId}`);
    return await prisma.shoppingList.findUnique({ where: { id: listId } });
  } catch (error) {
    console.error("Error updating shopping list:", error);
    throw new Error("Failed to update list");
  }
}

export async function createShoppingListFromTemplate(name: string, items: {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}[]) {
  const userId = await requireValidSession();
  const ip = await getClientIp();

  const limitResult = await consumeRateLimit({
    key: `create-list:${userId}:${ip}`,
    limit: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  });

  if (!limitResult.allowed) {
    throw new Error("Muitas listas criadas. Tente novamente mais tarde.");
  }

  try {
    const list = await prisma.shoppingList.create({
      data: {
        name,
        userId,
      },
    });

    if (items && items.length > 0) {
      await prisma.shoppingItem.createMany({
        data: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          category: item.category as Category,
          shoppingListId: list.id,
        })),
      });
    }

    revalidatePath("/mercado");
    return await prisma.shoppingList.findUnique({
      where: { id: list.id },
      include: { items: true },
    });
  } catch (error) {
    console.error("Error creating shopping list from template:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to create list from template");
  }
}

export async function addShoppingItem(listId: string, data: {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}) {
  const userId = await requireValidSession();
  try {
    const list = await prisma.shoppingList.findFirst({
      where: { id: listId, userId },
      select: { id: true },
    });
    if (!list) {
      throw new Error("Not found");
    }
    const item = await prisma.shoppingItem.create({
      data: {
        name: data.name,
        quantity: data.quantity,
        unit: data.unit,
        category: data.category as Category,
        shoppingListId: listId,
      },
    });
    revalidatePath(`/mercado/edit/${listId}`);
    return item;
  } catch (error) {
    console.error("Error adding shopping item:", error);
    throw new Error("Failed to add item");
  }
}

export async function removeShoppingItem(listId: string, itemId: string) {
  const userId = await requireValidSession();
  try {
    const result = await prisma.shoppingItem.deleteMany({
      where: {
        id: itemId,
        shoppingListId: listId,
        shoppingList: { userId },
      },
    });
    if (result.count === 0) {
      throw new Error("Not found");
    }
    revalidatePath(`/mercado/edit/${listId}`);
  } catch (error) {
    console.error("Error removing shopping item:", error);
    throw new Error("Failed to remove item");
  }
}

export async function toggleShoppingItem(listId: string, itemId: string, isPicked: boolean) {
  const userId = await requireValidSession();
  try {
    const result = await prisma.shoppingItem.updateMany({
      where: {
        id: itemId,
        shoppingListId: listId,
        shoppingList: { userId },
      },
      data: { isPicked },
    });
    if (result.count === 0) {
      throw new Error("Not found");
    }
    revalidatePath(`/mercado/edit/${listId}`);
    const item = await prisma.shoppingItem.findUnique({ where: { id: itemId } });
    if (!item) {
      throw new Error("Not found");
    }
    return item;
  } catch (error) {
    console.error("Error toggling shopping item:", error);
    throw new Error("Failed to toggle item");
  }
}

export async function updateShoppingItem(listId: string, itemId: string, data: {
  name?: string;
  quantity?: number;
  unit?: string;
  category?: string;
}) {
  const userId = await requireValidSession();
  try {
    const result = await prisma.shoppingItem.updateMany({
      where: {
        id: itemId,
        shoppingListId: listId,
        shoppingList: { userId },
      },
      data: {
        ...data,
        category: data.category ? (data.category as Category) : undefined,
      },
    });
    if (result.count === 0) {
      throw new Error("Not found");
    }
    revalidatePath(`/mercado/edit/${listId}`);
    const item = await prisma.shoppingItem.findUnique({ where: { id: itemId } });
    if (!item) {
      throw new Error("Not found");
    }
    return item;
  } catch (error) {
    console.error("Error updating shopping item:", error);
    throw new Error("Failed to update item");
  }
}

export async function updateShoppingItemQuantity(listId: string, itemId: string, quantity: number) {
  const userId = await requireValidSession();
  try {
    const result = await prisma.shoppingItem.updateMany({
      where: {
        id: itemId,
        shoppingListId: listId,
        shoppingList: { userId },
      },
      data: { quantity },
    });
    if (result.count === 0) {
      throw new Error("Not found");
    }
    revalidatePath(`/mercado/edit/${listId}`);
    const item = await prisma.shoppingItem.findUnique({ where: { id: itemId } });
    if (!item) {
      throw new Error("Not found");
    }
    return item;
  } catch (error) {
    console.error("Error updating shopping item quantity:", error);
    throw new Error("Failed to update quantity");
  }
}
