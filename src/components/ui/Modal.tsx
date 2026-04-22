"use client";

import { cn } from "@/utils/cn";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className={cn(
                    "relative w-full max-w-lg overflow-hidden bg-card border border-border rounded-[2.5rem] p-8 shadow-2xl outline-none",
                    className
                  )}
                >
                  <div className="flex flex-col gap-2 mb-6">
                    {title && (
                      <Dialog.Title className="text-2xl font-bold tracking-tight">
                        {title}
                      </Dialog.Title>
                    )}
                    {description && (
                      <Dialog.Description className="text-muted text-sm leading-relaxed">
                        {description}
                      </Dialog.Description>
                    )}
                  </div>

                  {children}

                  <Dialog.Close asChild>
                    <button
                      className="absolute top-6 right-6 p-2 text-muted/40 hover:text-foreground hover:bg-muted/10 rounded-full transition-all active:scale-90 cursor-pointer"
                      aria-label="Close"
                      onClick={onClose}
                    >
                      <X size={20} />
                    </button>
                  </Dialog.Close>
                </motion.div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
