"use client";

import { Modal } from "@/shared/ui/modal";
import { CardForm } from "./card-form";

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddCardModal({ isOpen, onClose, onSuccess }: AddCardModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Novo Cartão de Crédito"
      description="Cadastre seus cartões para controlar limites e faturas."
    >
      <CardForm onSuccess={onSuccess} onClose={onClose} />
    </Modal>
  );
}
