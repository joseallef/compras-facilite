"use client";

import { ShoppingList } from "@/types";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface DashboardChartsProps {
  lists: ShoppingList[];
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

export function DashboardCharts({ lists }: DashboardChartsProps) {
  // 1. Dados para o gráfico de gastos por mês (últimos 6 meses)
  const monthlyData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }).map((_, i) => {
      const date = subMonths(new Date(), i);
      return {
        month: format(date, "MMM", { locale: ptBR }),
        fullName: format(date, "MMMM/yyyy", { locale: ptBR }),
        start: startOfMonth(date),
        end: endOfMonth(date),
        total: 0,
      };
    }).reverse();

    last6Months.forEach(data => {
      const monthLists = lists.filter(l => 
        l.status === "CONCLUIDA" && 
        isWithinInterval(new Date(l.createdAt), { start: data.start, end: data.end })
      );
      data.total = monthLists.reduce((sum, l) => sum + (l.totalValue || 0), 0);
    });

    return last6Months;
  }, [lists]);

  // 2. Dados para o gráfico de categorias mais compradas
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    lists.forEach(list => {
      list.items.forEach(item => {
        if (item.isPicked) {
          categories[item.category] = (categories[item.category] || 0) + item.quantity;
        }
      });
    });

    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [lists]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Evolução de Gastos */}
      <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm">
        <h3 className="text-lg font-bold mb-6 ml-2">Evolução de Gastos</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                tickFormatter={(value) => `R$ ${value}`}
              />
              <Tooltip 
                cursor={{ fill: "rgba(16, 185, 129, 0.05)" }}
                contentStyle={{ 
                  backgroundColor: "white", 
                  borderRadius: "1rem", 
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                }}
                formatter={(value) => [`R$ ${value}`, "Total Gasto"]}
              />
              <Bar 
                dataKey="total" 
                fill="#10b981" 
                radius={[6, 6, 0, 0]} 
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Categorias */}
      <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm">
        <h3 className="text-lg font-bold mb-6 ml-2">Itens por Categoria (Pegos)</h3>
        <div className="h-[300px] w-full flex flex-col md:flex-row items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "white", 
                  borderRadius: "1rem", 
                  border: "1px solid #e2e8f0"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 min-w-[150px] mt-4 md:mt-0">
            {categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs font-bold text-muted-foreground truncate max-w-[120px]">
                  {entry.name} ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
