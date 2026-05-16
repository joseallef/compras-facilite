"use client";

import { motion } from "framer-motion";
import { ShoppingBag, ShoppingCart, TrendingUp, Wallet } from "lucide-react";

const icons = [
  { Icon: ShoppingCart, color: "text-emerald-500" },
  { Icon: ShoppingBag, color: "text-blue-500" },
  { Icon: TrendingUp, color: "text-purple-500" },
  { Icon: Wallet, color: "text-orange-500" },
];

export function AuthLoading() {
  return (
    <div className="flex items-center gap-3">
      {icons.map(({ Icon, color }, index) => (
        <motion.div
          key={index}
          initial={{ y: 0, scale: 1, opacity: 0.5 }}
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut",
          }}
        >
          <div className="bg-muted/30 p-2 rounded-xl">
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
