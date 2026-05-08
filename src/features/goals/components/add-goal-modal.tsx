"use client";

import { Modal } from "@/shared/ui/modal";
import { GoalForm } from "./goal-form";

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddGoalModal({ isOpen, onClose, onSuccess }: AddGoalModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nova Meta Financeira"
      description="Defina um objetivo e acompanhe seu progresso."
    >
      <GoalForm onSuccess={onSuccess} onClose={onClose} />
    </Modal>
  );
}
