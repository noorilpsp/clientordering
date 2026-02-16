"use client";

import { UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { EditTableModal } from "@/components/menu/edit-table-modal";

interface DineInSectionProps {
  tableNumber: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (tableNumber: string) => void;
  onCancel: () => void;
}

export function DineInSection({
  tableNumber,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: DineInSectionProps) {
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  const handleTableClick = () => {
    setIsTableModalOpen(true);
  };

  const handleConfirm = (newTableNumber: string) => {
    onSave(newTableNumber);
    setIsTableModalOpen(false);
  };

  return (
    <>
      <div className="mb-5 py-4 px-0 bg-secondary/50 rounded-xl border border-border/50">
        <button
          type="button"
          onClick={handleTableClick}
          className="flex gap-3 w-full items-center justify-center cursor-pointer"
        >
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 flex-shrink-0 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-lg text-foreground font-semibold">
              Table {tableNumber}
            </h3>
            <p className="text-xs text-muted-foreground">Tap to change</p>
          </div>
        </button>
      </div>

      <EditTableModal
        open={isTableModalOpen}
        onOpenChange={setIsTableModalOpen}
        tableNumber={tableNumber}
        onConfirm={handleConfirm}
      />
    </>
  );
}
