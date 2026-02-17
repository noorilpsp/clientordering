"use client";

import React from "react"

import { useState } from "react";
import Image from "next/image";
import { Plus, Minus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
      className={`flex gap-3 cursor-pointer ${
        isSoldOut ? "opacity-60" : ""
      }`}
    >
      {/* Text Content */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="flex flex-col gap-1">
          <h3
            className={`font-semibold text-foreground ${
              isSoldOut ? "text-muted-foreground" : ""
            }`}
          >
            {item.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
          {item.tags.length > 0 && (
            <div className="flex gap-1">
              {item.tags.map((tag) => {
                let bgColor = "bg-gray-100";
                let textColor = "text-gray-700";
                const tagEmoji =
                  tag === "Vegetarian"
                    ? "🌱"
                    : tag === "Spicy"
                      ? "🌶️"
                      : "";

                if (tag === "Vegetarian") {
                  bgColor = "bg-green-100";
                  textColor = "text-green-700";
                } else if (tag === "Spicy") {
                  bgColor = "bg-red-100";
                  textColor = "text-red-700";
                } else if (tag === "Gluten-Free") {
                  bgColor = "bg-blue-100";
                  textColor = "text-blue-700";
                }

                return (
                  <span
                    key={tag}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${bgColor} ${textColor}`}
                  >
                    {tagEmoji}
                    {tag}
                  </span>
                );
              })}
            </div>
          )}
          <p className="font-semibold text-foreground">
            €{item.price.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Image with Add/Quantity Controls */}
      <div className="relative shrink-0 h-28 w-28">
        <div className="relative h-full w-full overflow-hidden rounded-lg flex items-center justify-center">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            fill
            className={`object-cover ${isSoldOut ? "grayscale" : ""}`}
          />
          {isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Badge
                variant="destructive"
                className="text-xs font-semibold"
              >
                Sold Out
              </Badge>
            </div>
          )}
          {!isSoldOut && (
            <>
              {!isInCart ? (
                <button
                  type="button"
                  onClick={handleAddClick}
                  className={`absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-white text-foreground shadow-md hover:bg-gray-100 transition-all ${
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
                <div className="absolute bottom-1 right-1 flex items-center gap-1.5 bg-white rounded-full shadow-md px-2 py-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromCart?.(item.id);
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
                    onClick={handleAddClick}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
