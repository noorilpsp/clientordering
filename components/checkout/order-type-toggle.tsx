'use client';

interface OrderTypeToggleProps {
  value: "dine-in" | "pickup";
  onChange: (type: "dine-in" | "pickup") => void;
}

export function OrderTypeToggle({ value, onChange }: OrderTypeToggleProps) {
  return (
    <div className="px-4 py-3 border-b border-border bg-card flex justify-center">
      <div className="flex rounded-full bg-gray-100 p-1 w-full max-w-xs">
        <button
          type="button"
          onClick={() => onChange("dine-in")}
          className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${
            value === "dine-in"
              ? "bg-white text-foreground shadow-sm"
              : "text-gray-500 hover:text-foreground"
          }`}
        >
          Dine-in
        </button>
        <button
          type="button"
          onClick={() => onChange("pickup")}
          className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${
            value === "pickup"
              ? "bg-white text-foreground shadow-sm"
              : "text-gray-500 hover:text-foreground"
          }`}
        >
          Pickup
        </button>
      </div>
    </div>
  );
}
