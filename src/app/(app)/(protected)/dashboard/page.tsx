"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  ChartCardSkeleton,
  PageHeaderSkeleton,
  StatCardSkeleton,
  TableCardSkeleton,
} from "@/components/ui/Skeleton";
import { useShoppingLists } from "@/hooks/useShoppingLists";
import { cn } from "@/utils/cn";
import { format, isWithinInterval, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CheckCircle2,
  Clock,
  DollarSign,
  Search,
  TrendingUp
} from "lucide-react";
import { useMemo, useState } from "react";
import { DashboardCharts } from "./components/DashboardCharts";
import { KpiCard } from "./components/KpiCard";

import { calculateDashboardStats } from "@/utils/dashboard-utils";

function DashboardHeader({
  filterPeriod,
  searchQuery,
  onSearchChange,
  onFilterChange,
}: {
  filterPeriod: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted mt-1 text-lg">
          Análise detalhada de suas compras e gastos
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          type="text"
          placeholder="Buscar lista..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="group"
          containerClassName="space-y-0"
          leftIcon={<Search className="h-4 w-4" />}
          leftIconClassName="left-3 group-focus-within:text-emerald-500 transition-colors"
          inputClassName="pl-10 py-2 bg-card w-full md:w-64"
        />

        <div className="flex bg-card border border-border rounded-xl p-1">
          {[1, 3, 6, 12].map((m) => (
            <Button
              key={m}
              onClick={() => onFilterChange(m)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                filterPeriod === m
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-muted hover:text-foreground hover:bg-muted/10"
              )}
            >
              {m === 1 ? "Mês" : `${m}M`}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { lists, isLoaded } = useShoppingLists();
  const [filterPeriod, setFilterPeriod] = useState<number>(3); // Meses
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Filtragem de dados
  const filteredLists = useMemo(() => {
    const startDate = subMonths(new Date(), filterPeriod);
    return lists.filter(l => {
      const matchDate = isWithinInterval(new Date(l.createdAt), {
        start: startDate,
        end: new Date()
      });
      const matchSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDate && matchSearch;
    });
  }, [lists, filterPeriod, searchQuery]);

  // 2. Cálculos de KPI
  const stats = useMemo(() => calculateDashboardStats(filteredLists), [filteredLists]);

  if (!isLoaded) {
    return (
      <main className="max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8 pb-24">
        <PageHeaderSkeleton
          subtitleWidth="w-80"
          actionWidths={["w-full md:w-64", "w-60"]}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <StatCardSkeleton key={item} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCardSkeleton />
          <ChartCardSkeleton withLegend />
        </div>

        <TableCardSkeleton />
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8 pb-24">
      <DashboardHeader
        filterPeriod={filterPeriod}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterChange={setFilterPeriod}
      />

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Total Gasto"
          value={new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.totalSpent)}
          icon={TrendingUp}
        />
        <KpiCard 
          title="Média por Lista"
          value={new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.avgSpent)}
          icon={DollarSign}
          iconClassName="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
        />
        <KpiCard 
          title="Listas Concluídas"
          value={`${stats.completedCount} de ${stats.count}`}
          icon={CheckCircle2}
          iconClassName="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
        />
        <KpiCard 
          title="Taxa de Conclusão"
          value={`${Math.round(stats.completionRate)}%`}
          icon={Clock}
          iconClassName="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Gráficos */}
      <DashboardCharts lists={lists} />

      {/* Tabela de Listas Recentes */}
      <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border flex items-center justify-between">
          <h3 className="text-xl font-bold">Listas Analisadas</h3>
          <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs px-3 py-1 rounded-full font-bold">
            {filteredLists.length} resultados
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/5 text-left border-b border-border">
                <th className="px-8 py-4 text-xs font-bold text-muted/60 uppercase tracking-wider">Lista</th>
                <th className="px-8 py-4 text-xs font-bold text-muted/60 uppercase tracking-wider">Data</th>
                <th className="px-8 py-4 text-xs font-bold text-muted/60 uppercase tracking-wider">Itens</th>
                <th className="px-8 py-4 text-xs font-bold text-muted/60 uppercase tracking-wider">Status</th>
                <th className="px-8 py-4 text-xs font-bold text-muted/60 uppercase tracking-wider text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLists.map((list) => (
                <tr key={list.id} className="hover:bg-muted/5 transition-colors cursor-pointer" onClick={() => window.location.href = `/edicao/${list.id}`}>
                  <td className="px-8 py-5 font-bold">{list.name}</td>
                  <td className="px-8 py-5 text-sm text-muted">
                    {format(new Date(list.createdAt), "dd 'de' MMM", { locale: ptBR })}
                  </td>
                  <td className="px-8 py-5 text-sm font-bold">
                    {list.items.length} itens
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border",
                      list.status === "CONCLUIDA" 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                        : "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                    )}>
                      {list.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right font-bold">
                    {list.totalValue 
                      ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(list.totalValue)
                      : "-"}
                  </td>
                </tr>
              ))}
              {filteredLists.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-muted">
                    Nenhuma lista encontrada para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
