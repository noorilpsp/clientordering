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
      <div className="mb-5 py-4 px-0 bg-card rounded-lg border border-border">
        <button
          type="button"
          onClick={handleTableClick}
          className="flex gap-3 w-full items-center justify-center cursor-pointer"
        >
          <UtensilsCrossed className="w-6 h-6 flex-shrink-0 text-foreground self-center" />
          <div className="text-center">
            <h3 className="text-lg text-foreground font-medium">
              Table {tableNumber}
            </h3>
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
