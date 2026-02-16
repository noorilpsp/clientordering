"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check } from "lucide-react";

type ButtonState = "default" | "pressed" | "calling" | "cooldown";

interface CallWaiterButtonProps {
  className?: string;
  onCall?: () => Promise<void> | void;
}

export function CallWaiterButton({ className = "", onCall }: CallWaiterButtonProps) {
  const [buttonState, setButtonState] = useState<ButtonState>("default");
  const [cooldownSeconds, setCooldownSeconds] = useState(30);
  const [showToast, setShowToast] = useState(false);
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, []);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonState !== "default") return;

    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setRipplePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }

    setButtonState("pressed");
    await delay(100);
    setButtonState("calling");
    
    const callStartTime = Date.now();
    if (onCall) {
      await onCall();
    } else {
      await delay(800);
    }
    const callDuration = Date.now() - callStartTime;
    const minCallingDuration = 800;
    if (callDuration < minCallingDuration) {
      await delay(minCallingDuration - callDuration);
    }

    setShowToast(true);

    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([50, 30, 50]);
    }

    setTimeout(() => {
      setShowToast(false);
    }, 3000);

    setButtonState("cooldown");
    setCooldownSeconds(30);

    if (cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current);
    }

    cooldownIntervalRef.current = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          if (cooldownIntervalRef.current) {
            clearInterval(cooldownIntervalRef.current);
            cooldownIntervalRef.current = null;
          }
          setButtonState("default");
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatCooldown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const getButtonContent = () => {
    switch (buttonState) {
      case "calling":
        return (
          <>
            <motion.div
              animate={{
                rotate: [0, 15, -15, 10, -10, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: 3,
                ease: "easeInOut",
              }}
            >
              <Bell className="w-4 h-4" />
            </motion.div>
            <span>Calling...</span>
          </>
        );
      case "cooldown":
        return (
          <>
            <Check className="w-4 h-4" />
            <span>Called {'\u00B7'} {formatCooldown(cooldownSeconds)}</span>
          </>
        );
      default:
        return (
          <>
            <Bell className="w-4 h-4" />
            <span>Call Waiter</span>
          </>
        );
    }
  };

  const getButtonStyles = () => {
    switch (buttonState) {
      case "pressed":
        return "bg-primary/80 scale-95";
      case "calling":
        return "bg-primary";
      case "cooldown":
        return "bg-muted cursor-not-allowed text-muted-foreground";
      default:
        return "bg-secondary hover:bg-muted border border-border/50 text-foreground";
    }
  };

  return (
    <>
      <motion.button
        ref={buttonRef}
        onClick={handleClick}
        disabled={buttonState === "cooldown" || buttonState === "calling"}
        className={`h-12 rounded-full font-medium flex items-center justify-center gap-2 relative overflow-hidden transition-colors ${getButtonStyles()} ${className}`}
        animate={{
          scale: buttonState === "pressed" ? 0.95 : 1,
        }}
        transition={{
          duration: 0.1,
          ease: "easeOut",
        }}
        whileTap={buttonState === "default" ? { scale: 0.95 } : {}}
      >
        {/* Ripple Effect */}
        <AnimatePresence>
          {buttonState === "pressed" && (
            <motion.div
              className="absolute rounded-full bg-primary/30"
              initial={{
                width: 0,
                height: 0,
                x: ripplePosition.x,
                y: ripplePosition.y,
                opacity: 0.3,
              }}
              animate={{
                width: 400,
                height: 400,
                x: ripplePosition.x - 200,
                y: ripplePosition.y - 200,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
            />
          )}
        </AnimatePresence>

        {/* Pulsing background for calling state */}
        {buttonState === "calling" && (
          <motion.div
            className="absolute inset-0 bg-primary/50 rounded-full"
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Button Content */}
        <motion.div
          className="relative z-10 flex items-center justify-center gap-2"
          layout
        >
          {getButtonContent()}
        </motion.div>
      </motion.button>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-card rounded-xl shadow-xl border border-primary/20 p-4 glow-amber">
              <div className="flex items-start gap-3">
                <div className="shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    Waiter has been notified
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {"They'll be with you soon"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
