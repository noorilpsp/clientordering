"use client";

import { useState, useEffect, useCallback } from "react";
import { Order, FilterType, ToastState } from "@/lib/kds-types";
import { staff, initialStats, initialOrders } from "@/lib/kds-data";
import { HeaderBar } from "@/components/kds/header-bar";
import { StatsBar } from "@/components/kds/stats-bar";
import { FilterTabs } from "@/components/kds/filter-tabs";
import { TicketCarousel } from "@/components/kds/ticket-carousel";
import { TicketDetailView } from "@/components/kds/ticket-detail-view";
import { CompletionToast } from "@/components/kds/completion-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function KDSPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [stats, setStats] = useState(initialStats);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>({ isVisible: false, orderNumber: null });
  const [isConnected, setIsConnected] = useState(true);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  const [completingOrderId, setCompletingOrderId] = useState<string | null>(null);

  // Filter orders based on active filter
  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "priority") return order.isPriority;
    return order.orderType === activeFilter;
  });

  // Update timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prev) =>
        prev.map((order) => ({
          ...order,
          waitTime: order.waitTime + 1,
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-advance carousel when order is completed
  useEffect(() => {
    if (completedOrderId && filteredOrders.length > 0) {
      const currentIndex = filteredOrders.findIndex((o) => o.id === completedOrderId);
      if (currentIndex >= 0) {
        const nextIndex = currentIndex < filteredOrders.length - 1 ? currentIndex : Math.max(0, filteredOrders.length - 2);
        setTimeout(() => {
          setFocusedIndex(nextIndex);
          setCompletedOrderId(null);
        }, 500);
      }
    }
  }, [completedOrderId, filteredOrders]);

  // Handle filter change - reset focused index
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setFocusedIndex(0);
  };

  // Handle ticket tap - open detail view
  const handleTicketTap = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  // Handle swipe up - mark order ready
  const handleTicketSwipeUp = (order: Order) => {
    markOrderReady(order.id);
  };

  // Handle long press - claim order
  const handleTicketLongPress = (order: Order) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? { ...o, claimedBy: o.claimedBy === staff.name ? null : staff.name }
          : o
      )
    );
  };

  // Mark order as ready
  const markOrderReady = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    // Store order for potential undo
    setCompletedOrder(order);

    // Start completion animation
    setCompletingOrderId(orderId);

    // After animation, remove order and update stats
    setTimeout(() => {
      setCompletingOrderId(null);
      setCompletedOrderId(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setStats((prev) => ({
        ...prev,
        active: prev.active - 1,
        completedToday: prev.completedToday + 1,
        streak: prev.streak + 1,
      }));
      setToast({ isVisible: true, orderNumber: order.orderNumber });
      setIsDetailOpen(false);
      setSelectedOrder(null);

      // Auto-hide toast after 5 seconds
      setTimeout(() => {
        setToast((prev) => {
          if (prev.isVisible) {
            // Clear completed order if toast auto-hides
            setCompletedOrder(null);
          }
          return { ...prev, isVisible: false };
        });
      }, 5000);
    }, 400); // Match animation duration
  };

  // Store completed order for undo
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Handle undo
  const handleUndo = () => {
    if (!toast.orderNumber || !completedOrder) return;

    setOrders((prev) => [...prev, completedOrder]);
    setStats((prev) => ({
      ...prev,
      active: prev.active + 1,
      completedToday: prev.completedToday - 1,
      streak: Math.max(0, prev.streak - 1),
    }));

    setToast({ isVisible: false, orderNumber: null });
    setCompletedOrderId(null);
    setCompletedOrder(null);
  };

  // Handle item toggle
  const handleItemToggle = (orderId: string, itemId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item) =>
                item.id === itemId ? { ...item, isReady: !item.isReady } : item
              ),
            }
          : order
      )
    );

    // Update selected order if detail view is open
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          items: prev.items.map((item) =>
            item.id === itemId ? { ...item, isReady: !item.isReady } : item
          ),
        };
      });
    }
  };

  // Handle mark all ready
  const handleMarkAllReady = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item) => ({ ...item, isReady: true })),
            }
          : order
      )
    );

    // Update selected order
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        items: selectedOrder.items.map((item) => ({ ...item, isReady: true })),
      });
    }

    // Mark as ready
    markOrderReady(orderId);
  };

  // Ensure focused index is within bounds
  const safeFocusedIndex = Math.min(focusedIndex, Math.max(0, filteredOrders.length - 1));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeaderBar staff={staff} isConnected={isConnected} />
      <StatsBar stats={stats} />
      <FilterTabs
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        orders={orders}
      />

      <div className="flex-1 relative">
        <TicketCarousel
          orders={filteredOrders}
          focusedIndex={safeFocusedIndex}
          onIndexChange={setFocusedIndex}
          onTicketTap={handleTicketTap}
          onTicketSwipeUp={handleTicketSwipeUp}
          onTicketLongPress={handleTicketLongPress}
          completingOrderId={completingOrderId}
        />
      </div>

      <TicketDetailView
        order={selectedOrder}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedOrder(null);
        }}
        onItemToggle={handleItemToggle}
        onMarkAllReady={handleMarkAllReady}
      />

      <CompletionToast
        isVisible={toast.isVisible}
        orderNumber={toast.orderNumber}
        onUndo={handleUndo}
      />
    </div>
  );
}
