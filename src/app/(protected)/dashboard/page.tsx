"use client";

import { FinancialCharts } from "@/features/dashboard/components/financial-charts";
import { FinancialKpis } from "@/features/dashboard/components/financial-kpis";
import { RecentTransactions } from "@/features/dashboard/components/recent-transactions";
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard";
import { AddTransactionModal } from "@/features/transactions/components/add-transaction-modal";
import { Button } from "@/shared/ui/button";
import { Select } from "@/shared/ui/select";
import {
    ChartCardSkeleton,
    PageHeaderSkeleton,
    StatCardSkeleton,
    TableCardSkeleton,
} from "@/shared/ui/skeleton";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  const { 
    balance, 
    incomes, 
    expenses, 
    marketExpenses, 
    categoryExpenses, 
    monthlyEvolution,
    recentTransactions, 
    isLoading,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    refresh
  } = useDashboard();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  return (
    <main className="max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Dashboard Financeiro</h1>
            <p className="text-muted mt-1 text-lg flex items-center gap-2">
              <Calendar size={18} className="text-emerald-600" />
              Resumo de {months[selectedMonth]} de {selectedYear}
            </p>
          </div>

          {/* Filtros de Período */}
          <div className="flex items-center gap-2 bg-card p-1.5 rounded-2xl border border-border w-fit shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              className="h-9 w-9 rounded-xl hover:bg-muted"
            >
              <ChevronLeft size={18} />
            </Button>

            <div className="flex items-center gap-2 px-1">
              <Select
                value={selectedMonth.toString()}
                onChange={(v) => setSelectedMonth(parseInt(v))}
                options={months.map((m, i) => ({ value: i.toString(), label: m }))}
                className="h-9 border-none bg-transparent hover:bg-muted font-bold text-sm min-w-[120px] rounded-xl focus:ring-0"
                selectClassName="py-1 h-9 border-none shadow-none bg-transparent"
              />

              <Select
                value={selectedYear.toString()}
                onChange={(v) => setSelectedYear(parseInt(v))}
                options={years.map((y) => ({ value: y.toString(), label: y.toString() }))}
                className="h-9 border-none bg-transparent hover:bg-muted font-bold text-sm min-w-[90px] rounded-xl focus:ring-0"
                selectClassName="py-1 h-9 border-none shadow-none bg-transparent"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              className="h-9 w-9 rounded-xl hover:bg-muted"
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 text-white rounded-xl font-bold px-6 py-2.5 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            Nova Transação
          </Button>
        </div>
      </div>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={refresh}
      />

      {/* KPIs Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <StatCardSkeleton key={item} />
          ))}
        </div>
      ) : (
        <FinancialKpis 
          balance={balance}
          incomes={incomes}
          expenses={expenses}
          marketExpenses={marketExpenses}
        />
      )}

      {/* Gráficos */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCardSkeleton />
          <ChartCardSkeleton withLegend />
        </div>
      ) : (
        <FinancialCharts 
          categoryExpenses={categoryExpenses}
          monthlyEvolution={monthlyEvolution}
        />
      )}

      {/* Transações Recentes */}
      {isLoading ? (
        <TableCardSkeleton />
      ) : (
        <RecentTransactions transactions={recentTransactions} />
      )}
    </main>
  );
}
