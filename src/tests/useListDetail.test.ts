import { useListDetail } from "@/features/shopping/hooks/use-list-detail";
import { renderHook } from "@testing-library/react";

const mockLists = [
  {
    id: "list-1",
    name: "Lista 1",
    items: [
      { id: "item-1", name: "Arroz", isPicked: true, quantity: 1, unit: "un", category: "Alimentos" },
      { id: "item-2", name: "Feijão", isPicked: false, quantity: 2, unit: "un", category: "Alimentos" },
    ],
    status: "ABERTA",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "list-2",
    name: "Lista 2",
    items: [
      { id: "item-3", name: "Sabão", isPicked: true, quantity: 1, unit: "un", category: "Limpeza" },
    ],
    status: "CONCLUIDA",
    totalValue: 50,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

jest.mock("@/features/shopping/hooks/use-shopping-lists", () => ({
  useShoppingLists: () => ({
    lists: mockLists,
    isLoaded: true,
    updateList: jest.fn(),
    addItemToList: jest.fn(),
    removeItemFromList: jest.fn(),
    toggleItemPicked: jest.fn(),
    updateItemQuantity: jest.fn(),
  }),
}));

describe("useListDetail Hook", () => {
  it("should return the correct list by ID", () => {
    const { result } = renderHook(() => useListDetail("list-1"));
    
    expect(result.current.list).toBeDefined();
    expect(result.current.list?.name).toBe("Lista 1");
  });

  it("should calculate correct stats for a partial list", () => {
    const { result } = renderHook(() => useListDetail("list-1"));
    
    expect(result.current.totalCount).toBe(2);
    expect(result.current.pickedCount).toBe(1);
    expect(result.current.progress).toBe(50);
  });

  it("should calculate correct stats for a completed list", () => {
    const { result } = renderHook(() => useListDetail("list-2"));
    
    expect(result.current.totalCount).toBe(1);
    expect(result.current.pickedCount).toBe(1);
    expect(result.current.progress).toBe(100);
  });

  it("should return zeros when list is not found", () => {
    const { result } = renderHook(() => useListDetail("non-existent"));
    
    expect(result.current.list).toBeUndefined();
    expect(result.current.totalCount).toBe(0);
    expect(result.current.pickedCount).toBe(0);
    expect(result.current.progress).toBe(0);
  });

  it("should return zeros when listId is null", () => {
    const { result } = renderHook(() => useListDetail(null));
    
    expect(result.current.list).toBeUndefined();
    expect(result.current.totalCount).toBe(0);
    expect(result.current.pickedCount).toBe(0);
    expect(result.current.progress).toBe(0);
  });
});
