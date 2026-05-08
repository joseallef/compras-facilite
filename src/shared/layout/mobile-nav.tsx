"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { cn } from "@/shared/utils/cn";
import { ArrowUpCircle, CreditCard, LayoutDashboard, Plus, Target } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav() {
  const pathname = usePathname() ?? "";
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) return null;

  const navItems = [
    {
      label: "Painel",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: "Transações",
      href: "/transactions",
      icon: ArrowUpCircle,
      active: pathname === "/transactions",
    },
    {
      label: "Nova",
      href: "/shopping/create",
      icon: Plus,
      active: pathname === "/shopping/create",
      primary: true,
    },
    {
      label: "Cartões",
      href: "/cards",
      icon: CreditCard,
      active: pathname === "/cards",
    },
    {
      label: "Metas",
      href: "/goals",
      icon: Target,
      active: pathname === "/goals",
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-t border-border px-6 py-3 pb-safe-area-inset-bottom">
      <div className="grid grid-cols-5 items-end max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-all relative w-full",
                item.active ? "text-emerald-600" : "text-muted hover:text-foreground"
              )}
            >
              {item.primary ? (
                <>
                  <div className="-translate-y-6 bg-emerald-600 text-white p-4 rounded-2xl shadow-lg shadow-emerald-600/40 active:scale-90 transition-transform">
                    <Plus size={24} strokeWidth={3} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider -mt-5">
                    {item.label}
                  </span>
                </>
              ) : (
                <>
                  <Icon size={22} strokeWidth={item.active ? 2.5 : 2} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {item.label}
                  </span>
                  {item.active && (
                    <div className="absolute -top-3 w-1 h-1 bg-emerald-600 rounded-full" />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
