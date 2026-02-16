"use client";

interface TotalsSectionProps {
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
}

export function TotalsSection({
  subtotal,
  tax,
  tip,
  total,
}: TotalsSectionProps) {
  return (
    <div className="mb-0 space-y-3">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Subtotal</span>
        <span className="text-foreground font-medium">{'\u20AC'}{subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Tax</span>
        <span className="text-foreground font-medium">{'\u20AC'}{tax.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Tip</span>
        <span className="text-foreground font-medium">{'\u20AC'}{tip.toFixed(2)}</span>
      </div>

      <div className="h-px bg-border my-4" />

      <div className="flex justify-between items-center mb-0">
        <span className="text-lg font-bold text-foreground font-serif">Total</span>
        <span className="text-2xl font-bold text-primary">
          {'\u20AC'}{total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
