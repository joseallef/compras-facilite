"use client";

import { Modal } from "@/shared/ui/modal";
import { TransactionForm } from "./transaction-form";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export function AddTransactionModal({ isOpen, onClose, onSuccess, initialData }: TransactionModalProps) {
  const isEditing = !!initialData;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar Transação" : "Nova Transação"}
      description={isEditing ? "Altere os dados da sua movimentação financeira." : "Registre uma nova movimentação financeira."}
    >
      <TransactionForm 
        onSuccess={onSuccess} 
        onClose={onClose} 
        initialData={initialData}
      />
    </Modal>
  );
}
