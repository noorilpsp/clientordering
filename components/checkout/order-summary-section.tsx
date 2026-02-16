"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { customizationGroups } from "@/lib/menu-item-modal-data";

interface OrderItem {
  quantity: number;
  name: string;
  variant: string | null;
  price: number;
  selectedOptions?: Record<string, string[]>;
  sauceQuantities?: Record<string, number>;
  specialInstructions?: string;
}

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

interface OrderSummarySectionProps {
  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  expanded: boolean;
  onToggle: () => void;
}

export function OrderSummarySection({
  items,
  itemCount,
  subtotal,
  expanded,
  onToggle,
}: OrderSummarySectionProps) {
  return (
    <div className="mb-5 -mt-1.5">
      <h2 className="text-lg font-bold text-foreground mb-0 font-serif">Order Summary</h2>
      <div className="border-t border-b border-border -mt-2">
        <Button
          variant="ghost"
          className="w-full justify-between px-0 py-4 h-auto text-foreground hover:bg-transparent"
          onClick={onToggle}
        >
          <div className="flex items-center gap-3 flex-1 -ml-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-secondary border border-border/50">
              <img 
                src="/placeholder.jpg" 
                alt="Restaurant" 
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            
            <div className="flex-1 text-left">
              <div className="text-base font-bold text-foreground">
                Order Summary
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">
                {itemCount} item{itemCount !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
          
          <ChevronDown
            className={`w-4 h-4 transition-transform flex-shrink-0 text-muted-foreground ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </Button>

        {expanded && (
          <div className="py-4 space-y-3 border-t border-border">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <div className="flex-1 min-w-0 flex flex-col">
                  <p className="font-semibold text-base text-foreground">
                    {item.quantity}{'\u00D7'} {item.name}
                    {item.variant && ` (${item.variant})`}
                  </p>
                  
                  {(item.selectedOptions || item.sauceQuantities || item.specialInstructions) && (
                    <div className="mt-1 space-y-0.5">
                      {item.selectedOptions && Object.entries(item.selectedOptions).map(([groupId, optionIds]) => {
                        const parts = getCustomizationParts(groupId, optionIds);
                        return parts ? (
                          <p key={groupId} className="text-sm">
                            <span className="text-muted-foreground">{parts.groupName}:</span>
                            <span className="text-foreground/70 ml-1">{parts.optionNames}</span>
                          </p>
                        ) : null;
                      })}
                      {item.sauceQuantities && Object.entries(item.sauceQuantities).map(([sauceId, qty]) => (
                        qty > 0 && (
                          <p key={sauceId} className="text-sm">
                            <span className="text-muted-foreground">Extra Sauce:</span>
                            <span className="text-foreground/70 ml-1">{sauceId} x{qty}</span>
                          </p>
                        )
                      ))}
                      {item.specialInstructions && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Note:</span>
                          <span className="text-foreground/70 ml-1">{item.specialInstructions}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <span className="text-foreground font-medium ml-4 flex-shrink-0">
                  {'\u20AC'}{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-px bg-border mt-4 mb-0" />
    </div>
  );
}
