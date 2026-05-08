"use client";

import { Button } from "@/shared/ui/button";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const showUserMenu = isAuthenticated && Boolean(user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl transition-transform active:scale-95">
              <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-600/20">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <span className="hidden xs:block tracking-tight">ComprasFácil</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1 bg-muted/5 p-1 rounded-xl border border-border/50">
              <Link
                href="/"
                className="text-sm font-bold px-4 py-2 rounded-lg text-muted hover:text-foreground hover:bg-muted/10 transition-all"
              >
                Início
              </Link>
              {showUserMenu && (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm font-bold px-4 py-2 rounded-lg text-muted hover:text-foreground hover:bg-muted/10 transition-all"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/transactions"
                    className="text-sm font-bold px-4 py-2 rounded-lg text-muted hover:text-foreground hover:bg-muted/10 transition-all"
                  >
                    Transações
                  </Link>
                  <Link
                    href="/cards"
                    className="text-sm font-bold px-4 py-2 rounded-lg text-muted hover:text-foreground hover:bg-muted/10 transition-all"
                  >
                    Cartões
                  </Link>
                  <Link
                    href="/goals"
                    className="text-sm font-bold px-4 py-2 rounded-lg text-muted hover:text-foreground hover:bg-muted/10 transition-all"
                  >
                    Metas
                  </Link>
                  <Link
                    href="/shopping"
                    className="text-sm font-bold px-4 py-2 rounded-lg text-muted hover:text-foreground hover:bg-muted/10 transition-all"
                  >
                    Mercado
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {showUserMenu ? (
              <div className="relative" ref={menuRef}>
                <Button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-muted/10 transition-all active:scale-95 border border-transparent hover:border-border"
                >
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-xl">
                    <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="hidden sm:block text-sm font-bold pr-2">
                    {user?.name?.split(" ")[0]}
                  </span>
                </Button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-[1.5rem] shadow-2xl overflow-hidden z-50"
                    >
                      <div className="px-5 py-4 border-b border-border bg-muted/5">
                        <p className="text-sm font-bold truncate">{user?.name}</p>
                        <p className="text-xs text-muted truncate">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <Button
                          onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all group"
                        >
                          <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                          Sair da conta
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted hover:text-foreground transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
