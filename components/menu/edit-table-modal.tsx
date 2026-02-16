"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EditTableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tableNumber: string;
  onConfirm: (tableNumber: string) => void;
}

export function EditTableModal({
  open,
  onOpenChange,
  tableNumber,
  onConfirm,
}: EditTableModalProps) {
  const [selectedNumber, setSelectedNumber] = useState(tableNumber);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    if (open) {
      setSelectedNumber(tableNumber);
    }
  }, [open, tableNumber]);

  useEffect(() => {
    if (open && scrollContainerRef.current) {
      const selectedNum = parseInt(selectedNumber);
      const itemHeight = 40;
      const containerHeight = 192;
      const centerOffset = containerHeight / 2 - itemHeight / 2;
      const scrollTop = (selectedNum - 1) * itemHeight + 80 - centerOffset;
      isScrollingRef.current = true;
      scrollContainerRef.current.scrollTop = Math.max(0, scrollTop);
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 100);
    }
  }, [open, selectedNumber]);

  const handleScroll = () => {
    if (scrollContainerRef.current && !isScrollingRef.current) {
      const container = scrollContainerRef.current;
      const itemHeight = 40;
      const centerContentPixel = container.scrollTop + 96;
      const itemIndex = Math.round((centerContentPixel - 80 - 20) / itemHeight);
      const tableNum = Math.max(1, Math.min(50, itemIndex + 1));
      setSelectedNumber(String(tableNum));
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedNumber);
    onOpenChange(false);
  };

  const tableNumbers = Array.from({ length: 50 }, (_, i) => String(i + 1));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs bg-card border-border" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="font-serif text-foreground">Select Table Number</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {/* Scrollable Number Picker */}
          <div className="relative h-48">
            {/* Center highlight */}
            <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-10 bg-primary/10 border-y border-primary/20 pointer-events-none z-0 rounded-lg" />
            
            {/* Scrollable container */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide relative z-10"
            >
              <div className="pt-20 pb-20">
                {tableNumbers.map((num) => (
                  <button
                    key={num}
                    onClick={() => setSelectedNumber(num)}
                    className={`w-full h-10 flex items-center justify-center text-lg font-medium snap-center transition-colors relative z-20 ${
                      selectedNumber === num
                        ? "text-primary font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex-row gap-2">
          <Button
            variant="outline"
            className="flex-1 bg-secondary border-border text-foreground hover:bg-muted"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button className="flex-1 bg-primary text-primary-foreground hover:opacity-90" onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
