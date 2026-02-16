"use client";

import React from "react"

import { useState, useRef } from "react";
import { Plus, Minus, Trash2, Sparkles } from "lucide-react";
import type { MenuItem, CartItem } from "@/lib/menu-data";

interface FeaturedSectionProps {
  items: MenuItem[];
  cartItems: CartItem[];
  onAddToCart: (item: MenuItem) => void;
  onRemoveFromCart: (itemId: string) => void;
  onItemClick: (item: MenuItem) => void;
}

export function FeaturedSection({
  items,
  cartItems,
  onAddToCart,
  onRemoveFromCart,
  onItemClick,
}: FeaturedSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [pressedItems, setPressedItems] = useState<Set<string>>(new Set());

  const handleAddClick = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    setPressedItems((prev) => new Set(prev).add(item.id));
    setTimeout(() => {
      setPressedItems((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 200);
    onAddToCart(item);
  };

  return (
    <div className="px-4 py-6 mb-2">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="font-serif text-lg font-bold text-foreground">Featured</h2>
      </div>

      {/* Horizontal scrollable container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
      >
        {items.map((item) => {
          const cartItem = cartItems.find((c) => c.id === item.id);
          const quantity = cartItem?.quantity || 0;
          const isPressed = pressedItems.has(item.id);

          return (
            <div
              key={item.id}
              className="flex-shrink-0 w-[calc(45%-6px)] min-w-[140px] snap-start cursor-pointer group"
              onClick={() => onItemClick(item)}
            >
              <div className="relative aspect-square rounded-xl overflow-hidden border border-border/50 shadow-lg">
                {/* Image */}
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                {/* Status Badge */}
                {item.status === "soldout" && (
                  <div className="absolute inset-0 bg-background/70 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-foreground font-semibold text-sm bg-destructive/90 px-3 py-1 rounded-full">Sold Out</span>
                  </div>
                )}

                {/* Add/Quantity buttons */}
                {item.status === "live" && (
                  <div className="absolute bottom-2 right-2 z-10">
                    {!quantity ? (
                      <button
                        type="button"
                        onClick={(e) => handleAddClick(e, item)}
                        className={`flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all ${
                          isPressed ? "scale-125" : "scale-100"
                        }`}
                        style={{
                          transitionDuration: "200ms",
                          transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                        }}
                        aria-label={`Add ${item.name} to cart`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-card/95 backdrop-blur-sm rounded-full shadow-lg px-2 py-1 border border-border/50">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFromCart(item.id);
                          }}
                          className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-secondary transition-colors"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          {quantity === 1 ? (
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          ) : (
                            <Minus className="h-3.5 w-3.5 text-foreground" />
                          )}
                        </button>
                        <span className="text-xs font-bold text-primary w-4 text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleAddClick(e, item)}
                          className={`flex h-6 w-6 items-center justify-center rounded-full hover:bg-secondary transition-all ${
                            isPressed ? "scale-125" : "scale-100"
                          }`}
                          style={{
                            transitionDuration: "200ms",
                            transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                          }}
                          aria-label={`Add more ${item.name}`}
                        >
                          <Plus className="h-3.5 w-3.5 text-foreground" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Item info */}
              <div className="mt-2.5">
                <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {item.description}
                </p>
                <p className="text-sm font-bold text-primary mt-1">
                  {'\u20AC'}{item.price.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
