"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TipOption = "none" | "10" | "15" | "20" | "custom";

interface TipSectionProps {
  subtotal: number;
  tipOption: TipOption;
  customTip: string;
  onTipOptionChange: (option: TipOption) => void;
  onCustomTipChange: (value: string) => void;
}

export function TipSection({
  subtotal,
  tipOption,
  customTip,
  onTipOptionChange,
  onCustomTipChange,
}: TipSectionProps) {
  const getTipAmount = (option: TipOption) => {
    if (option === "10") return subtotal * 0.1;
    if (option === "15") return subtotal * 0.15;
    if (option === "20") return subtotal * 0.2;
    return 0;
  };

  return (
    <div className="mb-0">
      <h2 className="text-lg font-bold text-foreground mb-3">Add a Tip</h2>

      <div className="mt-0 space-y-4">
        {/* Percentage Options */}
        <div className="grid grid-cols-3 gap-3">
          {["10", "15", "20"].map((percent) => {
            const amount = getTipAmount(percent as "10" | "15" | "20");
            const isSelected = tipOption === percent;
            return (
              <button
                key={percent}
                type="button"
                onClick={() => {
                  onTipOptionChange(percent as TipOption);
                  onCustomTipChange("");
                }}
                className={`p-4 rounded-lg border-2 transition-colors bg-transparent ${
                  isSelected
                    ? "text-foreground border-foreground"
                    : "text-foreground border-border hover:border-foreground shadow-md"
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium">{percent}%</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    €{amount.toFixed(2)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* None and Custom */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              onTipOptionChange("none");
              onCustomTipChange("");
            }}
            className={`p-4 rounded-lg border-2 transition-colors bg-transparent ${
              tipOption === "none"
                ? "text-foreground border-foreground"
                : "text-foreground border-border hover:border-foreground shadow-md"
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium">None</span>
            </div>
          </button>
          <div className="relative">
            <Input
              type="number"
              placeholder="Custom €"
              value={customTip}
              onChange={(e) => {
                onTipOptionChange("custom");
                onCustomTipChange(e.target.value);
              }}
              className={`h-full ${
                tipOption === "custom"
                  ? "border-foreground border-2"
                  : "border-border border-2"
              }`}
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Thick Separator - Full width */}
      <div className="h-0.5 bg-gray-200 mt-6 mb-6 -mx-4" />
    </div>
  );
}
