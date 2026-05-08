import { calculateDashboardStats } from "@/features/dashboard/services/dashboard-queries";
import { ShoppingList } from "@/shared/types";

describe("Dashboard Utils", () => {
  const mockLists: ShoppingList[] = [
    {
      id: "1",
      name: "Lista 1",
      userId: "u1",
      status: "CONCLUIDA",
      totalValue: 100,
      items: [
        { id: "i1", name: "Item 1", quantity: 1, unit: "un", isPicked: true, category: "Alimentos" },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      name: "Lista 2",
      userId: "u1",
      status: "CONCLUIDA",
      totalValue: 200,
      items: [
        { id: "i2", name: "Item 2", quantity: 1, unit: "un", isPicked: true, category: "Limpeza" },
        { id: "i3", name: "Item 3", quantity: 1, unit: "un", isPicked: true, category: "Limpeza" },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      name: "Lista 3",
      userId: "u1",
      status: "ABERTA",
      totalValue: null,
      items: [
        { id: "i4", name: "Item 4", quantity: 1, unit: "un", isPicked: false, category: "Outros" },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  it("should calculate correct stats for a set of lists", () => {
    const stats = calculateDashboardStats(mockLists);

    expect(stats.totalSpent).toBe(300);
    expect(stats.avgSpent).toBe(150); // 300 / 2 completed lists
    expect(stats.totalItems).toBe(4);
    expect(stats.count).toBe(3);
    expect(stats.completedCount).toBe(2);
    expect(stats.completionRate).toBeCloseTo(66.66, 1);
  });

  it("should handle empty list array", () => {
    const stats = calculateDashboardStats([]);

    expect(stats.totalSpent).toBe(0);
    expect(stats.avgSpent).toBe(0);
    expect(stats.totalItems).toBe(0);
    expect(stats.count).toBe(0);
    expect(stats.completionRate).toBe(0);
  });

  it("should ignore open lists for spend calculations", () => {
    const openOnly: ShoppingList[] = [mockLists[2]];
    const stats = calculateDashboardStats(openOnly);

    expect(stats.totalSpent).toBe(0);
    expect(stats.avgSpent).toBe(0);
    expect(stats.completedCount).toBe(0);
  });
});
