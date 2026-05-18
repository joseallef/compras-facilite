import { CheckCircle2, ShoppingCart, BarChart3, Clock, Users, Smartphone, TrendingUp, Wallet, PieChart, Calendar, CreditCard, TrendingDown } from "lucide-react";

const features = [
  // Compras
  {
    icon: ShoppingCart,
    title: "Listas de Compras Inteligentes",
    description: "Crie, edite e gerencie suas listas de mercado com itens organizados por categorias.",
  },
  {
    icon: CheckCircle2,
    title: "Controle de Progresso",
    description: "Marque itens enquanto faz compras e acompanhe seu progresso em tempo real.",
  },
  // Finanças
  {
    icon: Wallet,
    title: "Controle de Receitas e Despesas",
    description: "Registre todas as suas movimentações financeiras e tenha uma visão clara do seu dinheiro.",
  },
  {
    icon: TrendingUp,
    title: "Investimentos Organizados",
    description: "Monitore seus investimentos separadamente para um planejamento financeiro completo.",
  },
  {
    icon: Calendar,
    title: "Contas Fixas",
    description: "Gerencie suas contas recorrentes (mensais, semanais, anuais) e nunca mais esqueça um vencimento.",
  },
  {
    icon: PieChart,
    title: "Dashboard Completo",
    description: "Visualização gráfica do seu desempenho financeiro com gráficos e relatórios intuitivos.",
  },
  // Geral
  {
    icon: Users,
    title: "Para Toda Família",
    description: "Ideal para organizar tanto as compras quanto as finanças da casa toda.",
  },
  {
    icon: Smartphone,
    title: "Acesse de Qualquer Lugar",
    description: "Sistema responsivo que funciona perfeitamente no celular, tablet ou computador.",
  },
  {
    icon: CheckCircle2,
    title: "100% Gratuito",
    description: "Todas as funcionalidades disponíveis sem nenhum custo. Simples assim.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Tudo que você precisa em um só sistema
          </h2>
          <p className="mt-4 text-lg text-muted">
            ComprasFácil combina organização de listas de mercado com controle financeiro completo, 
            tudo em uma plataforma intuitiva e fácil de usar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card p-8 rounded-3xl border border-border hover:border-emerald-200 dark:hover:border-emerald-800 transition-all hover:shadow-lg"
            >
              <div className="bg-emerald-100 dark:bg-emerald-900/30 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <feature.icon className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
