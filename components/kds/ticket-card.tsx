"use client";

import { Order } from "@/lib/kds-types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TicketCardProps {
  order: Order;
  index: number;
  isFocused: boolean;
  onTap?: () => void;
  onSwipeUp?: () => void;
  onLongPress?: () => void;
  isCompleting?: boolean;
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

const getUrgencyLevel = (seconds: number) => {
  if (seconds < 300) return "normal"; // 0-5 min
  if (seconds < 600) return "warning"; // 5-10 min
  return "urgent"; // 10+ min
};

export function TicketCard({ 
  order, 
  index, 
  isFocused, 
  onTap, 
  onSwipeUp,
  onLongPress,
  isCompleting = false
}: TicketCardProps) {
  const urgency = getUrgencyLevel(order.waitTime);
  const readyCount = order.items.filter(item => item.isReady).length;
  const totalItems = order.items.length;

  // Calculate carousel position offset
  const offset = index;
  const scale = isFocused ? 1 : Math.max(0.65, 1 - Math.abs(offset) * 0.2);
  const opacity = isFocused ? 1 : Math.max(0.3, 1 - Math.abs(offset) * 0.35);
  const rotateY = offset * 20;
  const zIndex = 10 - Math.abs(offset);
  const xPosition = offset * 120;

  return (
    <motion.div
      className={cn(
        "absolute w-64 h-96 cursor-pointer top-1/2 left-1/2",
        "bg-white dark:bg-gray-800 rounded-lg shadow-2xl",
        "border-2 border-gray-200 dark:border-gray-700",
        urgency === "urgent" && "border-red-500 dark:border-red-600",
        urgency === "warning" && "border-yellow-500 dark:border-yellow-600",
        order.claimedBy && "ring-2 ring-blue-500 dark:ring-blue-400 ring-offset-2"
      )}
      style={{
        x: xPosition,
        y: "-50%",
        scale,
        opacity,
        rotateY,
        zIndex,
        transformStyle: "preserve-3d",
      }}
      animate={
        isCompleting
          ? {
              y: "-150%",
              scale: 1.2,
              opacity: 0,
              rotateY: 0,
            }
          : {
              x: xPosition,
              scale,
              opacity,
              rotateY,
            }
      }
      transition={
        isCompleting
          ? {
              duration: 0.4,
              ease: "easeIn",
            }
          : {
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.8,
            }
      }
      onTap={onTap}
      onPanEnd={(e, info) => {
        if (isFocused && info.offset.y < -50 && info.velocity.y < -500) {
          onSwipeUp?.();
        }
      }}
      onLongPressStart={onLongPress}
      whileHover={isFocused ? { scale: 1.05, y: "-50%" } : {}}
      whileTap={isFocused ? { scale: 0.95, y: "-50%" } : {}}
    >
      {/* Urgency glow effect */}
      {urgency === "urgent" && !isCompleting && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-red-500/20 blur-xl -z-10"
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      {urgency === "warning" && !isCompleting && (
        <div className="absolute inset-0 rounded-lg bg-yellow-500/10 blur-xl -z-10" />
      )}

      {/* Completion checkmark */}
      {isCompleting && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
          className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-lg z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 500 }}
            className="text-6xl"
          >
            ✓
          </motion.div>
        </motion.div>
      )}

      {/* Perforated top edge */}
      <div className="absolute top-0 left-0 right-0 h-2 flex items-center justify-center gap-1 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        ))}
      </div>

      {/* Ticket content */}
      <div className="p-4 pt-6 h-full flex flex-col">
        {/* Header: Order type and priority */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl">{getOrderTypeIcon(order.orderType)}</span>
          {order.isPriority && <span className="text-xl">⭐</span>}
        </div>

        {/* Order number */}
        <div className="text-center mb-2">
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">#{order.orderNumber}</div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">═══════</div>
        </div>

        {/* Location */}
        <div className="text-center mb-3">
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {order.tableNumber ? `Table ${order.tableNumber}` : order.customerName}
          </div>
        </div>

        {/* Timer */}
        <div className="text-center mb-3">
          <div className={cn(
            "text-2xl font-bold flex items-center justify-center gap-1",
            urgency === "urgent" && "text-red-600",
            urgency === "warning" && "text-yellow-600"
          )}>
            <span>⏱️</span>
            <span>{formatTime(order.waitTime)}</span>
          </div>
        </div>

        {/* Item progress dots */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {order.items.map((item, idx) => (
            <div
              key={item.id}
              className={cn(
                "w-3 h-3 rounded-full",
                item.isReady ? "bg-green-500" : "bg-gray-300"
              )}
            />
          ))}
        </div>

        {/* Claimed by */}
        {order.claimedBy && (
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-auto">
            <span className="text-base">👨‍🍳</span> {order.claimedBy}
          </div>
        )}

        {/* Spacer if not claimed */}
        {!order.claimedBy && <div className="mt-auto" />}
      </div>

      {/* Paper shadow */}
      <div className="absolute -bottom-2 left-2 right-2 h-2 bg-gray-200/50 dark:bg-gray-700/50 rounded-lg blur-sm" />
    </motion.div>
  );
}
