"use client";

import { Modal } from "@/shared/ui/modal";
import { TransactionForm } from "./transaction-form";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddTransactionModal({ isOpen, onClose, onSuccess }: AddTransactionModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nova Transação"
      description="Registre uma nova movimentação financeira."
    >
      <TransactionForm onSuccess={onSuccess} onClose={onClose} />
    </Modal>
  );
}
