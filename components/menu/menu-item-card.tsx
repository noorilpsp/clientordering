"use client";

import React from "react"

import { useState } from "react";
import Image from "next/image";
import { Plus, Minus, Trash2 } from "lucide-react";
import type { MenuItem } from "@/lib/menu-data";

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  onRemoveFromCart?: (itemId: string) => void;
  onItemClick?: (item: MenuItem) => void;
  quantity?: number;
}

export function MenuItemCard({
  item,
  onAddToCart,
  onRemoveFromCart,
  onItemClick,
  quantity = 0,
}: MenuItemCardProps) {
  const [isPressed, setIsPressed] = useState(false);
  const isSoldOut = item.status === "soldout";
  const isInCart = quantity > 0;

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);
    onAddToCart(item);
  };

  return (
    <div
      onClick={() => onItemClick?.(item)}
      className={`flex gap-4 cursor-pointer group py-1 ${
        isSoldOut ? "opacity-50" : ""
      }`}
    >
      {/* Text Content */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="flex flex-col gap-1.5">
          <h3
            className={`font-semibold text-foreground group-hover:text-primary transition-colors ${
              isSoldOut ? "text-muted-foreground" : ""
            }`}
          >
            {item.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {item.description}
          </p>
          {item.tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {item.tags.map((tag) => {
                let bgColor = "bg-secondary";
                let textColor = "text-secondary-foreground";
                let tagIcon = "";

                if (tag === "Vegetarian") {
                  bgColor = "bg-emerald-950/50";
                  textColor = "text-emerald-400";
                  tagIcon = "V";
                } else if (tag === "Spicy") {
                  bgColor = "bg-red-950/50";
                  textColor = "text-red-400";
                  tagIcon = "S";
                } else if (tag === "Gluten-Free") {
                  bgColor = "bg-sky-950/50";
                  textColor = "text-sky-400";
                  tagIcon = "GF";
                }

                return (
                  <span
                    key={tag}
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${bgColor} ${textColor} border border-border/30`}
                  >
                    {tagIcon && <span className="font-bold text-[10px]">{tagIcon}</span>}
                    {tag}
                  </span>
                );
              })}
            </div>
          )}
          <p className="font-bold text-primary">
            {'\u20AC'}{item.price.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Image with Add/Quantity Controls */}
      <div className="relative shrink-0 h-28 w-28">
        <div className="relative h-full w-full overflow-hidden rounded-xl border border-border/50 shadow-md">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${isSoldOut ? "grayscale" : ""}`}
          />
          {isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
              <span className="text-xs font-bold text-foreground bg-destructive/80 px-2.5 py-1 rounded-full">
                Sold Out
              </span>
            </div>
          )}
          {!isSoldOut && (
            <>
              {!isInCart ? (
                <button
                  type="button"
                  onClick={handleAddClick}
                  className={`absolute bottom-1.5 right-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all z-10 ${
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
                <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 bg-card/95 backdrop-blur-sm rounded-full shadow-lg px-1.5 py-1 z-10 border border-border/50">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromCart?.(item.id);
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
                    onClick={handleAddClick}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
