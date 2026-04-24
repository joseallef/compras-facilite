// Mock useAuth and services before anything else
jest.mock("@/services/shopping-lists.service", () => ({
  getShoppingLists: jest.fn(),
  createShoppingList: jest.fn(),
  createShoppingListFromTemplate: jest.fn(),
  deleteShoppingList: jest.fn(),
  updateShoppingList: jest.fn(),
  addShoppingItem: jest.fn(),
  removeShoppingItem: jest.fn(),
  toggleShoppingItem: jest.fn(),
  updateShoppingItemQuantity: jest.fn(),
}));

jest.mock("@/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

import * as auth from "@/hooks/useAuth";
import { useShoppingLists } from "@/hooks/useShoppingLists";
import * as services from "@/services/shopping-lists.service";
import { act, renderHook, waitFor } from "@testing-library/react";

const mockedServices = services as jest.Mocked<typeof services>;
const mockedAuth = auth as jest.Mocked<typeof auth>;

const mockUser = { id: "user-1", email: "test@example.com", name: "Test User" };

describe("useShoppingLists Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAuth.useAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
    });
  });

  it("should fetch lists on mount when authenticated", async () => {
    const mockLists = [
      { id: "1", name: "Lista 1", items: [], status: "ABERTA", createdAt: new Date(), updatedAt: new Date() }
    ];
    mockedServices.getShoppingLists.mockResolvedValue(mockLists as any);

    const { result } = renderHook(() => useShoppingLists());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    expect(result.current.lists).toHaveLength(1);
    expect(result.current.lists[0].name).toBe("Lista 1");
    expect(mockedServices.getShoppingLists).toHaveBeenCalledWith("user-1");
  });

  it("should create a new list", async () => {
    const newList = { id: "2", name: "Nova Lista", items: [], status: "ABERTA", createdAt: new Date(), updatedAt: new Date() };
    mockedServices.createShoppingList.mockResolvedValue(newList as any);
    mockedServices.getShoppingLists.mockResolvedValue([newList] as any);

    const { result } = renderHook(() => useShoppingLists());

    let created;
    await act(async () => {
      created = await result.current.createList("Nova Lista");
    });

    expect(mockedServices.createShoppingList).toHaveBeenCalledWith("user-1", "Nova Lista");
    expect(created).toBeDefined();
    expect(result.current.lists).toHaveLength(1);
  });

  it("should delete a list", async () => {
    const mockLists = [
      { id: "1", name: "Lista 1", items: [], status: "ABERTA", createdAt: new Date(), updatedAt: new Date() }
    ];
    mockedServices.getShoppingLists.mockResolvedValue(mockLists as any);
    mockedServices.deleteShoppingList.mockResolvedValue({} as any);

    const { result } = renderHook(() => useShoppingLists());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    await act(async () => {
      await result.current.deleteList("1");
    });

    expect(mockedServices.deleteShoppingList).toHaveBeenCalledWith("1");
    expect(result.current.lists).toHaveLength(0);
  });

  it("should update list", async () => {
    const mockLists = [
      { id: "1", name: "Lista 1", items: [], status: "ABERTA", createdAt: new Date(), updatedAt: new Date() }
    ];
    mockedServices.getShoppingLists.mockResolvedValue(mockLists as any);
    mockedServices.updateShoppingList.mockResolvedValue({} as any);

    const { result } = renderHook(() => useShoppingLists());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    await act(async () => {
      await result.current.updateList("1", { name: "Novo Nome" });
    });

    expect(mockedServices.updateShoppingList).toHaveBeenCalledWith("1", { name: "Novo Nome", status: undefined, totalValue: undefined });
    expect(result.current.lists[0].name).toBe("Novo Nome");
  });
});
