"use client";

import { useAuth } from "@/hooks/useAuth";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
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
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-xl">
                <ShoppingCart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span>ComprasFácil</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                Início
              </Link>
              {isAuthenticated && (
                <Link
                  href="/lista"
                  className="text-sm font-medium text-muted hover:text-foreground transition-colors"
                >
                  Minhas Listas
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-muted/10 transition-colors"
                >
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
                    <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {user?.name}
                  </span>
                </button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-muted hover:bg-muted/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sair
                      </button>
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
                  href="/login"
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
