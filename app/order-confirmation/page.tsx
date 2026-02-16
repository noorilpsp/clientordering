"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { OrderConfirmationHero } from "@/components/order-confirmation/order-confirmation-hero";
import { OrderInfoCard } from "@/components/order-confirmation/order-info-card";
import { OrderStatusTracker } from "@/components/order-confirmation/order-status-tracker";
import { OrderSummaryCard } from "@/components/order-confirmation/order-summary-card";
import { ActionButtons } from "@/components/order-confirmation/action-buttons";
import { StatusToast } from "@/components/order-confirmation/status-toast";

// Mock data
const order = {
  orderNumber: "ORD-1234",
  orderType: "dine_in" as "dine_in" | "pickup",
  tableNumber: "5",
  status: "placed" as "placed" | "confirmed" | "preparing" | "ready",
  estimatedMinutes: 15,
  placedAt: new Date().toISOString(),
};

const restaurant = {
  name: "Pizza Palace",
  address: "123 Main Street, Brussels",
  phone: "+32 123 456 789",
};

const orderStatuses = [
  { id: "placed", label: "Placed", icon: "📝", completed: true, current: true },
  { id: "confirmed", label: "Confirmed", icon: "✅", completed: false, current: false },
  { id: "preparing", label: "Preparing", icon: "👨‍🍳", completed: false, current: false },
  { id: "ready", label: "Ready", icon: "🍽️", completed: false, current: false },
];

const orderSummary = {
  items: [
    { quantity: 1, name: "Margherita (Medium)", price: 16.5 },
    { quantity: 2, name: "Pepperoni (Large)", price: 38.0 },
    { quantity: 1, name: "Coca-Cola", price: 3.5 },
  ],
  total: 72.5,
};

export default function OrderConfirmationPage() {
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [statuses, setStatuses] = useState(orderStatuses);
  const [estimatedTime, setEstimatedTime] = useState(order.estimatedMinutes * 60); // in seconds
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>("Order placed! We've received your order 📝");
  const [showToast, setShowToast] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Trigger confetti on mount
  useEffect(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#22c55e", "#10b981", "#fbbf24", "#f59e0b", "#ef4444"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#22c55e", "#10b981", "#fbbf24", "#f59e0b", "#ef4444"],
      });
    }, 250);
  }, []);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setEstimatedTime((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Update toast message based on current status with fade out/in animation
  useEffect(() => {
    const getToastMessage = () => {
      switch (currentStatus) {
        case "placed":
          return "Order placed! We've received your order 📝";
        case "confirmed":
          return "Order confirmed! Kitchen is on it 👨‍🍳";
        case "preparing":
          return "Your food is being prepared! 🔥";
        case "ready":
          return "Your order is ready! 🎉";
        default:
          return null;
      }
    };

    // If there's already a toast showing, fade it out first
    if (showToast && toastMessage) {
      setShowToast(false);
      // Wait for exit animation (200ms) before showing new toast
      setTimeout(() => {
        const newMessage = getToastMessage();
        setToastMessage(newMessage);
        if (newMessage) {
          // Show new toast after message is set
          setTimeout(() => {
            setShowToast(true);
          }, 50);
        }
      }, 200);
    } else {
      // Initial toast setup or no previous toast
      const newMessage = getToastMessage();
      setToastMessage(newMessage);
      setShowToast(!!newMessage);
    }
  }, [currentStatus]);

  // Simulate status changes
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Placed → Confirmed after 5 seconds
    timers.push(
      setTimeout(() => {
        setCurrentStatus("confirmed");
        setStatuses((prev) =>
          prev.map((s) =>
            s.id === "placed"
              ? { ...s, completed: true, current: false }
              : s.id === "confirmed"
                ? { ...s, completed: true, current: true }
                : s
          )
        );
      }, 5000)
    );

    // Confirmed → Preparing after 10 more seconds (15s total)
    timers.push(
      setTimeout(() => {
        setCurrentStatus("preparing");
        setStatuses((prev) =>
          prev.map((s) =>
            s.id === "confirmed"
              ? { ...s, completed: true, current: false }
              : s.id === "preparing"
                ? { ...s, completed: true, current: true }
                : s
          )
        );
      }, 15000)
    );

    // Preparing → Ready after 10 more seconds (25s total)
    timers.push(
      setTimeout(() => {
        setCurrentStatus("ready");
        setIsReady(true);
        
        // Mini confetti burst for ready status
        const duration = 2000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 20, spread: 180, ticks: 40, zIndex: 0 };

        function randomInRange(min: number, max: number) {
          return Math.random() * (max - min) + min;
        }

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 30 * (timeLeft / duration);

          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.3, 0.7), y: Math.random() - 0.2 },
            colors: ["#22c55e", "#10b981", "#fbbf24", "#f59e0b"],
          });
        }, 200);

        // Vibration on mobile (if supported)
        if (typeof window !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate([100, 50, 100]);
        }

        setStatuses((prev) =>
          prev.map((s) =>
            s.id === "preparing"
              ? { ...s, completed: true, current: false }
              : s.id === "ready"
                ? { ...s, completed: true, current: true }
                : s
          )
        );
      }, 25000)
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const minutes = Math.floor(estimatedTime / 60);
  const seconds = estimatedTime % 60;

  return (
    <div className="w-full min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section with Gradient */}
      <OrderConfirmationHero
        orderNumber={order.orderNumber}
        orderType={order.orderType}
      />

      {/* Main Content */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.4 }}
        className="max-w-md mx-auto px-4 pb-8 -mt-8 relative z-10"
      >
        {/* Order Info Card */}
        <OrderInfoCard
          orderType={order.orderType}
          tableNumber={order.tableNumber}
          restaurant={restaurant}
          minutes={minutes}
          seconds={seconds}
          isReady={isReady}
        />

        {/* Order Status Tracker */}
        <div className="mt-4">
          <OrderStatusTracker statuses={statuses} isReady={isReady} />
          {/* Status Toast */}
          <StatusToast message={toastMessage || ""} isVisible={showToast && !!toastMessage} />
        </div>

        {/* Order Summary */}
        <div className="mt-4">
          <OrderSummaryCard
            items={orderSummary.items}
            total={orderSummary.total}
            expanded={summaryExpanded}
            onToggle={() => setSummaryExpanded(!summaryExpanded)}
          />
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="mt-6 pb-24">
          <ActionButtons
            orderType={order.orderType}
            restaurant={restaurant}
          />
        </div>
      </motion.div>
    </div>
  );
}
