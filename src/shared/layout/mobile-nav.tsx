"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { cn } from "@/shared/utils/cn";
import type { LucideIcon } from "lucide-react";
import { ShoppingBag, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  active: boolean;
  primary?: boolean;
}

export function MobileNav() {
  const pathname = usePathname() ?? "";
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) return null;

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: TrendingUp,
      active: pathname === "/dashboard",
    },
    {
      label: "Finanças",
      href: "/financas",
      icon: Wallet,
      active: pathname === "/financas",
    },
    {
      label: "Mercado",
      href: "/shopping",
      icon: ShoppingBag,
      active: pathname.startsWith("/shopping"),
    },
  ];

  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-t border-border px-6 py-3 pb-safe-area-inset-bottom">
      <div className="grid grid-cols-3 items-end max-w-lg mx-auto">
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
              <Icon size={22} strokeWidth={item.active ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {item.label}
              </span>
              {item.active && (
                <div className="absolute -top-3 w-1 h-1 bg-emerald-600 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
