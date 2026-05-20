"use client";

import { getDashboardTransactionsAction, getYearlyDataAction } from "@/features/dashboard/actions/dashboard-actions";
import { RecentTransactions } from "@/features/dashboard/components/recent-transactions";
import { COLORS, MONTHS, TransactionStatus, TransactionType, YEARS } from "@/shared/constants";
import { Button } from "@/shared/ui/button";
import { Select } from "@/shared/ui/select";
import { DashboardSkeleton } from "@/shared/ui/skeleton";
import { formatCurrency } from "@/shared/utils/format";
import { ArrowDownRight, ArrowUpRight, BarChart3, Calendar, ChevronLeft, ChevronRight, PieChart as PieChartIcon, PiggyBank, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DashboardClientProps {
  initialTransactions: any[];
  initialMonth: number;
  initialYear: number;
}

export function DashboardClient({
  initialTransactions,
  initialMonth,
  initialYear,
}: DashboardClientProps) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [yearlyData, setYearlyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [viewMode, setViewMode] = useState<"month" | "year">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dashboard_view_mode");
      return saved === "month" || saved === "year" ? saved : "month";
    }
    return "month";
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const stats = useMemo(() => {
    const currentMonthTransactions = transactions;

    const incomes = currentMonthTransactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((acc, t) => acc + t.amount, 0);

    const expenses = currentMonthTransactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => acc + t.amount, 0);

    const investments = currentMonthTransactions
      .filter((t) => t.type === TransactionType.INVESTMENT)
      .reduce((acc, t) => acc + t.amount, 0);

    const pending = currentMonthTransactions
      .filter((t) => t.status === TransactionStatus.PENDING)
      .reduce((acc, t) => acc + t.amount, 0);

    const paid = currentMonthTransactions
      .filter((t) => t.status === TransactionStatus.PAID)
      .reduce((acc, t) => acc + t.amount, 0);

    const overdue = currentMonthTransactions
      .filter((t) => t.status === TransactionStatus.OVERDUE)
      .reduce((acc, t) => acc + t.amount, 0);

    const balance = incomes - (expenses + investments);

    const categoryData: Record<string, { name: string; value: number; color: string }> = {};
    currentMonthTransactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .forEach((t) => {
        if (!categoryData[t.category.id]) {
          categoryData[t.category.id] = {
            name: t.category.name,
            value: 0,
            color: t.category.color || "#cbd5e1",
          };
        }
        categoryData[t.category.id].value += t.amount;
      });

    return {
      incomes,
      expenses,
      investments,
      balance,
      pending,
      paid,
      overdue,
      categoryExpenses: Object.values(categoryData).sort((a, b) => b.value - a.value),
      recentTransactions: transactions.slice(0, 10),
    };
  }, [transactions]);

  const yearlyStats = useMemo(() => {
    if (!yearlyData?.transactions) {
      return { monthlyEvolution: [], yearlyCategoryExpenses: [] };
    }

    const monthlyData = Array(12).fill(null).map((_, month) => {
      const monthTrans = yearlyData.transactions.filter(
        (t: any) => t.competencyMonth === month
      );
      const income = monthTrans
        .filter((t: any) => t.type === TransactionType.INCOME)
        .reduce((acc: number, t: any) => acc + t.amount, 0);
      const expense = monthTrans
        .filter((t: any) => t.type === TransactionType.EXPENSE)
        .reduce((acc: number, t: any) => acc + t.amount, 0);
      const investment = monthTrans
        .filter((t: any) => t.type === TransactionType.INVESTMENT)
        .reduce((acc: number, t: any) => acc + t.amount, 0);
      return {
        month: MONTHS[month].slice(0, 3),
        fullMonth: MONTHS[month],
        income,
        expense,
        investment,
        balance: income - (expense + investment),
      };
    });

    const categoryData: Record<string, { name: string; value: number; color: string }> = {};
    yearlyData.transactions
      .filter((t: any) => t.type === TransactionType.EXPENSE)
      .forEach((t: any) => {
        if (!categoryData[t.category.id]) {
          categoryData[t.category.id] = {
            name: t.category.name,
            value: 0,
            color: t.category.color || "#cbd5e1",
          };
        }
        categoryData[t.category.id].value += t.amount;
      });

    return {
      monthlyEvolution: monthlyData,
      yearlyCategoryExpenses: Object.values(categoryData).sort((a, b) => b.value - a.value),
      totalIncome: monthlyData.reduce((acc, m) => acc + m.income, 0),
      totalExpense: monthlyData.reduce((acc, m) => acc + m.expense, 0),
      totalInvestment: monthlyData.reduce((acc, m) => acc + m.investment, 0),
      totalBalance: monthlyData.reduce((acc, m) => acc + m.balance, 0),
    };
  }, [yearlyData]);

  const categories = yearlyData?.categories || [];

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [transData, yearData] = await Promise.all([
        getDashboardTransactionsAction(selectedMonth, selectedYear),
        getYearlyDataAction(selectedYear),
      ]);
      setTransactions(transData);
      setYearlyData(yearData);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth, selectedYear]);

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

  const handlePrevYear = () => {
    setSelectedYear(selectedYear - 1);
  };

  const handleNextYear = () => {
    setSelectedYear(selectedYear + 1);
  };

  useEffect(() => {
    localStorage.setItem("dashboard_view_mode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <main className="max-w-7xl mx-auto w-full p-4 md:p-8 space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Dashboard Financeiro
            </h1>
            <p className="text-muted mt-1 text-base md:text-lg flex items-center gap-2">
              <Calendar size={18} className="text-emerald-600" />
              {viewMode === "month" 
                ? `Resumo de ${MONTHS[selectedMonth]} de ${selectedYear}`
                : `Visão Anual de ${selectedYear}`
              }
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-card p-1 rounded-2xl border border-border w-full md:w-fit shadow-sm">
            <Button
              variant={viewMode === "month" ? "primary" : "ghost"}
              onClick={() => setViewMode("month")}
              className="h-10 flex-1 md:flex-none min-w-[120px] px-5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
              style={viewMode === "month" 
                ? { 
                    backgroundColor: "#059669", 
                    color: "white",
                    boxShadow: "0 10px 15px -3px rgba(5, 150, 105, 0.2)"
                  } 
                : undefined}
            >
              <BarChart3 size={18} />
              Mensal
            </Button>
            <Button
              variant={viewMode === "year" ? "primary" : "ghost"}
              onClick={() => setViewMode("year")}
              className="h-10 flex-1 md:flex-none min-w-[120px] px-5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
              style={viewMode === "year"
                ? { 
                    backgroundColor: "#059669", 
                    color: "white",
                    boxShadow: "0 10px 15px -3px rgba(5, 150, 105, 0.2)"
                  }
                : undefined}
            >
              <PieChartIcon size={18} />
              Anual
            </Button>
          </div>

          {/* Period Controls */}
          <div className="flex items-center gap-2 bg-card p-1.5 rounded-2xl border border-border w-full md:w-fit shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={viewMode === "month" ? handlePrevMonth : handlePrevYear}
              className="h-10 w-10 rounded-xl hover:bg-muted"
            >
              <ChevronLeft size={20} />
            </Button>

            <div className="flex-1 flex items-center gap-2 px-1 md:px-2">
              {viewMode === "month" && (
                <Select
                  value={selectedMonth.toString()}
                  onChange={(v) => setSelectedMonth(parseInt(v))}
                  options={MONTHS.map((m: string, i: number) => ({ value: i.toString(), label: m }))}
                  className="h-10 border-none bg-transparent hover:bg-muted font-bold text-sm flex-1 md:flex-none min-w-[80px] md:min-w-[120px] rounded-xl focus:ring-0"
                  selectClassName="py-1 h-10 border-none shadow-none bg-transparent"
                />
              )}

              <Select
                value={selectedYear.toString()}
                onChange={(v) => setSelectedYear(parseInt(v))}
                options={YEARS.map((y: number) => ({ value: y.toString(), label: y.toString() }))}
                className="h-10 border-none bg-transparent hover:bg-muted font-bold text-sm flex-1 md:flex-none min-w-[70px] md:min-w-[90px] rounded-xl focus:ring-0"
                selectClassName="py-1 h-10 border-none shadow-none bg-transparent"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={viewMode === "month" ? handleNextMonth : handleNextYear}
              className="h-10 w-10 rounded-xl hover:bg-muted"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="hidden md:flex flex-wrap gap-3">
          <Link href="/financas">
            <Button className="bg-white text-gray-900 rounded-xl font-bold px-6 py-2.5 hover:bg-gray-50 transition-all shadow-lg border border-gray-200 active:scale-95">
              Minhas Finanças
            </Button>
          </Link>
          <Link href="/mercado">
            <Button className="bg-emerald-600 text-white rounded-xl font-bold px-6 py-2.5 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95">
              Listas de Compras
            </Button>
          </Link>
        </div>

        {/* Quick Links - Mobile Only */}
        <div className="md:hidden grid grid-cols-2 gap-3">
          <Link href="/financas" className="w-full">
            <Button className="w-full bg-white text-gray-900 rounded-2xl font-bold px-4 py-3.5 hover:bg-gray-50 transition-all shadow-lg border border-gray-200 active:scale-95">
              Minhas Finanças
            </Button>
          </Link>
          <Link href="/mercado" className="w-full">
            <Button className="w-full bg-emerald-600 text-white rounded-2xl font-bold px-4 py-3.5 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95">
              Listas de Compras
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Main Summary Card */}
          <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 text-white shadow-xl shadow-emerald-600/30 relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -left-20 -top-20 w-64 h-64 bg-emerald-300/10 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <div className="flex flex-col gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-100 font-bold uppercase tracking-wider text-xs">
                    <TrendingUp size={16} />
                    {viewMode === "month" ? "Resumo do Mês" : "Resumo Anual"}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black flex items-baseline gap-2">
                    {formatCurrency(viewMode === "month" ? stats.balance : yearlyStats.totalBalance || 0)}
                    <span className="text-sm md:text-lg font-medium text-emerald-100">de saldo</span>
                  </h2>
                  <p className="text-emerald-50/90 max-w-xl text-xs md:text-sm font-medium leading-relaxed">
                    {viewMode === "month" 
                      ? `Acompanhe suas receitas e despesas de ${MONTHS[selectedMonth]}.`
                      : `Visão completa do desempenho financeiro ao longo de ${selectedYear}.`
                    }
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  <div className="bg-white/15 backdrop-blur-md p-4 md:p-5 rounded-2xl md:rounded-3xl border border-white/20 hover:bg-white/20 transition-all">
                    <p className="text-[9px] md:text-[10px] font-bold text-emerald-100 uppercase mb-1.5 md:mb-2 tracking-wider">Receitas</p>
                    <p className="text-xl md:text-2xl font-black flex items-center gap-1">
                      <ArrowUpRight size={18} className="text-emerald-200" />
                      {formatCurrency(viewMode === "month" ? stats.incomes : yearlyStats.totalIncome || 0)}
                    </p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-md p-4 md:p-5 rounded-2xl md:rounded-3xl border border-white/20 hover:bg-white/20 transition-all">
                    <p className="text-[9px] md:text-[10px] font-bold text-emerald-100 uppercase mb-1.5 md:mb-2 tracking-wider">Despesas</p>
                    <p className="text-xl md:text-2xl font-black flex items-center gap-1">
                      <ArrowDownRight size={18} className="text-red-200" />
                      {formatCurrency(viewMode === "month" ? stats.expenses : yearlyStats.totalExpense || 0)}
                    </p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-md p-4 md:p-5 rounded-2xl md:rounded-3xl border border-white/20 hover:bg-white/20 transition-all">
                    <p className="text-[9px] md:text-[10px] font-bold text-emerald-100 uppercase mb-1.5 md:mb-2 tracking-wider">Investimentos</p>
                    <p className="text-xl md:text-2xl font-black flex items-center gap-1">
                      <PiggyBank size={18} className="text-emerald-200" />
                      {formatCurrency(viewMode === "month" ? stats.investments : yearlyStats.totalInvestment || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KPIs de Status */}
          {viewMode === "month" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <div className="bg-card p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <h3 className="text-xs md:text-sm font-semibold text-muted-foreground">Pagas</h3>
                  <div className="p-1.5 md:p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xl md:text-2xl font-black">{formatCurrency(stats.paid)}</p>
              </div>
              
              <div className="bg-card p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <h3 className="text-xs md:text-sm font-semibold text-muted-foreground">Pendentes</h3>
                  <div className="p-1.5 md:p-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xl md:text-2xl font-black">{formatCurrency(stats.pending)}</p>
              </div>
              
              <div className="bg-card p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <h3 className="text-xs md:text-sm font-semibold text-muted-foreground">Atrasadas</h3>
                  <div className="p-1.5 md:p-2 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xl md:text-2xl font-black">{formatCurrency(stats.overdue)}</p>
              </div>
            </div>
          )}

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution (Pie Chart) */}
            <div className="bg-card p-7 rounded-[2.5rem] border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Composição de Gastos</h3>
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <PieChartIcon size={20} className="text-emerald-600" />
                </div>
              </div>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={viewMode === "month" ? stats.categoryExpenses : yearlyStats.yearlyCategoryExpenses || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {(viewMode === "month" ? stats.categoryExpenses : yearlyStats.yearlyCategoryExpenses || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => formatCurrency(Number(value))}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.98)",
                        borderRadius: "1.5rem",
                        border: "1px solid #e2e8f0",
                        backdropFilter: "blur(8px)",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 px-2">
                {(viewMode === "month" ? stats.categoryExpenses : yearlyStats.yearlyCategoryExpenses || []).slice(0, 6).map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color || COLORS[index % COLORS.length] }} />
                    <span className="text-xs font-medium text-muted-foreground">
                      {entry.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly/Yearly Evolution */}
            <div className="bg-card p-7 rounded-[2.5rem] border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Evolução Financeira</h3>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <BarChart3 size={20} className="text-blue-600" />
                </div>
              </div>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearlyStats.monthlyEvolution || []}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
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
                      tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      cursor={{ stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "4 4" }}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.98)",
                        borderRadius: "1.5rem",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        backdropFilter: "blur(8px)",
                      }}
                      formatter={(value: any) => formatCurrency(Number(value))}
                    />
                    <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingTop: 0 }} />
                    <Line
                      type="monotone"
                      name="Receitas"
                      dataKey="income"
                      stroke="#10b981"
                      strokeWidth={4}
                      dot={{ r: 5, strokeWidth: 2, fill: "white" }}
                      activeDot={{ r: 7 }}
                      fill="url(#colorIncome)"
                    />
                    <Line
                      type="monotone"
                      name="Despesas"
                      dataKey="expense"
                      stroke="#ef4444"
                      strokeWidth={4}
                      dot={{ r: 5, strokeWidth: 2, fill: "white" }}
                      activeDot={{ r: 7 }}
                      fill="url(#colorExpense)"
                    />
                    <Line
                      type="monotone"
                      name="Investimentos"
                      dataKey="investment"
                      stroke="#3b82f6"
                      strokeWidth={4}
                      dot={{ r: 5, strokeWidth: 2, fill: "white" }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bar Chart for Comparison */}
          <div className="bg-card p-7 rounded-[2.5rem] border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Comparativo Mensal</h3>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyStats.monthlyEvolution || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
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
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(16, 185, 129, 0.05)" }}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.98)",
                      borderRadius: "1.5rem",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      backdropFilter: "blur(8px)",
                    }}
                    formatter={(value: any) => formatCurrency(Number(value))}
                  />
                  <Legend verticalAlign="top" align="right" iconType="circle" />
                  <Bar name="Receitas" dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} barSize={32} />
                  <Bar name="Despesas" dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={32} />
                  <Bar name="Investimentos" dataKey="investment" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Transactions */}
          {viewMode === "month" && (
            <RecentTransactions transactions={stats.recentTransactions} />
          )}
        </>
      )}
    </main>
  );
}
