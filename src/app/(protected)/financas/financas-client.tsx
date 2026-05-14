"use client";

import {
  deleteRecurringAction,
  deleteTransactionAction,
  ensureMonthlyTransactionsAction,
  getRecurringsAction,
  getTransactionsAction,
  updateRecurringAction,
  updateTransactionAction
} from "@/features/recurring-transactions/actions/recurring-actions";
import { MonthlyTransactions } from "@/features/recurring-transactions/components/monthly-transactions";
import { RecurringForm } from "@/features/recurring-transactions/components/recurring-form";
import { RecurringList } from "@/features/recurring-transactions/components/recurring-list";
import { AddTransactionModal } from "@/features/transactions/components/add-transaction-modal";
import { Button } from "@/shared/ui/button";
import { ConfirmModal } from "@/shared/ui/confirm-modal";
import { Input } from "@/shared/ui/input";
import { Modal } from "@/shared/ui/modal";
import { Select } from "@/shared/ui/select";
import { TableCardSkeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/utils/cn";
import { ArrowDownCircle, ArrowUpCircle, ChevronLeft, ChevronRight, Plus, RepeatIcon, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const TransactionStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
} as const;

type TransactionStatus = typeof TransactionStatus[keyof typeof TransactionStatus];

const TransactionType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;

type TransactionType = typeof TransactionType[keyof typeof TransactionType];

interface FinancasClientProps {
  initialRecurrings: any[];
  initialTransactions: any[];
  initialMonth: number;
  initialYear: number;
}

export function FinancasClient({
  initialRecurrings,
  initialTransactions,
  initialMonth,
  initialYear,
}: FinancasClientProps) {
  const [recurrings, setRecurrings] = useState(initialRecurrings);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [editingRecurring, setEditingRecurring] = useState<any>(null);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<TransactionType | "ALL">("ALL");
  const [activeStatus, setActiveStatus] = useState<TransactionStatus | "ALL">("ALL");

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i - 2);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [recurringsData, transactionsData] = await Promise.all([
        getRecurringsAction(),
        getTransactionsAction(selectedMonth, selectedYear),
      ]);
      setRecurrings(recurringsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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

  const handleGenerateTransactions = async () => {
    try {
      await ensureMonthlyTransactionsAction(selectedMonth, selectedYear);
      await loadData();
      toast.success("Transações geradas com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar transações");
    }
  };

  const handleToggleTransactionStatus = async (id: string, status: TransactionStatus) => {
    try {
      await updateTransactionAction(id, { status });
      await loadData();
      toast.success("Status atualizado!");
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };

  const handleToggleRecurringActive = async (id: string, active: boolean) => {
    try {
      await updateRecurringAction(id, { active });
      await loadData();
      toast.success(`Conta ${active ? "ativada" : "pausada"} com sucesso!`);
    } catch (error) {
      toast.error("Erro ao atualizar conta");
    }
  };

  const handleDeleteRecurring = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta conta recorrente?")) return;
    try {
      await deleteRecurringAction(id);
      await loadData();
      toast.success("Conta excluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir conta");
    }
  };

  const handleFormSuccess = () => {
    loadData();
    setEditingRecurring(null);
  };

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleDeleteTransaction = async () => {
    if (!transactionToDelete) return;
    
    try {
      await deleteTransactionAction(transactionToDelete);
      toast.success("Transação excluída com sucesso!");
      loadData();
    } catch (error) {
      toast.error("Erro ao excluir transação");
    } finally {
      setTransactionToDelete(null);
    }
  };

  const handleCloseTransactionModal = () => {
    setIsTransactionModalOpen(false);
    setEditingTransaction(null);
  };

  const clearFilters = () => {
    setActiveType("ALL");
    setActiveStatus("ALL");
    setSearch("");
  };

  const filteredTransactions = transactions.filter((t) => {
    let matches = true;
    if (activeType !== "ALL" && t.type !== activeType) matches = false;
    if (activeStatus !== "ALL" && t.status !== activeStatus) matches = false;
    
    if (search) {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                           t.category.name.toLowerCase().includes(search.toLowerCase());
      matches = matches && matchesSearch;
    }
    
    return matches;
  });

  const filteredRecurrings = recurrings.filter((r) => {
    let matches = true;
    if (activeType !== "ALL" && r.type !== activeType) matches = false;
    
    if (search) {
      const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
                           r.category.name.toLowerCase().includes(search.toLowerCase());
      matches = matches && matchesSearch;
    }
    
    return matches;
  });

  return (
    <main className="max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Minhas Finanças
            </h1>
            <p className="text-muted mt-1 text-lg">
              Histórico de {months[selectedMonth]} de {selectedYear}
            </p>
          </div>

          {/* Seletor de Mês */}
          <div className="flex items-center gap-2 bg-card p-1.5 rounded-2xl border border-border w-fit shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              className="h-10 w-10 rounded-xl hover:bg-muted"
            >
              <ChevronLeft size={20} />
            </Button>

            <div className="flex items-center gap-2 px-2">
              <Select
                value={selectedMonth.toString()}
                onChange={(v) => setSelectedMonth(parseInt(v))}
                options={months.map((m, i) => ({ value: i.toString(), label: m }))}
                className="h-10 border-none bg-transparent hover:bg-muted font-bold text-sm min-w-[120px] rounded-xl focus:ring-0"
                selectClassName="py-1 h-10 border-none shadow-none bg-transparent"
              />
              <Select
                value={selectedYear.toString()}
                onChange={(v) => setSelectedYear(parseInt(v))}
                options={years.map((y) => ({ value: y.toString(), label: y.toString() }))}
                className="h-10 border-none bg-transparent hover:bg-muted font-bold text-sm min-w-[90px] rounded-xl focus:ring-0"
                selectClassName="py-1 h-10 border-none shadow-none bg-transparent"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              className="h-10 w-10 rounded-xl hover:bg-muted"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={handleGenerateTransactions}
            className="bg-purple-600 text-white rounded-xl font-bold px-6 py-2.5 hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20 active:scale-95"
          >
            <RepeatIcon size={20} className="mr-2" />
            Gerar Transações
          </Button>
          <Button 
            onClick={() => setIsTransactionModalOpen(true)}
            className="bg-emerald-600 text-white rounded-xl font-bold px-6 py-2.5 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <Plus size={20} className="mr-2" />
            Nova Transação
          </Button>
          <Button 
            onClick={() => {
              setEditingRecurring(null);
              setIsFormModalOpen(true);
            }}
            className="bg-blue-600 text-white rounded-xl font-bold px-6 py-2.5 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Plus size={20} className="mr-2" />
            Nova Conta Fixa
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-6 bg-card p-6 rounded-[2rem] border border-border shadow-sm">
        {/* Busca e Tipos Principais */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="w-full lg:w-96">
            <Input 
              placeholder="Buscar por título ou categoria..." 
              rightSlot={
                <div className="flex items-center gap-2">
                  {search && (
                    <button 
                      onClick={() => setSearch("")}
                      className="text-muted hover:text-foreground p-1"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <Search className="text-muted h-4 w-4" />
                </div>
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex p-1 bg-muted/30 rounded-2xl w-full lg:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveType("ALL")}
              className={cn(
                "flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center justify-center h-11",
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
                "flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap h-11",
                activeType === TransactionType.INCOME 
                  ? "bg-white dark:bg-zinc-800 shadow-sm text-emerald-600" 
                  : "text-muted-foreground hover:text-emerald-600"
              )}
            >
              <ArrowUpCircle size={16} />
              Receitas
            </button>
            <button
              onClick={() => setActiveType(TransactionType.EXPENSE)}
              className={cn(
                "flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap h-11",
                activeType === TransactionType.EXPENSE 
                  ? "bg-white dark:bg-zinc-800 shadow-sm text-red-600" 
                  : "text-muted-foreground hover:text-red-600"
              )}
            >
              <ArrowDownCircle size={16} />
              Despesas
            </button>
          </div>
        </div>

        {/* Filtros Avançados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
          <Select 
            label="Status"
            value={activeStatus}
            onChange={(v) => setActiveStatus(v as any)}
            options={[
              { value: "ALL", label: "Todos os Status" },
              { value: TransactionStatus.PAID, label: "Pagas" },
              { value: TransactionStatus.PENDING, label: "Pendentes" },
              { value: TransactionStatus.OVERDUE, label: "Atrasadas" },
            ]}
          />

          <div className="space-y-2">
            <label className="block text-sm font-bold text-muted/60 uppercase tracking-wider ml-1 opacity-0">
              Limpar Filtros
            </label>
            <Button 
              variant="ghost" 
              onClick={clearFilters}
              className="w-full py-3.5 rounded-2xl font-bold text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all flex items-center justify-center gap-2"
            >
              <X size={16} />
              Limpar Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Transações do Mês */}
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Transações do Mês</h2>
        </div>
        {isLoading ? (
          <TableCardSkeleton
            columns={[160, 80, 70, 90, 70, 60]}
            rows={4}
            titleWidth="w-36"
            badgeWidth="w-28"
          />
        ) : (
          <MonthlyTransactions
            transactions={filteredTransactions}
            onToggleStatus={handleToggleTransactionStatus}
            onEdit={handleEditTransaction}
            onDelete={(id) => setTransactionToDelete(id)}
            month={selectedMonth}
            year={selectedYear}
          />
        )}
      </div>

      {/* Minhas Contas */}
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contas Fixas</h2>
        </div>
        {isLoading ? (
          <TableCardSkeleton
            columns={[160, 80, 70, 90, 70, 60]}
            rows={4}
            titleWidth="w-32"
            badgeWidth="w-24"
          />
        ) : (
          <RecurringList
            recurrings={filteredRecurrings}
            onEdit={(recurring) => {
              setEditingRecurring(recurring);
              setIsFormModalOpen(true);
            }}
            onToggleActive={handleToggleRecurringActive}
            onDelete={handleDeleteRecurring}
          />
        )}
      </div>

      {/* Modal de Transação */}
      <AddTransactionModal 
        isOpen={isTransactionModalOpen} 
        onClose={handleCloseTransactionModal} 
        onSuccess={loadData} 
        initialData={editingTransaction}
      />

      {/* Confirmar Exclusão de Transação */}
      <ConfirmModal
        isOpen={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={handleDeleteTransaction}
        title="Excluir Transação"
        description="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        variant="danger"
      />

      {/* Modal de Formulário */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingRecurring(null);
        }}
        title={editingRecurring ? "Editar Conta Fixa" : "Nova Conta Fixa"}
      >
        <RecurringForm
          onSuccess={handleFormSuccess}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingRecurring(null);
          }}
          initialData={editingRecurring}
        />
      </Modal>
    </main>
  );
}
