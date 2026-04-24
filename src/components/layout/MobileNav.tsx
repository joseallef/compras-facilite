"use client";

import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";
import { Home, LayoutDashboard, List, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const navItems = [
    {
      label: "Início",
      href: "/",
      icon: Home,
      active: pathname === "/",
    },
    {
      label: "Painel",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: "Nova",
      href: "/cadastro",
      icon: Plus,
      active: pathname === "/cadastro",
      primary: true,
    },
    {
      label: "Listas",
      href: "/lista",
      icon: List,
      active: pathname === "/lista" || pathname.startsWith("/edicao"),
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-t border-border px-6 py-3 pb-safe-area-inset-bottom">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-all relative",
                item.active ? "text-emerald-600" : "text-muted hover:text-foreground",
                item.primary && " -translate-y-6"
              )}
            >
              {item.primary ? (
                <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg shadow-emerald-600/40 active:scale-90 transition-transform">
                  <Plus size={24} strokeWidth={3} />
                </div>
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
