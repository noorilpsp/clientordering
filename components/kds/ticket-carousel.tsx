"use client";

import { useState, useRef, useEffect } from "react";
import { Order } from "@/lib/kds-types";
import { motion, useMotionValue, useAnimation, PanInfo } from "framer-motion";
import { TicketCard } from "./ticket-card";
import { cn } from "@/lib/utils";

interface TicketCarouselProps {
  orders: Order[];
  focusedIndex: number;
  onIndexChange: (index: number) => void;
  onTicketTap: (order: Order) => void;
  onTicketSwipeUp: (order: Order) => void;
  onTicketLongPress: (order: Order) => void;
  completingOrderId?: string | null;
}

export function TicketCarousel({
  orders,
  focusedIndex,
  onIndexChange,
  onTicketTap,
  onTicketSwipeUp,
  onTicketLongPress,
  completingOrderId,
}: TicketCarouselProps) {
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 50;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    // Calculate how many tickets to move based on velocity and offset
    let ticketsToMove = 0;
    
    if (Math.abs(velocity) > 1000) {
      // Fast flick - move multiple tickets
      ticketsToMove = Math.floor(Math.abs(velocity) / 500);
    } else if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
      // Normal swipe - move one ticket
      ticketsToMove = 1;
    }

    if (ticketsToMove > 0) {
      const direction = offset > 0 || velocity > 0 ? -1 : 1;
      const newIndex = Math.max(0, Math.min(orders.length - 1, focusedIndex + (direction * ticketsToMove)));
      onIndexChange(newIndex);
    } else {
      // Snap back to current position
      controls.start({ x: 0 });
    }
  };

  useEffect(() => {
    // Reset position when focusedIndex changes externally
    x.set(0);
    controls.set({ x: 0 });
  }, [focusedIndex, x, controls]);

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-6xl mb-4"
          >
            👨‍🍳
          </motion.div>
          <div className="text-xl font-semibold mb-2">No orders right now</div>
          <div className="text-muted-foreground">Waiting for new orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[600px] overflow-hidden"
      style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
    >
      <motion.div
        className="relative w-full h-full"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.3}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
      >
        {orders.map((order, index) => {
          const relativeIndex = index - focusedIndex;

          return (
            <TicketCard
              key={order.id}
              order={order}
              index={relativeIndex}
              isFocused={index === focusedIndex}
              onTap={() => !isDragging && onTicketTap(order)}
              onSwipeUp={() => index === focusedIndex && onTicketSwipeUp(order)}
              onLongPress={() => onTicketLongPress(order)}
              isCompleting={completingOrderId === order.id}
            />
          );
        })}
      </motion.div>

      {/* Carousel indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {orders.map((_, index) => (
          <button
            key={index}
            onClick={() => onIndexChange(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === focusedIndex
                ? "w-6 bg-primary"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
          />
        ))}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-sm text-muted-foreground text-center z-20">
        ← Swipe to spin · Tap to open · Swipe ↑ = Ready
      </div>
    </div>
  );
}
