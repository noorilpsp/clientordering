"use client";

interface PlaceOrderButtonProps {
  total: number;
  isEnabled: boolean;
  onClick: () => void;
}

export function PlaceOrderButton({
  total,
  isEnabled,
  onClick,
}: PlaceOrderButtonProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border p-4">
      <div className="max-w-md mx-auto">
        <button
          type="button"
          className={`w-full rounded-xl py-3.5 font-semibold transition-all ${
            isEnabled
              ? "bg-primary text-primary-foreground hover:opacity-90 shadow-lg glow-amber"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
          disabled={!isEnabled}
          onClick={onClick}
        >
          Place Order {'\u2022'} {'\u20AC'}{total.toFixed(2)}
        </button>
      </div>
    </div>
  );
}
