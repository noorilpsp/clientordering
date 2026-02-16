"use client";

import { FilterType, Order } from "@/lib/kds-types";
import { cn } from "@/lib/utils";

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  orders: Order[];
}

const filters: { type: FilterType; label: string; icon: string }[] = [
  { type: "all", label: "All", icon: "" },
  { type: "dine_in", label: "Dine-in", icon: "🍽️" },
  { type: "pickup", label: "Pickup", icon: "🥡" },
  { type: "priority", label: "Priority", icon: "⭐" },
];

export function FilterTabs({ activeFilter, onFilterChange, orders }: FilterTabsProps) {
  const getCount = (filter: FilterType) => {
    if (filter === "all") return orders.length;
    if (filter === "priority") return orders.filter(o => o.isPriority).length;
    return orders.filter(o => o.orderType === filter).length;
  };

  return (
    <div className="flex items-center gap-2 px-6 py-3 bg-background border-b border-border overflow-x-auto scrollbar-hide">
      {filters.map((filter) => {
        const count = getCount(filter.type);
        const isActive = activeFilter === filter.type;

        return (
          <button
            key={filter.type}
            onClick={() => onFilterChange(filter.type)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all",
              "flex items-center gap-2",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {filter.icon && <span>{filter.icon}</span>}
            <span>{filter.label}</span>
            <span className={cn(
              "px-1.5 py-0.5 rounded text-xs",
              isActive ? "bg-primary-foreground/20" : "bg-background/50"
            )}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
