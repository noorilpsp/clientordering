"use client";

import React from "react"

import { useState, useRef } from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
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
      <h2 className="text-lg font-bold text-foreground mb-4">✨ Featured</h2>

      {/* Horizontal scrollable container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
      >
        {items.map((item) => {
          const cartItem = cartItems.find((c) => c.id === item.id);
          const quantity = cartItem?.quantity || 0;
          const isPressed = pressedItems.has(item.id);

          return (
            <div
              key={item.id}
              className="flex-shrink-0 w-[calc(40%-4px)] min-w-[120px] snap-start"
              onClick={() => onItemClick(item)}
            >
              <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
                {/* Image */}
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />

                {/* Status Badge */}
                {item.status === "soldout" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold">Sold Out</span>
                  </div>
                )}

                {/* Add/Quantity buttons */}
                {item.status === "live" && (
                  <div className="absolute bottom-1 right-1 z-10">
                    {!quantity ? (
                      <button
                        type="button"
                        onClick={(e) => handleAddClick(e, item)}
                        className={`flex h-9 w-9 items-center justify-center rounded-full bg-white text-foreground shadow-md hover:bg-gray-100 transition-all z-10 ${
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
                      <div className="flex items-center gap-2 bg-white rounded-full shadow-md px-2 py-1 z-10">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFromCart(item.id);
                          }}
                          className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          {quantity === 1 ? (
                            <Trash2 className="h-4 w-4 text-foreground" />
                          ) : (
                            <Minus className="h-4 w-4 text-foreground" />
                          )}
                        </button>
                        <span className="text-xs font-semibold text-foreground w-4 text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleAddClick(e, item)}
                          className={`flex h-6 w-6 items-center justify-center rounded-full hover:bg-gray-100 transition-all ${
                            isPressed ? "scale-125" : "scale-100"
                          }`}
                          style={{
                            transitionDuration: "200ms",
                            transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                          }}
                          aria-label={`Add more ${item.name}`}
                        >
                          <Plus className="h-4 w-4 text-foreground" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Item info */}
              <div className="mt-2">
                <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {item.description}
                </p>
                <p className="text-sm font-semibold text-foreground mt-1">
                  €{item.price.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
