"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./Button";

import { cn } from "@/utils/cn";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  // 1. Detect scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      // Show button if page is scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // 2. Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 3. Calculate dynamic position
  // If we are in the edit page, there is an extra bottom bar in market mode
  const isEditPage = pathname?.startsWith("/edicao");

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          className={cn(
            "fixed right-6 md:right-8 z-[60] transition-all duration-300",
            isEditPage 
              ? "bottom-44 md:bottom-24" // Higher if market bar might be present
              : "bottom-24 md:bottom-8"  // Default above MobileNav
          )}
        >
          <Button
            onClick={scrollToTop}
            size="icon"
            className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center justify-center"
            aria-label="Voltar ao topo"
          >
            <ArrowUp size={24} />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
