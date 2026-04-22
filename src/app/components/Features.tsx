import { CheckCircle2, ShoppingCart, BarChart3, Clock, Users, Smartphone } from "lucide-react";

const features = [
  {
    icon: ShoppingCart,
    title: "Listas Pré-Montadas",
    description: "Comece rapidamente com modelos de listas para o mês inteiro, adaptados às necessidades da sua família.",
  },
  {
    icon: BarChart3,
    title: "Controle em Tempo Real",
    description: "Marque itens enquanto faz compras e acompanhe seu progresso instantaneamente.",
  },
  {
    icon: Clock,
    title: "Economia de Tempo",
    description: "Nunca mais esqueça itens importantes ou perca tempo no mercado.",
  },
  {
    icon: Users,
    title: "Para Toda Família",
    description: "Ideal para organizar as compras de casa, seja sozinho ou com sua família.",
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
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Tudo que você precisa para compras organizadas
          </h2>
          <p className="mt-4 text-lg text-muted">
            ComprasFácil transforma a experiência de fazer compras com ferramentas 
            intuitivas e eficientes que se adaptam à sua rotina.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card p-8 rounded-3xl border border-border hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors"
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
