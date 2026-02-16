"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface CompletionToastProps {
  isVisible: boolean;
  orderNumber: string | null;
  onUndo: () => void;
}

export function CompletionToast({ isVisible, orderNumber, onUndo }: CompletionToastProps) {
  return (
    <AnimatePresence>
      {isVisible && orderNumber && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-background border border-border rounded-lg shadow-2xl px-6 py-4 flex items-center gap-4 min-w-[300px]">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-semibold">Order #{orderNumber} ready!</div>
            </div>
            <Button
              onClick={onUndo}
              variant="outline"
              size="sm"
              className="flex-shrink-0"
            >
              UNDO
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
