"use client";

import { Button } from "@/shared/ui/button";
import { AddCardModal } from "@/features/cards/components/add-card-modal";
import { getCards } from "@/features/cards/services/card-service";
import { formatCurrency } from "@/shared/utils/format";
import { Calendar, CreditCard as CardIcon, DollarSign, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function CardsPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCards = useCallback(async () => {
    setIsLoading(true);
    const data = await getCards();
    setCards(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return (
    <main className="max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Meus Cartões</h1>
          <p className="text-muted mt-1 text-lg">
            Gerencie seus cartões de crédito e limites
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 text-white rounded-xl font-bold px-6 py-2.5 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <Plus size={20} className="mr-2" />
            Novo Cartão
          </Button>
        </div>
      </div>

      <AddCardModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchCards} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div 
            key={card.id} 
            className="relative overflow-hidden bg-card rounded-[2.5rem] border border-border p-8 shadow-sm hover:shadow-md transition-all group"
          >
            {/* Background Decoration */}
            <div 
              className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity" 
              style={{ backgroundColor: card.color || "#8a05be" }}
            />
            
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div 
                  className="p-3 rounded-2xl text-white shadow-lg"
                  style={{ backgroundColor: card.color || "#8a05be" }}
                >
                  <CardIcon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{card.name}</h3>
                  <p className="text-muted text-sm">{card.bank}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-muted text-xs font-bold uppercase tracking-wider mb-1">Limite Disponível</p>
                <p className="text-2xl font-black text-emerald-600">{formatCurrency(card.limit)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-muted">
                    <Calendar size={14} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Vencimento</p>
                    <p className="text-sm font-bold">Dia {card.dueDay}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-muted">
                    <DollarSign size={14} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Fechamento</p>
                    <p className="text-sm font-bold">Dia {card.closingDay}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {cards.length === 0 && !isLoading && (
          <div className="col-span-full py-20 text-center bg-card rounded-[2.5rem] border border-dashed border-border">
            <CardIcon size={48} className="mx-auto text-muted mb-4 opacity-20" />
            <p className="text-muted font-medium">Nenhum cartão cadastrado.</p>
            <Button 
              onClick={() => setIsModalOpen(true)}
              variant="outline" 
              className="text-emerald-600 mt-2 rounded-xl border-emerald-200"
            >
              Cadastrar meu primeiro cartão
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
