import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card pb-24 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-xl">
                <ShoppingCart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span>ComprasFácil</span>
            </Link>
            <p className="text-sm text-muted">
              Facilitando suas compras de mercado com listas inteligentes e controle em tempo real.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Produto</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/" className="hover:text-foreground transition-colors">Funcionalidades</Link></li>
              <li><Link href="/" className="hover:text-foreground transition-colors">Preços</Link></li>
              <li><Link href="/" className="hover:text-foreground transition-colors">Tutorial</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/" className="hover:text-foreground transition-colors">Central de Ajuda</Link></li>
              <li><Link href="/" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/" className="hover:text-foreground transition-colors">Comunidade</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/" className="hover:text-foreground transition-colors">Privacidade</Link></li>
              <li><Link href="/" className="hover:text-foreground transition-colors">Termos</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted">
          <p>&copy; {new Date().getFullYear()} ComprasFácil. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
