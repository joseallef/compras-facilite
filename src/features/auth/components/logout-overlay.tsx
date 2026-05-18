"use client";

import { motion } from "framer-motion";
import { Apple, Beef, Carrot, Milk, Package, ShoppingBag, ShoppingCart, TrendingUp, Wallet } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

const sideIcons = [
  { Icon: ShoppingCart, color: "text-emerald-500", delay: 0 },
  { Icon: ShoppingBag, color: "text-blue-500", delay: 0.2 },
  { Icon: TrendingUp, color: "text-purple-500", delay: 0.4 },
  { Icon: Wallet, color: "text-orange-500", delay: 0.6 },
  { Icon: Package, color: "text-pink-500", delay: 0.8 },
  { Icon: Apple, color: "text-red-500", delay: 1 },
  { Icon: Carrot, color: "text-orange-600", delay: 1.2 },
  { Icon: Beef, color: "text-rose-600", delay: 1.4 },
  { Icon: Milk, color: "text-sky-500", delay: 1.6 },
];

interface LogoutOverlayProps {
  onComplete: () => void;
}

export function LogoutOverlay({ onComplete }: LogoutOverlayProps) {
  useEffect(() => {
    toast.success("Sessão encerrada com sucesso!");
    
    const timer = setTimeout(() => {
      onComplete();
      window.location.href = "/login";
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      {/* Animações nas laterais (desktop) e topo/baixo (mobile) */}
      <div className="hidden lg:block absolute left-4 top-1/2 -translate-y-1/2 space-y-8">
        {sideIcons.slice(0, 5).map(({ Icon, color, delay }, index) => (
          <motion.div
            key={`left-${index}`}
            initial={{ x: -100, opacity: 0 }}
            animate={{
              x: [0, 20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: delay,
              ease: "easeInOut",
            }}
          >
            <div className="bg-muted/30 p-3 rounded-2xl">
              <Icon className={`h-7 w-7 ${color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 space-y-8">
        {sideIcons.slice(5).map(({ Icon, color, delay }, index) => (
          <motion.div
            key={`right-${index}`}
            initial={{ x: 100, opacity: 0 }}
            animate={{
              x: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: delay,
              ease: "easeInOut",
            }}
          >
            <div className="bg-muted/30 p-3 rounded-2xl">
              <Icon className={`h-7 w-7 ${color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Animações no topo e baixo para mobile */}
      <div className="lg:hidden absolute top-4 left-1/2 -translate-x-1/2 flex gap-4">
        {sideIcons.slice(0, 4).map(({ Icon, color, delay }, index) => (
          <motion.div
            key={`top-${index}`}
            initial={{ y: -50, opacity: 0 }}
            animate={{
              y: [0, 15, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: delay * 0.5,
              ease: "easeInOut",
            }}
          >
            <div className="bg-muted/30 p-2 rounded-xl">
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
        {sideIcons.slice(5).map(({ Icon, color, delay }, index) => (
          <motion.div
            key={`bottom-${index}`}
            initial={{ y: 50, opacity: 0 }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: delay * 0.5,
              ease: "easeInOut",
            }}
          >
            <div className="bg-muted/30 p-2 rounded-xl">
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card border border-border rounded-3xl p-8 shadow-2xl text-center relative z-10"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="inline-block mb-4"
        >
          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-2xl">
            <ShoppingCart className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">Saindo...</h2>
        <p className="text-muted">Volte sempre!</p>
      </motion.div>
    </motion.div>
  );
}
