"use client";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { RecentTransactions } from "@/features/dashboard/components/recent-transactions";
import { AddTransactionModal } from "@/features/transactions/components/add-transaction-modal";
import { getTransactions } from "@/features/transactions/services/transaction-service";
import { cn } from "@/shared/utils/cn";
import { TransactionType } from "@prisma/client";
import { ArrowDownCircle, ArrowUpCircle, Filter, Plus, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeType, setActiveType] = useState<TransactionType | "ALL">("ALL");

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Erro ao buscar transações", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) ||
                         t.category.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = activeType === "ALL" || t.type === activeType;
    return matchesSearch && matchesType;
  });

  return (
    <main className="max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Transações</h1>
          <p className="text-muted mt-1 text-lg">
            Histórico completo de suas movimentações
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 text-white rounded-xl font-bold px-6 py-2.5 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <Plus size={20} className="mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchTransactions} 
      />

      <div className="flex flex-col gap-6 bg-card p-6 rounded-[2rem] border border-border shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted h-4 w-4" />
            <Input 
              placeholder="Buscar por descrição ou categoria..." 
              className="pl-12 bg-muted/20 border-transparent focus:border-emerald-500/50 rounded-2xl h-12" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex p-1 bg-muted/30 rounded-2xl w-full md:w-auto">
            <button
              onClick={() => setActiveType("ALL")}
              className={cn(
                "flex-1 md:flex-none px-6 py-2 rounded-xl text-sm font-bold transition-all",
                activeType === "ALL" 
                  ? "bg-white dark:bg-zinc-800 shadow-sm text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Todas
            </button>
            <button
              onClick={() => setActiveType(TransactionType.INCOME)}
              className={cn(
                "flex-1 md:flex-none px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                activeType === TransactionType.INCOME 
                  ? "bg-white dark:bg-zinc-800 shadow-sm text-emerald-600" 
                  : "text-muted-foreground hover:text-emerald-600"
              )}
            >
              <ArrowUpCircle size={16} />
              Entradas
            </button>
            <button
              onClick={() => setActiveType(TransactionType.EXPENSE)}
              className={cn(
                "flex-1 md:flex-none px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                activeType === TransactionType.EXPENSE 
                  ? "bg-white dark:bg-zinc-800 shadow-sm text-red-600" 
                  : "text-muted-foreground hover:text-red-600"
              )}
            >
              <ArrowDownCircle size={16} />
              Saídas
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-card rounded-[2.5rem] border border-border p-20 flex flex-col items-center justify-center gap-4">
          <div className="h-10 w-10 rounded-full border-4 border-emerald-600/20 border-t-emerald-600 animate-spin" />
          <p className="text-muted font-medium">Carregando transações...</p>
        </div>
      ) : (
        <RecentTransactions transactions={filteredTransactions} />
      )}
    </main>
  );
}
