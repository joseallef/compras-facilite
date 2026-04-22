import { useShoppingLists } from "@/hooks/useShoppingLists";
import { act, renderHook } from "@testing-library/react";

jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "test-user-id", email: "test@example.com", name: "test" },
    isAuthenticated: true,
    isLoading: false,
  }),
}));

jest.mock("@/services/shopping-lists.service", () => ({
  getShoppingLists: jest.fn(async () => []),
  createShoppingList: jest.fn(async (userId, name) => ({
    id: "new-list-id",
    name,
    userId,
    items: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
  createShoppingListFromTemplate: jest.fn(async (userId, name, items) => ({
    id: "template-list-id",
    name,
    userId,
    items: items.map((it: any) => ({ ...it, id: Math.random().toString(), isPicked: false })),
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
  deleteShoppingList: jest.fn(async () => {}),
  updateShoppingList: jest.fn(async (id, name) => ({ id, name })),
  addShoppingItem: jest.fn(async (listId, item) => ({
    id: "new-item-id",
    ...item,
    isPicked: false,
  })),
  removeShoppingItem: jest.fn(async () => {}),
  toggleShoppingItem: jest.fn(async (listId, itemId, isPicked) => ({ id: itemId, isPicked })),
  updateShoppingItemQuantity: jest.fn(async (listId, itemId, quantity) => ({ id: itemId, quantity })),
}));

const STORAGE_KEY = "compras-facilite-lists";

describe("useShoppingLists Hook", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should initialize with empty lists", () => {
    const { result } = renderHook(() => useShoppingLists());
    
    expect(result.current.lists).toEqual([]);
    expect(result.current.isLoaded).toBe(true);
  });

  it("should create a new list without template", () => {
    const { result } = renderHook(() => useShoppingLists());
    
    act(() => {
      result.current.createList("Minha Lista", false);
    });
    
    expect(result.current.lists).toHaveLength(1);
    expect(result.current.lists[0].name).toBe("Minha Lista");
    expect(result.current.lists[0].items).toEqual([]);
  });

  it("should create a new list with template", () => {
    const { result } = renderHook(() => useShoppingLists());
    
    act(() => {
      result.current.createList("Compras de Janeiro", true);
    });
    
    expect(result.current.lists).toHaveLength(1);
    expect(result.current.lists[0].name).toBe("Compras de Janeiro");
    expect(result.current.lists[0].items.length).toBeGreaterThan(0);
    expect(result.current.lists[0].items.every((item) => !item.isPicked)).toBe(true);
  });

  it("should delete a list", () => {
    const { result } = renderHook(() => useShoppingLists());
    
    act(() => {
      const newList = result.current.createList("Lista Teste", false);
      result.current.deleteList(newList.id);
    });
    
    expect(result.current.lists).toHaveLength(0);
  });

  it("should update list name", () => {
    const { result } = renderHook(() => useShoppingLists());
    
    let newList;
    act(() => {
      newList = result.current.createList("Lista Original", false);
    });
    
    act(() => {
      result.current.updateList(newList!.id, { name: "Lista Atualizada" });
    });
    
    expect(result.current.lists[0].name).toBe("Lista Atualizada");
  });

  it("should add item to list", () => {
    const { result } = renderHook(() => useShoppingLists());
    
    let newList;
    act(() => {
      newList = result.current.createList("Lista Teste", false);
    });
    
    act(() => {
      result.current.addItemToList(newList!.id, {
        name: "Arroz",
        quantity: 2,
        unit: "pct",
        category: "Alimentos",
      });
    });
    
    expect(result.current.lists[0].items).toHaveLength(1);
    expect(result.current.lists[0].items[0].name).toBe("Arroz");
    expect(result.current.lists[0].items[0].isPicked).toBe(false);
  });

  it("should remove item from list", () => {
    const { result } = renderHook(() => useShoppingLists());
    
    let newList;
    act(() => {
      newList = result.current.createList("Lista Teste", false);
    });
    
    let itemId;
    act(() => {
      result.current.addItemToList(newList!.id, {
        name: "Arroz",
        quantity: 1,
        unit: "pct",
        category: "Alimentos",
      });
    });
    
    itemId = result.current.lists[0].items[0].id;
    
    act(() => {
      result.current.removeItemFromList(newList!.id, itemId);
    });
    
    expect(result.current.lists[0].items).toHaveLength(0);
  });

  it("should toggle item picked status", () => {
    const { result } = renderHook(() => useShoppingLists());
    
    let newList;
    act(() => {
      newList = result.current.createList("Lista Teste", false);
    });
    
    act(() => {
      result.current.addItemToList(newList!.id, {
        name: "Arroz",
        quantity: 1,
        unit: "pct",
        category: "Alimentos",
      });
    });
    
    const itemId = result.current.lists[0].items[0].id;
    
    expect(result.current.lists[0].items[0].isPicked).toBe(false);
    
    act(() => {
      result.current.toggleItemPicked(newList!.id, itemId);
    });
    
    expect(result.current.lists[0].items[0].isPicked).toBe(true);
    
    act(() => {
      result.current.toggleItemPicked(newList!.id, itemId);
    });
    
    expect(result.current.lists[0].items[0].isPicked).toBe(false);
  });

  it("should update item quantity", () => {
    const { result } = renderHook(() => useShoppingLists());
    
    let newList;
    act(() => {
      newList = result.current.createList("Lista Teste", false);
    });
    
    act(() => {
      result.current.addItemToList(newList!.id, {
        name: "Arroz",
        quantity: 1,
        unit: "pct",
        category: "Alimentos",
      });
    });
    
    const itemId = result.current.lists[0].items[0].id;
    
    act(() => {
      result.current.updateItemQuantity(newList!.id, itemId, 5);
    });
    
    expect(result.current.lists[0].items[0].quantity).toBe(5);
  });

  it("should persist lists to localStorage", () => {
    const { result } = renderHook(() => useShoppingLists());
    
    act(() => {
      result.current.createList("Lista Persistida", false);
    });
    
    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBeTruthy();
    
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].name).toBe("Lista Persistida");
  });
});
