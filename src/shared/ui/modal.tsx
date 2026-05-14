"use client";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils/cn";
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
                className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content 
              asChild
              aria-describedby={description ? undefined : undefined}
            >
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className={cn(
                    "relative w-full max-w-lg max-h-[90vh] flex flex-col bg-card border border-border rounded-[2.5rem] shadow-2xl outline-none",
                    className
                  )}
                >
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6">
                    {(title || description) && (
                      <div className="flex flex-col gap-2 mb-4 pr-8">
                        {title && (
                          <Dialog.Title className="text-xl font-bold tracking-tight">
                            {title}
                          </Dialog.Title>
                        )}
                        {description && (
                          <Dialog.Description className="text-muted text-sm leading-relaxed">
                            {description}
                          </Dialog.Description>
                        )}
                      </div>
                    )}

                    {!title && <Dialog.Title className="sr-only">Modal</Dialog.Title>}
                    {!description && <Dialog.Description className="sr-only">Modal content</Dialog.Description>}

                    {children}
                  </div>

                  <Dialog.Close asChild>
                    <Button
                      className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-muted/40 hover:text-foreground hover:bg-muted/10 rounded-full transition-all active:scale-90 cursor-pointer z-10"
                      aria-label="Close"
                      onClick={onClose}
                    >
                      <X size={20} />
                    </Button>
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
