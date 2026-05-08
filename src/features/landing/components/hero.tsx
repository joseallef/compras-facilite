import Link from "next/link";
import { ArrowRight, CheckCircle2, ShoppingCart } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" />
              Simplifique suas compras
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Organize suas compras de mercado com{' '}
              <span className="text-emerald-600 dark:text-emerald-400">facilidade</span>
            </h1>
            
            <p className="text-xl text-muted max-w-xl">
              Chega de planilhas bagunçadas e listas no papel. Crie, edite e controle 
              suas compras do mês de forma inteligente e eficiente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
              >
                Começar Agora
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 bg-card border border-border px-8 py-4 rounded-xl text-lg font-medium hover:bg-muted/10 transition-colors"
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
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent rounded-3xl blur-3xl" />
            <div className="relative bg-card border border-border rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Compras de Janeiro</p>
                    <p className="text-sm text-muted">24 itens • 18 pegos</p>
                  </div>
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-2 py-1 rounded-full">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
