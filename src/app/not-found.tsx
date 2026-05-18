"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { Footer } from "@/shared/layout/footer";
import { Header } from "@/shared/layout/header";
import { MobileNav } from "@/shared/layout/mobile-nav";
import { motion } from "framer-motion";
import { ArrowLeft, Home, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  const { isAuthenticated } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  const cartVariants = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, 3, -3, 0],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  const itemsVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.8 + i * 0.1,
        duration: 0.5
      }
    })
  };

  const shoppingItems = ["🥬", "🥑", "🍞", "🧀", "🍎", "🥛"];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <motion.div 
          className="max-w-lg w-full text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Shopping Cart Animation */}
          <motion.div 
            className="relative mb-12"
            variants={cartVariants}
            animate="animate"
          >
            <div className="relative inline-block">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-3xl shadow-2xl shadow-emerald-500/30">
                <ShoppingCart size={80} className="text-white" strokeWidth={2.5} />
              </div>

              {/* Floating Items */}
              {shoppingItems.map((item, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={itemsVariants}
                  initial="hidden"
                  animate="visible"
                  className="absolute text-3xl"
                  style={{
                    left: `${Math.cos(i * Math.PI / 3) * 70 + 50}%`,
                    top: `${Math.sin(i * Math.PI / 3) * 70 + 50}%`,
                  }}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* 404 Text */}
          <motion.div variants={itemVariants}>
            <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              404
            </h1>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Lista não encontrada!
            </h2>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="text-muted text-lg mb-10 max-w-md mx-auto">
              Parece que essa página foi para o mesmo lugar que o item que você sempre esquece no mercado.
              Vamos voltar ao início e tentar novamente!
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href={isAuthenticated ? "/dashboard" : "/"}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 w-full sm:w-auto justify-center"
              >
                <Home size={20} />
                {isAuthenticated ? "Voltar ao Dashboard" : "Voltar ao Início"}
              </motion.button>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 bg-card border border-border px-8 py-4 rounded-xl text-lg font-medium hover:bg-muted/10 transition-colors w-full sm:w-auto justify-center"
            >
              <ArrowLeft size={20} />
              Voltar
            </button>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
      {isAuthenticated && <MobileNav />}
    </div>
  );
}
