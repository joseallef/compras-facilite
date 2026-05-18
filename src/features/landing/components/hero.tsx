import Link from "next/link";
import { ArrowRight, CheckCircle2, ShoppingCart, TrendingUp, Wallet } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 dark:from-emerald-900/10 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" />
              Tudo em um só lugar
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Gerencie suas compras e finanças com{' '}
              <span className="text-emerald-600 dark:text-emerald-400">facilidade</span>
            </h1>
            
            <p className="text-xl text-muted max-w-xl">
              Organize listas de mercado, controle receitas, despesas e investimentos. 
              Tudo em um sistema completo, intuitivo e gratuito!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
              >
                Começar Agora
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 bg-card border border-border px-8 py-4 rounded-xl text-lg font-medium hover:bg-muted/10 transition-colors active:scale-95"
              >
                Saiba Mais
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold">10k+</p>
                <p className="text-sm text-muted">Listas Criadas</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <p className="text-3xl font-bold">5k+</p>
                <p className="text-sm text-muted">Usuários</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <p className="text-3xl font-bold">4.9★</p>
                <p className="text-sm text-muted">Avaliação</p>
              </div>
            </div>
          </div>

          <div className="relative lg:pl-8">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-transparent rounded-3xl blur-3xl" />
            <div className="relative space-y-6">
              {/* Card de Lista de Mercado */}
              <div className="relative bg-card border border-border rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold">Compras de Janeiro</h3>
                    <p className="text-sm text-muted">24 itens • 18 pegos</p>
                  </div>
                  <span className="ml-auto bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full">
                    75%
                  </span>
                </div>
                
                <div className="space-y-2">
                  {["Arroz (5kg)", "Feijão (1kg)", "Café", "Leite (1L)"].map((item, i) => (
                    <div key={item} className="flex items-center gap-3 p-3 bg-muted/10 rounded-lg">
                      <div className={`w-5 h-5 rounded-full border-2 ${i < 2 ? "bg-emerald-500 border-emerald-500" : "border-border"} flex items-center justify-center`}>
                        {i < 2 && <CheckCircle2 className="h-3 w-3 text-white" />}
                      </div>
                      <span className={i < 2 ? "line-through text-muted" : ""}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card de Finanças */}
              <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 shadow-2xl text-white">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">Resumo Financeiro</h3>
                    <p className="text-sm text-emerald-100">Mês de Janeiro</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <TrendingUp className="h-4 w-4 text-emerald-200" />
                      <p className="text-[10px] font-bold text-emerald-100 uppercase">Receitas</p>
                    </div>
                    <p className="text-lg font-black">R$ 5.000</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <TrendingUp className="h-4 w-4 text-red-200" />
                      <p className="text-[10px] font-bold text-emerald-100 uppercase">Despesas</p>
                    </div>
                    <p className="text-lg font-black">R$ 3.200</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <TrendingUp className="h-4 w-4 text-emerald-200" />
                      <p className="text-[10px] font-bold text-emerald-100 uppercase">Invest.</p>
                    </div>
                    <p className="text-lg font-black">R$ 800</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
