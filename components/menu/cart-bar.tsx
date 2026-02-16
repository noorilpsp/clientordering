"use client";

import React from "react";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, X, Trash2, Minus, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";
import type { CartItem, MenuItem } from "@/lib/menu-data";
import { restaurant } from "@/lib/menu-data";
import { customizationGroups } from "@/lib/menu-item-modal-data";

interface CartBarProps {
  items: CartItem[];
  total: number;
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  onRemoveFromCart: (itemId: string) => void;
  onItemClick: (item: CartItem, menuItem: MenuItem) => void;
}

// Helper function to get customization display parts
function getCustomizationParts(groupId: string, optionIds: string[]): { groupName: string; optionNames: string } | null {
  const group = customizationGroups.find((g) => g.id === groupId);
  if (!group) return null;

  const optionNames = optionIds
    .map((optId) => {
      const option = group.options.find((o) => o.id === optId);
      return option?.name || optId;
    })
    .join(", ");

  return { groupName: group.name, optionNames };
}

// Helper function to get customization text
function getCustomizationText(groupId: string, optionIds: string[]): string | null {
  const parts = getCustomizationParts(groupId, optionIds);
  return parts ? `${parts.groupName}: ${parts.optionNames}` : null;
}

export function CartBar({
  items,
  total,
  menuItems,
  onAddToCart,
  onRemoveFromCart,
  onItemClick,
}: CartBarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [swipedItemId, setSwipedItemId] = useState<string | null>(null);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = total;
  const tax = Math.round(subtotal * 0.1 * 100) / 100;
  const cartTotal = subtotal + tax;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;

    // Only allow drag-to-close if content is at or near the top (within 5px)
    const isScrolledToTop = scrollRef.current ? scrollRef.current.scrollTop <= 5 : true;

    if (diff > 0 && isScrolledToTop) {
      e.preventDefault();
      setDragY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (dragY > 100) {
      setDragY(0);
      setIsOpen(false);
    } else {
      setDragY(0);
    }
  };

  // Handle item swipe to delete
  const handleItemTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleItemTouchEnd = (e: React.TouchEvent, itemId: string) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    // Swipe left (diff > 50) to show delete
    if (diff > 50) {
      setSwipedItemId(itemId);
    } else if (diff < -50) {
      // Swipe right to hide delete
      setSwipedItemId(null);
    }
  };

  if (items.length === 0) {
    return (
      <>
        {/* Floating Cart Button */}
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-full bg-black p-4 text-white shadow-lg hover:bg-gray-900 transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span className="font-semibold">View Cart</span>
            </div>
            <span className="font-semibold">Empty</span>
          </button>
        </div>

        {/* Empty Cart Modal */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="bottom" className="rounded-t-2xl max-h-[90vh] overflow-y-auto px-4">
            <SheetHeader className="flex flex-row items-center justify-between pb-4 px-0">
              <ShoppingCart className="h-6 w-6 text-foreground" />
              <h2 className="text-xl font-bold flex-1 text-center">Your Cart</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-6 w-6" />
              </button>
            </SheetHeader>

            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="text-5xl">🍽️</div>
              <p className="text-lg font-semibold text-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Browse the menu to add items</p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-8 rounded-lg bg-black text-white py-3 font-semibold hover:bg-gray-900 transition-colors"
            >
              Browse Menu
            </button>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <>
      {/* Floating Cart Button */}
      <div className="fixed bottom-4 left-4 right-4 z-50">
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-full bg-black p-4 text-white shadow-lg hover:bg-gray-900 transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <span className="font-semibold">View Cart</span>
            <span className="font-semibold">
              <span className="text-xl">·</span> {itemCount}
            </span>
          </div>
          <span className="font-bold text-lg">€{cartTotal.toFixed(2)}</span>
        </button>
      </div>

      {/* Cart Bottom Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
          ref={scrollRef}
          side="bottom" 
          className="rounded-t-2xl max-h-[95vh] overflow-y-auto px-4 flex flex-col [&>button]:hidden"
          style={{
            transform: `translateY(${dragY}px)`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div>
            {/* Header */}
            <SheetHeader className="flex flex-row items-center justify-between pb-4 px-0">
              <ShoppingCart className="h-6 w-6 text-foreground" />
              <h2 className="text-xl font-bold flex-1 text-center">Your Cart</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-6 w-6" />
              </button>
            </SheetHeader>

            {/* Restaurant Name */}
            <p className="text-sm font-semibold text-foreground mb-4">{restaurant.name}</p>

            {/* Cart Items */}
            <div className="flex-1 space-y-4 overflow-y-auto py-2 mb-4">
              {items.map((cartItem) => {
                const menuItem = menuItems.find((m) => m.id === cartItem.id);
                if (!menuItem) return null;

                return (
                  <div
                    key={cartItem.id}
                    className="relative overflow-hidden pb-6 border-b last:border-b-0"
                    onTouchStart={handleItemTouchStart}
                    onTouchEnd={(e) => handleItemTouchEnd(e, cartItem.id)}
                  >
                    {/* Item Content */}
                    <div
                      className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        onItemClick(cartItem, menuItem);
                        setIsOpen(false);
                      }}
                    >
                      {/* Item Image */}
                      <img
                        src={menuItem.image || "/placeholder.svg"}
                        alt={menuItem.name}
                        className="h-16 w-16 rounded object-cover flex-shrink-0"
                      />

                      {/* Item Details */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <p className="font-semibold text-base text-foreground">
                          {menuItem.name}
                        </p>
                        
                        {/* Customizations */}
                        {(cartItem.selectedOptions || cartItem.sauceQuantities || cartItem.specialInstructions) && (
                          <div className="mt-1 space-y-1">
                            {cartItem.selectedOptions && Object.entries(cartItem.selectedOptions).map(([groupId, optionIds]) => {
                              const parts = getCustomizationParts(groupId, optionIds);
                              return parts ? (
                                <p key={groupId} className="text-sm">
                                  <span className="text-gray-700">{parts.groupName}:</span>
                                  <span className="text-gray-500 ml-1">{parts.optionNames}</span>
                                </p>
                              ) : null;
                            })}
                            {cartItem.sauceQuantities && Object.entries(cartItem.sauceQuantities).map(([sauceId, qty]) => (
                              qty > 0 && (
                                <p key={sauceId} className="text-sm">
                                  <span className="text-gray-700">Extra Sauce:</span>
                                  <span className="text-gray-500 ml-1">{sauceId} x{qty}</span>
                                </p>
                              )
                            ))}
                            {cartItem.specialInstructions && (
                              <p className="text-sm">
                                <span className="text-gray-700">Special Instructions:</span>
                                <span className="text-gray-500 ml-1">{cartItem.specialInstructions}</span>
                              </p>
                            )}
                          </div>
                        )}

                        <p className="text-sm font-medium text-muted-foreground mt-1">
                          €{menuItem.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div
                        className="flex items-center gap-1 bg-gray-100 rounded-full px-1.5 py-1 flex-shrink-0 h-fit"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setItemToDelete(cartItem.id);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                        >
                          {cartItem.quantity === 1 ? (
                            <Trash2 className="h-4 w-4 text-foreground" />
                          ) : (
                            <Minus className="h-4 w-4 text-foreground" />
                          )}
                        </button>
                        <span className="text-xs font-semibold text-foreground w-4 text-center">
                          {cartItem.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(menuItem);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <Plus className="h-4 w-4 text-foreground" />
                        </button>
                      </div>
                    </div>

                    {/* Delete Action Bar - Overlaps quantity controls only */}
                    {swipedItemId === cartItem.id && (
                      <div className="absolute inset-y-0 right-0 bg-red-600 flex items-center justify-center w-32">
                        <button
                          type="button"
                          onClick={() => {
                            setItemToDelete(cartItem.id);
                            setSwipedItemId(null);
                          }}
                          className="text-white font-semibold text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sticky Totals Section */}
            <div className="sticky bottom-0 bg-background border-t pt-4 space-y-3 pb-6">
              <div className="flex justify-between">
                <span className="text-base font-bold text-foreground">Subtotal</span>
                <span className="text-lg font-bold text-foreground">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base font-bold text-foreground">Tax</span>
                <span className="text-lg font-bold text-foreground">€{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base font-bold text-foreground">Total</span>
                <span className="text-lg font-bold text-foreground">€{cartTotal.toFixed(2)}</span>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                className="w-full mt-2 rounded-lg bg-black text-white py-3 font-semibold hover:bg-gray-900 transition-colors"
                onClick={() => {
                  setIsOpen(false);
                  router.push("/checkout");
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Sheet */}
      <Sheet open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <SheetContent side="bottom" className="rounded-t-2xl px-4 [&>button]:hidden">
          <div className="py-4">
            {(() => {
              const itemBeingDeleted = items.find((item) => item.id === itemToDelete);
              const itemName = itemBeingDeleted?.name || "Item";
              return (
                <>
                  <h3 className="text-lg font-bold text-foreground mb-2">Remove Item?</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Are you sure you want to remove <span className="font-semibold text-foreground">{itemName}</span> from your cart?
                  </p>
                </>
              );
            })()}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="flex-1 rounded-lg border border-gray-300 text-foreground py-3 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (itemToDelete) {
                    onRemoveFromCart(itemToDelete);
                    setItemToDelete(null);
                  }
                }}
                className="flex-1 rounded-lg bg-red-600 text-white py-3 font-semibold hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
