"use client";

import { formatCurrency } from "@/shared/utils/format";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

interface FinancialChartsProps {
  categoryExpenses: { name: string; value: number; color: string }[];
  monthlyEvolution?: { month: string; income: number; expense: number }[];
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

export function FinancialCharts({ categoryExpenses, monthlyEvolution }: FinancialChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Gastos por Categoria */}
      <div className="bg-card p-6 rounded-[2.5rem] border border-border shadow-sm">
        <h3 className="text-xl font-bold mb-8">Gastos por Categoria</h3>
        <div className="h-[350px] w-full flex flex-col md:flex-row items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryExpenses}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={8}
                dataKey="value"
              >
                {categoryExpenses.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => formatCurrency(Number(value))}
                contentStyle={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.9)", 
                  borderRadius: "1.5rem", 
                  border: "1px solid #e2e8f0",
                  backdropFilter: "blur(4px)"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-3 min-w-[180px] mt-6 md:mt-0 px-4">
            {categoryExpenses.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color || COLORS[index % COLORS.length] }} />
                  <span className="text-sm font-medium text-muted-foreground truncate max-w-[120px]">
                    {entry.name}
                  </span>
                </div>
                <span className="text-sm font-bold">
                  {formatCurrency(entry.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfico de Evolução Mensal */}
      <div className="bg-card p-6 rounded-[2.5rem] border border-border shadow-sm">
        <h3 className="text-xl font-bold mb-8">Receitas x Despesas</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyEvolution || []}>
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
                  backgroundColor: "rgba(255, 255, 255, 0.9)", 
                  borderRadius: "1.5rem", 
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  backdropFilter: "blur(4px)"
                }}
                formatter={(value: any) => formatCurrency(Number(value))}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" />
              <Bar name="Receitas" dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar name="Despesas" dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
