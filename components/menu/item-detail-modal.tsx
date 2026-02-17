"use client";

import React from "react";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Minus, Plus, GripHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  menuItemModalData,
  customizationGroups,
  type CustomizationGroup,
} from "@/lib/menu-item-modal-data";

interface ItemDetailModalProps {
  item: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (item: any) => void;
}

export function ItemDetailModal({
  item,
  open,
  onOpenChange,
  onAddToCart,
}: ItemDetailModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string[]>
  >({});
  const [sauceQuantities, setSauceQuantities] = useState<Record<string, number>>({});
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [dragY, setDragY] = useState(0);
  const touchStartY = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Initialize with cart item customizations if available
  useEffect(() => {
    if (open && item) {
      setSelectedOptions(item.selectedOptions || {});
      setSauceQuantities(item.sauceQuantities || {});
      setSpecialInstructions(item.specialInstructions || "");
      setQuantity(1);
    }
  }, [open, item]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const sizeSelection = selectedOptions["size"]?.[0];

  // Drag handlers
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
      onOpenChange(false);
    } else {
      setDragY(0);
    }
  };

  // Calculate conditional max selections for toppings
  const effectiveGroups = useMemo(() => {
    return customizationGroups.map((group) => {
      if (group.conditionalQuantities && sizeSelection) {
        const rule = group.conditionalQuantities.rules.find(
          (r) => r.baseOptionId === sizeSelection
        );
        if (rule) {
          return { ...group, maxSelections: rule.maxSelections };
        }
      }
      return group;
    });
  }, [sizeSelection]);

  // Calculate conditional prices for options
  const getOptionPrice = (
    groupId: string,
    optionId: string,
    option: any
  ): number => {
    if (option.conditionalPrices && sizeSelection) {
      const conditionalPrice = option.conditionalPrices.prices.find(
        (p: any) => p.baseOptionId === sizeSelection
      );
      if (conditionalPrice) {
        return conditionalPrice.price;
      }
    }
    return option.price;
  };

  // Calculate total price
  const totalPrice = useMemo(() => {
    let basePrice = menuItemModalData.basePrice;

    // Get size price
    if (sizeSelection) {
      const sizeGroup = customizationGroups.find((g) => g.id === "size");
      const sizeOption = sizeGroup?.options.find((o) => o.id === sizeSelection);
      if (sizeOption) {
        basePrice = sizeOption.price;
      }
    }

    let addOnsPrice = 0;
    Object.entries(selectedOptions).forEach(([groupId, optionIds]) => {
      if (groupId === "size") return;
      const group = customizationGroups.find((g) => g.id === groupId);
      if (!group) return;

      optionIds.forEach((optionId) => {
        const option = group.options.find((o) => o.id === optionId);
        if (option) {
          addOnsPrice += getOptionPrice(groupId, optionId, option);
        }
      });
    });

    // Add sauce prices
    Object.entries(sauceQuantities).forEach(([sauceId, qty]) => {
      const sauceGroup = customizationGroups.find((g) => g.id === "sauces");
      const sauce = sauceGroup?.options.find((o) => o.id === sauceId);
      if (sauce) {
        addOnsPrice += sauce.price * qty;
      }
    });

    return (basePrice + addOnsPrice) * quantity;
  }, [selectedOptions, sauceQuantities, sizeSelection, quantity]);

  // Check if required groups are satisfied
  const isValid = useMemo(() => {
    return effectiveGroups.every((group) => {
      if (!group.isRequired) return true;

      // Check if secondary group should be shown
      if (group.isSecondary && group.triggerRule) {
        const isTriggered =
          selectedOptions[group.triggerRule.triggerGroupId]?.[0] ===
          group.triggerRule.triggerOptionId;
        if (!isTriggered) return true;
      }

      const selected = selectedOptions[group.id] || [];
      return selected.length >= group.minSelections;
    });
  }, [effectiveGroups, selectedOptions]);

  const handleSelectOption = (groupId: string, optionId: string) => {
    const group = effectiveGroups.find((g) => g.id === groupId);
    if (!group) return;

    setSelectedOptions((prev) => {
      const current = prev[groupId] || [];
      let updated: string[];

      if (group.maxSelections === 1) {
        // Single select
        updated = [optionId];
      } else {
        // Multi select
        if (current.includes(optionId)) {
          updated = current.filter((id) => id !== optionId);
        } else if (current.length < group.maxSelections) {
          updated = [...current, optionId];
        } else {
          return prev;
        }
      }

      return { ...prev, [groupId]: updated };
    });
  };

  if (!open) return null;

  const handleAddToCart = () => {
    const cartItem = {
      ...item,
      selectedOptions,
      sauceQuantities,
      specialInstructions,
    };
    onAddToCart(cartItem);
    onOpenChange(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={() => onOpenChange(false)}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-end justify-center animate-in slide-in-from-bottom-80 duration-300">
        <div 
          ref={sheetRef}
          className="w-full max-w-md rounded-t-3xl bg-white shadow-2xl h-[98vh] overflow-hidden flex flex-col relative will-change-transform"
          style={{ 
            transform: `translateY(${dragY}px)`,
            transition: dragY > 0 ? "none" : "all 0.3s ease-out",
          }}
        >
          {/* Drag Handle */}
          <div 
            className="flex justify-center pt-3 pb-2 touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex h-1 w-12 rounded-full bg-gray-300" />
          </div>

          {/* Close Button */}
          <div className="absolute right-4 top-4 z-10">
            <button
              onClick={() => onOpenChange(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div 
            ref={scrollRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="flex-1 overflow-y-auto px-4 pb-24"
          >
            {/* Image */}
            <div className="relative h-48 w-full overflow-hidden rounded-lg">
              <Image
                src={item?.image || "/placeholder.svg"}
                alt={item?.name || "Item"}
                fill
                className="object-cover"
              />
            </div>

            {/* Item Info */}
            <div className="mt-4">
              <h1 className="text-2xl font-bold text-foreground">
                {item?.name}
              </h1>

              {/* Price and Tags Row */}
              <div className="mt-2 flex items-center gap-2">
                {/* Base Price */}
                {item?.price && (
                  <p className="text-sm font-semibold text-foreground">
                    €{item.price.toFixed(2)}
                  </p>
                )}

                {/* Tags */}
                {item?.tags && item.tags.length > 0 && (
                  <div className="flex gap-1">
                    {item.tags.map((tag: string) => {
                      let bgColor = "bg-gray-100";
                      let textColor = "text-gray-700";

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
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${bgColor} ${textColor}`}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                {item?.description}
              </p>
            </div>

            {/* Separator */}
            <div className="-mx-4 h-0.5 bg-gray-200 mt-3 mb-3" />

            {/* Customization Groups */}
            <div className="mt-6 space-y-0">
              {effectiveGroups.map((group, index) => {
                // Hide secondary groups if trigger not met
                if (group.isSecondary && group.triggerRule) {
                  const isTriggered =
                    selectedOptions[group.triggerRule.triggerGroupId]?.[0] ===
                    group.triggerRule.triggerOptionId;
                  if (!isTriggered) return null;
                }

                const isMultiSelect = group.maxSelections > 1;
                const selected = selectedOptions[group.id] || [];
                const hasError =
                  group.isRequired && selected.length < group.minSelections;

                // Special rendering for sauces group
                if (group.id === "sauces") {
                  return (
                    <div key={group.id}>
                      <div className="flex items-start justify-between px-0 py-1.5 gap-3">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {group.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Add as many as you want
                          </p>
                        </div>
                        {group.isRequired && (
                          <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 whitespace-nowrap">
                            Required
                          </span>
                        )}
                      </div>

                      <div className="space-y-0">
                        {group.options.map((option, optionIndex) => {
                          const qty = sauceQuantities[option.id] || 0;

                          const addOneSauce = () =>
                            setSauceQuantities((prev) => ({
                              ...prev,
                              [option.id]: (prev[option.id] || 0) + 1,
                            }));

                          return (
                            <div key={option.id}>
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={addOneSauce}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    addOneSauce();
                                  }
                                }}
                                className="flex w-full cursor-pointer items-start justify-between gap-3 px-0 py-3 rounded-lg hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-foreground">
                                    {option.name}
                                  </p>
                                  <p className="mt-0.5 text-xs text-muted-foreground">
                                    +€{option.price.toFixed(2)}
                                  </p>
                                </div>
                                <div
                                  className="flex-shrink-0 flex items-center gap-2"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {qty === 0 ? (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSauceQuantities((prev) => ({
                                          ...prev,
                                          [option.id]: 1,
                                        }));
                                      }}
                                      className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                                    >
                                      +
                                    </button>
                                  ) : qty === 1 ? (
                                    <>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSauceQuantities((prev) => ({
                                            ...prev,
                                            [option.id]: 0,
                                          }));
                                        }}
                                        className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                      <span className="w-7 text-center text-sm font-semibold">
                                        {qty}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          addOneSauce();
                                        }}
                                        className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                                      >
                                        +
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSauceQuantities((prev) => ({
                                            ...prev,
                                            [option.id]: Math.max(0, (prev[option.id] || 0) - 1),
                                          }));
                                        }}
                                        className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300"
                                      >
                                        −
                                      </button>
                                      <span className="w-7 text-center text-sm font-semibold">
                                        {qty}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          addOneSauce();
                                        }}
                                        className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                                      >
                                        +
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                              {optionIndex < group.options.length - 1 && (
                                <div className="h-px bg-gray-200" />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {index < effectiveGroups.length - 1 && (
                        <div className="-mx-4 h-0.5 bg-gray-200 mt-3 mb-3" />
                      )}
                    </div>
                  );
                }

                return (
                  <div key={group.id}>
                    <div className="flex items-start justify-between px-0 py-1.5 gap-3">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {group.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {group.customerInstructions &&
                            `${group.customerInstructions} • `}
                          {group.maxSelections === 1
                            ? "Select 1"
                            : `Select ${group.minSelections === group.maxSelections ? `${group.minSelections}` : `up to ${group.maxSelections}`}`}
                        </p>
                      </div>
                      {group.isRequired && (
                        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 whitespace-nowrap">
                          Required
                        </span>
                      )}
                    </div>

                    <div className={`space-y-0 ${hasError ? "text-red-600" : ""}`}>
                      {group.options.map((option, optionIndex) => {
                        const isSelected = selected.includes(option.id);
                        const isMaxReached = selected.length >= group.maxSelections && isMultiSelect;
                        const isDisabled = !isSelected && isMaxReached;
                        const optionPrice = getOptionPrice(
                          group.id,
                          option.id,
                          option
                        );
                        const displayPrice =
                          optionPrice === 0
                            ? "Included"
                            : `+€${optionPrice.toFixed(2)}`;

                        return (
                          <div key={option.id}>
                            <button
                              onClick={() => handleSelectOption(group.id, option.id)}
                              disabled={isDisabled}
                              className={`flex w-full items-start justify-between gap-3 px-0 py-3 text-left ${
                                isDisabled ? "opacity-40 cursor-not-allowed" : ""
                              }`}
                            >
                              <div className="flex-1">
                                <p className={`text-sm font-medium ${isDisabled ? "text-gray-400" : "text-foreground"}`}>
                                  {option.name}
                                </p>
                                <p className={`mt-0.5 text-xs ${isDisabled ? "text-gray-300" : "text-muted-foreground"}`}>
                                  {displayPrice}
                                </p>
                              </div>
                              <div className="flex-shrink-0 mt-1">
                                {isMultiSelect ? (
                                  <div
                                    className={`h-5 w-5 rounded border-2 flex items-center justify-center ${
                                      isSelected
                                        ? "border-blue-600 bg-blue-600"
                                        : isDisabled
                                        ? "border-gray-300 bg-gray-100"
                                        : "border-gray-300 bg-white"
                                    }`}
                                  >
                                    {isSelected && (
                                      <svg
                                        className="h-full w-full text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={3}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                ) : (
                                  <div
                                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                                      isSelected
                                        ? "border-blue-600 bg-blue-600"
                                        : "border-gray-300 bg-white"
                                    }`}
                                  >
                                    {isSelected && (
                                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </button>
                            {optionIndex < group.options.length - 1 && (
                              <div className="h-px bg-gray-200" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Separator between groups */}
                    {index < effectiveGroups.length - 1 && (
                      <div className="-mx-4 h-0.5 bg-gray-200 mt-3 mb-3" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Separator */}
            <div className="-mx-4 h-0.5 bg-gray-200 mt-3 mb-3" />

            {/* Special Instructions */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-foreground">
                Special Instructions
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="E.g., no onions, extra crispy..."
                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                rows={3}
              />
            </div>

            {/* Quantity Selector */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-lg font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button - Sticky */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-4 py-4">
            <Button
              onClick={handleAddToCart}
              disabled={!isValid}
              className="w-full rounded-full bg-black py-6 text-white disabled:bg-gray-300"
            >
              Add to Cart — €{totalPrice.toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
