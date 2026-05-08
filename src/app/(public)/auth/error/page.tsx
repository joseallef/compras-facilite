import Link from "next/link";
import { ShoppingCart, TriangleAlert } from "lucide-react";

function getErrorCopy(error: string | null) {
  switch (error) {
    case "Configuration":
      return {
        title: "Erro de configuração",
        description:
          "Há um problema de configuração no servidor de autenticação. Tente novamente mais tarde.",
      };
    case "AccessDenied":
      return {
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta aplicação.",
      };
    case "Verification":
      return {
        title: "Não foi possível verificar",
        description:
          "Não foi possível verificar sua autenticação. Tente novamente.",
      };
    default:
      return {
        title: "Erro ao autenticar",
        description:
          "Não foi possível concluir sua autenticação. Tente novamente.",
      };
  }
}

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const rawError = searchParams?.error;
  const error = Array.isArray(rawError) ? rawError[0] : rawError ?? null;
  const copy = getErrorCopy(error);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold text-2xl mb-8"
          >
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-xl">
              <ShoppingCart className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span>ComprasFácil</span>
          </Link>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-3">
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <TriangleAlert className="h-7 w-7 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{copy.title}</h1>
            <p className="text-muted text-sm">{copy.description}</p>
            {error && (
              <div className="text-[11px] font-mono text-muted/70 bg-muted/10 border border-border rounded-xl px-3 py-2 inline-block">
                Código: {error}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/login"
              className="flex-1 text-center bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all"
            >
              Ir para login
            </Link>
            <Link
              href="/"
              className="flex-1 text-center px-6 py-3 rounded-xl font-semibold border border-border hover:bg-muted/10 transition-all"
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
