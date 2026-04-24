"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, ShoppingCart, Trash2, CheckCircle2, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "@/utils/cn";
import { ShoppingListCardProps } from "../types";

export function ShoppingListCard({ list, onClick, onDelete }: ShoppingListCardProps) {
  const router = useRouter();
  const pickedCount = list.items.filter((i) => i.isPicked).length;
  const totalCount = list.items.length;
  const progress = totalCount > 0 ? (pickedCount / totalCount) * 100 : 0;
  const isCompleted = list.status === "CONCLUIDA";

  return (
    <motion.div
      layoutId={list.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      onClick={() => router.push(`/edicao/${list.id}`)}
      className="group bg-card p-6 rounded-[2rem] border border-border shadow-sm hover:shadow-xl hover:border-emerald-500/20 dark:hover:border-emerald-500/20 transition-all cursor-pointer relative overflow-hidden"
    >
      {isCompleted && (
        <div className="absolute top-0 right-0">
          <div className="bg-emerald-500 text-white text-[10px] font-bold py-1 px-4 rotate-45 translate-x-3 translate-y-2 shadow-sm uppercase tracking-widest">
            Concluída
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div className={cn(
          "p-3 rounded-2xl transition-all duration-300",
          isCompleted 
            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
            : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-110"
        )}>
          <ShoppingCart size={24} />
        </div>
        
        <div className="flex gap-2">
          {list.totalValue !== null && list.totalValue !== undefined && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 rounded-xl text-xs font-bold">
              <DollarSign size={14} />
              <span>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(list.totalValue)}
              </span>
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2.5 rounded-xl text-muted/40 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-90"
            title="Excluir lista"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-1 mb-6">
        <h3 className="text-xl font-bold tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
          {list.name}
        </h3>
        <div className="flex items-center gap-2 text-muted text-sm">
          <Calendar size={14} className="shrink-0" />
          <span className="truncate">
            {format(list.createdAt, "dd 'de' MMMM", { locale: ptBR })}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-end text-sm font-bold">
          <span className="text-muted/60 uppercase tracking-wider text-[10px]">Progresso</span>
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full",
            isCompleted 
              ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" 
              : "text-emerald-600 dark:text-emerald-400"
          )}>
            {pickedCount}/{totalCount} itens
          </span>
        </div>
        
        <div className="relative h-2.5 w-full bg-muted/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={cn(
              "absolute inset-y-0 left-0 rounded-full",
              isCompleted ? "bg-emerald-500" : "bg-gradient-to-r from-emerald-500 to-emerald-400"
            )}
          />
        </div>
      </div>

      {/* Navigation Indicator - Discretely integrated */}
      <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs font-bold text-muted/40 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
        <span>ABRIR LISTA</span>
        <ChevronRight size={14} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
}
