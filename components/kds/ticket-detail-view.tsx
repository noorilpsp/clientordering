"use client";

import { Order, OrderItem } from "@/lib/kds-types";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface TicketDetailViewProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onItemToggle: (orderId: string, itemId: string) => void;
  onMarkAllReady: (orderId: string) => void;
}

const getOrderTypeIcon = (type: string) => {
  switch (type) {
    case "dine_in": return "🍽️";
    case "pickup": return "🥡";
    case "delivery": return "🚗";
    default: return "🍽️";
  }
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export function TicketDetailView({
  order,
  isOpen,
  onClose,
  onItemToggle,
  onMarkAllReady,
}: TicketDetailViewProps) {
  if (!order) return null;

  const readyCount = order.items.filter(item => item.isReady).length;
  const totalItems = order.items.length;
  const allReady = readyCount === totalItems;
  const progress = totalItems > 0 ? (readyCount / totalItems) * 100 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Detail View */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-background rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
                <span>Back to carousel</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Order Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-4xl font-bold mb-2">#{order.orderNumber}</div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="text-xl">{getOrderTypeIcon(order.orderType)}</span>
                    <span>
                      {order.orderType === "dine_in" ? "Dine-in" : 
                       order.orderType === "pickup" ? "Pickup" : "Delivery"}
                    </span>
                    {order.tableNumber && <span>· Table {order.tableNumber}</span>}
                    {order.guestCount && <span>· 👥 {order.guestCount} guests</span>}
                  </div>
                </div>
                <div className="text-3xl font-bold">
                  ⏱️ {formatTime(order.waitTime)}
                </div>
              </div>

              {/* Items List */}
              <div className="bg-muted/30 rounded-lg p-6 mb-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <motion.div
                      key={item.id}
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-lg transition-colors cursor-pointer",
                        item.isReady && "bg-green-500/10"
                      )}
                      onClick={() => onItemToggle(order.id, item.id)}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Checkbox
                        checked={item.isReady}
                        onCheckedChange={() => onItemToggle(order.id, item.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {item.quantity}× {item.name}
                          </span>
                          {item.variant && (
                            <span className="text-sm text-muted-foreground">
                              ({item.variant})
                            </span>
                          )}
                        </div>
                        {item.customizations.length > 0 && (
                          <div className="mt-1 space-y-1">
                            {item.customizations.map((custom, idx) => (
                              <div key={idx} className="text-sm text-muted-foreground ml-6">
                                + {custom}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {readyCount}/{totalItems} items
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Special Instructions */}
              {order.specialInstructions && (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-900">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">📝</span>
                    <div>
                      <div className="text-sm font-medium mb-1">Special Instructions</div>
                      <div className="text-sm text-muted-foreground">
                        {order.specialInstructions}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Complete Button */}
              <div className="mt-auto">
                <Button
                  onClick={() => onMarkAllReady(order.id)}
                  className={cn(
                    "w-full h-14 text-lg font-semibold",
                    allReady
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-primary hover:bg-primary/90"
                  )}
                  size="lg"
                >
                  {allReady ? "✓ ALL READY" : "MARK ALL READY"}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
