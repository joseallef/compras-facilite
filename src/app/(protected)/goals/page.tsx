"use client";

import { Button } from "@/shared/ui/button";
import { AddGoalModal } from "@/features/goals/components/add-goal-modal";
import { getGoals } from "@/features/goals/services/goal-service";
import { formatCurrency } from "@/shared/utils/format";
import { Plus, Target, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchGoals = useCallback(async () => {
    setIsLoading(true);
    const data = await getGoals();
    setGoals(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return (
    <main className="max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Minhas Metas</h1>
          <p className="text-muted mt-1 text-lg">
            Planeje seu futuro e acompanhe seu progresso
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 text-white rounded-xl font-bold px-6 py-2.5 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <Plus size={20} className="mr-2" />
            Nova Meta
          </Button>
        </div>
      </div>

      <AddGoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchGoals} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          
          return (
            <div 
              key={goal.id} 
              className="bg-card rounded-[2.5rem] border border-border p-8 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <Target size={24} />
                </div>
                <h3 className="text-xl font-bold">{goal.title}</h3>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-muted text-xs font-bold uppercase tracking-wider mb-1">Progresso</p>
                    <p className="text-lg font-black">{Math.round(progress)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted text-xs font-bold uppercase tracking-wider mb-1">Faltam</p>
                    <p className="text-sm font-bold text-muted-foreground">
                      {formatCurrency(goal.targetAmount - goal.currentAmount)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Valor Alvo</p>
                    <p className="text-base font-bold">{formatCurrency(goal.targetAmount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Guardado</p>
                    <p className="text-base font-bold text-emerald-600">{formatCurrency(goal.currentAmount)}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {goals.length === 0 && !isLoading && (
          <div className="col-span-full py-20 text-center bg-card rounded-[2.5rem] border border-dashed border-border">
            <TrendingUp size={48} className="mx-auto text-muted mb-4 opacity-20" />
            <p className="text-muted font-medium">Nenhuma meta criada.</p>
            <Button 
              onClick={() => setIsModalOpen(true)}
              variant="outline" 
              className="text-emerald-600 mt-2 rounded-xl border-emerald-200"
            >
              Criar minha primeira meta
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
