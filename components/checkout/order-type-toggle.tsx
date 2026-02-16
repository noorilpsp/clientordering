'use client';

interface OrderTypeToggleProps {
  value: "dine-in" | "pickup";
  onChange: (type: "dine-in" | "pickup") => void;
}

export function OrderTypeToggle({ value, onChange }: OrderTypeToggleProps) {
  return (
    <div className="py-3 flex justify-center">
      <div className="flex rounded-full bg-secondary p-1 w-full max-w-xs border border-border/50">
        <button
          type="button"
          onClick={() => onChange("dine-in")}
          className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-all ${
            value === "dine-in"
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Dine-in
        </button>
        <button
          type="button"
          onClick={() => onChange("pickup")}
          className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-all ${
            value === "pickup"
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Pickup
        </button>
      </div>
    </div>
  );
}
