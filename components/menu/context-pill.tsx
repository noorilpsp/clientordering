"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accessibility, Bell, ChevronDown, Edit3, MoonStar, Package, Sparkles, Sun, UserPlus, Wifi, X } from "lucide-react";

type OrderType = "dine-in" | "pickup";
export type ThemePreview = "classic" | "night" | "vivid";
export type Locale = "en" | "nl";

interface ContextPillProps {
  orderType: OrderType;
  tableNumber: string;
  checkRequested: boolean;
  estimatedPickupMinutes?: number;
  sessionMinutes?: number;
  theme?: ThemePreview;
  onThemeChange?: (value: ThemePreview) => void;
  onOrderTypeChange: (value: OrderType) => void;
  onTableNumberChange: (value: string) => void;
  onToast: (message: string, type?: "success" | "warning") => void;
  onCallWaiter?: () => void;
  waiterCooldownSeconds?: number;
  compact?: boolean;
  className?: string;
}

export function ContextPill({
  orderType,
  tableNumber,
  checkRequested,
  estimatedPickupMinutes = 20,
  sessionMinutes = 42,
  theme,
  onThemeChange,
  onOrderTypeChange,
  onTableNumberChange,
  onToast,
  onCallWaiter,
  waiterCooldownSeconds = 0,
  compact = false,
  className,
}: ContextPillProps) {
  const [expanded, setExpanded] = useState(false);
  const [editingTable, setEditingTable] = useState(false);
  const [draftTable, setDraftTable] = useState(tableNumber);
  const [activeTheme, setActiveTheme] = useState<ThemePreview>(theme ?? "classic");
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved === "en" || saved === "nl") setLocale(saved);
  }, []);

  // Keep local state aligned when parent controls the theme.
  useEffect(() => {
    if (theme) setActiveTheme(theme);
  }, [theme]);

  // Initialize from persisted value when no controlled theme is passed.
  useEffect(() => {
    if (theme) return;
    const saved = localStorage.getItem("theme") as ThemePreview | null;
    if (saved && ["classic", "night", "vivid"].includes(saved)) {
      setActiveTheme(saved);
    }
  }, [theme]);

  // Apply theme class to <html> and persist.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "vivid");
    if (activeTheme === "night") root.classList.add("dark");
    else if (activeTheme === "vivid") root.classList.add("vivid");
    localStorage.setItem("theme", activeTheme);
  }, [activeTheme]);

  const handleThemeChange = (nextTheme: ThemePreview) => {
    setActiveTheme(nextTheme);
    onThemeChange?.(nextTheme);
    const label =
      nextTheme === "classic" ? "Light theme" : nextTheme === "night" ? "Dark theme" : "High-contrast theme";
    onToast(`${label} enabled`);
  };

  useEffect(() => {
    setDraftTable(tableNumber);
  }, [tableNumber]);

  const saveTable = () => {
    const cleaned = draftTable.trim().replace(/\D+/g, "");
    if (!cleaned) return;
    onTableNumberChange(cleaned);
    onToast(`Table updated to ${cleaned}`);
    setEditingTable(false);
    setExpanded(false);
  };

  const handleLocaleChange = (next: Locale) => {
    setLocale(next);
    localStorage.setItem("locale", next);
    onToast(next === "en" ? "Language set to English" : "Taal ingesteld op Nederlands");
  };

  const isDineIn = orderType === "dine-in";
  const secondaryLabelClass = "font-normal text-muted-foreground";

  return (
    <div
      className={cn(
        "relative",
        expanded ? "z-[var(--z-popover)]" : "z-[var(--z-hero)]",
        compact ? "inline-block" : "my-3 px-4",
        className
      )}
    >
      {expanded && (
        <button
          type="button"
          aria-label="Close context panel"
          className="fixed inset-0 z-[calc(var(--z-popover)-1)] bg-black/20"
          onClick={() => {
            setExpanded(false);
            setEditingTable(false);
          }}
        />
      )}

      <div
        role="button"
        aria-expanded={expanded}
        tabIndex={0}
        onClick={() => setExpanded((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setExpanded((prev) => !prev);
          }
        }}
        className={cn(
          "relative z-[var(--z-hero)] cursor-pointer rounded-xl border backdrop-blur-md transition-all duration-300 liquid-glass",
          compact && "w-fit",
          expanded
            ? "border-border/60 bg-card/70 shadow-xl shadow-black/30"
            : "border-primary/35 bg-card/80 ring-1 ring-primary/25 shadow-lg shadow-black/25"
        )}
      >
        <div
          className={cn(
            "flex items-center",
            compact
              ? "min-h-9 justify-start gap-0.5 pl-2 pr-0.5 py-1.5"
              : "min-h-11 justify-between px-3 py-2"
          )}
        >
          <div className={cn("min-w-0 flex items-center gap-2", compact && "gap-1.5")}>
            {isDineIn ? (
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="context-dot-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
            ) : (
              <Package className="h-4 w-4 shrink-0 text-amber-300" />
            )}
            <p
              className={cn(
                "truncate text-foreground",
                compact ? "whitespace-nowrap text-xs" : "text-sm"
              )}
            >
              {isDineIn ? (
                <>
                  <span className="font-semibold text-foreground">Table {tableNumber}</span>
                  {checkRequested ? (
                    <span className={secondaryLabelClass}> · Check requested</span>
                  ) : (
                    <span className="font-semibold text-foreground"> · Dine-in</span>
                  )}
                </>
              ) : (
                <>
                  <span className="font-semibold">Pickup</span>
                  <span className="font-normal text-foreground"> · Est. {estimatedPickupMinutes} min</span>
                </>
              )}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={expanded ? "Collapse context" : "Expand context"}
            className={cn(
              "rounded-full hover:bg-accent/70",
              compact ? "h-7" : "h-8",
              expanded
                ? compact
                  ? "-ml-0.5 w-5 text-muted-foreground hover:text-foreground"
                  : "w-8 text-muted-foreground hover:text-foreground"
                : compact
                  ? "-ml-0.5 w-5 text-primary hover:text-primary/80"
                  : "w-8 text-primary hover:text-primary/80"
            )}
            onClick={(event) => {
              event.stopPropagation();
              setExpanded((prev) => !prev);
              if (expanded) setEditingTable(false);
            }}
          >
            {expanded ? (
              <X className="h-4 w-4" />
            ) : (
              <ChevronDown className={cn(compact ? "h-3.5 w-3.5" : "h-4 w-4")} />
            )}
          </Button>
        </div>

      </div>

      {expanded && (
        <div
          className={cn(
            "absolute top-full z-[var(--z-popover)] mt-2 animate-in slide-in-from-top-2 fade-in-0 rounded-xl border border-border/60 bg-card/85 px-3 pb-3 pt-1 shadow-xl shadow-black/35 backdrop-blur-md duration-300 liquid-glass",
            compact ? "right-0 w-[min(92vw,19rem)]" : "left-4 right-4"
          )}
        >
          <div className="pt-1">
            <div className="rounded-lg border border-border/80 bg-background/35 p-2">
              <div className="mb-2 text-xs font-medium text-muted-foreground">Theme</div>
              <div className="grid grid-cols-3 gap-2" role="group" aria-label="Choose theme preview">
                <Button
                  type="button"
                  variant="ghost"
                  aria-label="Select classic theme"
                  aria-pressed={activeTheme === "classic"}
                  className={cn(
                    "h-10 rounded-md border px-2 text-foreground hover:bg-accent/70",
                    activeTheme === "classic"
                      ? "border-primary/60 bg-primary/20 text-primary"
                      : "border-border/80"
                  )}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleThemeChange("classic");
                  }}
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  aria-label="Select night theme"
                  aria-pressed={activeTheme === "night"}
                  className={cn(
                    "h-10 rounded-md border px-2 text-foreground hover:bg-accent/70",
                    activeTheme === "night"
                      ? "border-primary/60 bg-primary/20 text-primary"
                      : "border-border/80"
                  )}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleThemeChange("night");
                  }}
                >
                  <MoonStar className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  aria-label="Select vivid theme"
                  aria-pressed={activeTheme === "vivid"}
                  className={cn(
                    "h-10 rounded-md border px-2 text-foreground hover:bg-accent/70",
                    activeTheme === "vivid"
                      ? "border-primary/60 bg-primary/20 text-primary"
                      : "border-border/80"
                  )}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleThemeChange("vivid");
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              className="mt-1 h-12 w-full justify-start gap-3 rounded-lg px-2 text-foreground hover:bg-accent/70"
              onClick={() => {
                const next = isDineIn ? "pickup" : "dine-in";
                onOrderTypeChange(next);
                onToast(next === "pickup" ? "Switched to Pickup mode" : "Switched to Dine-in mode");
                setExpanded(false);
              }}
            >
              <Package className="h-4 w-4" />
              <span>{isDineIn ? "Switch to Pickup" : "Switch to Dine-in"}</span>
            </Button>

            {isDineIn && (
              <>
                {!editingTable ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-12 w-full justify-start gap-3 rounded-lg px-2 text-foreground hover:bg-accent/70"
                    onClick={() => setEditingTable(true)}
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Change table number</span>
                  </Button>
                ) : (
                  <div className="rounded-lg border border-border/80 bg-background/35 p-2">
                    <div className="mb-2 flex items-center gap-2 text-sm text-foreground">
                      <Edit3 className="h-4 w-4" />
                      <span>Table number</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        aria-label="Table number"
                        inputMode="numeric"
                        autoFocus
                        value={draftTable}
                        onChange={(event) => setDraftTable(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            saveTable();
                          }
                        }}
                        className="h-10 border-input bg-background/80 text-foreground"
                      />
                      <Button
                        type="button"
                        className="h-10 bg-emerald-600 text-white hover:bg-emerald-500"
                        onClick={saveTable}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                )}

                {onCallWaiter && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="mt-1 h-12 w-full justify-start gap-3 rounded-lg px-2 text-foreground hover:bg-accent/70"
                    onClick={(event) => {
                      event.stopPropagation();
                      onCallWaiter();
                      setExpanded(false);
                    }}
                    disabled={waiterCooldownSeconds > 0}
                  >
                    <Bell className="h-4 w-4" />
                    <span>
                      {waiterCooldownSeconds > 0
                        ? `Waiter called (${waiterCooldownSeconds}s cooldown)`
                        : "Call waiter"}
                    </span>
                  </Button>
                )}
              </>
            )}

            <Button
              type="button"
              variant="ghost"
              className="mt-1 h-12 w-full justify-start gap-3 rounded-lg px-2 text-foreground hover:bg-accent/70"
              onClick={(event) => {
                event.stopPropagation();
                onToast("Group order coming soon", "warning");
              }}
            >
              <UserPlus className="h-4 w-4" />
              <span>Group order</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="mt-1 h-12 w-full justify-start gap-3 rounded-lg px-2 text-foreground hover:bg-accent/70"
              onClick={(event) => {
                event.stopPropagation();
                onToast("Dietary & accessibility options coming soon", "warning");
              }}
            >
              <Accessibility className="h-4 w-4" />
              <span>Dietary & accessibility</span>
            </Button>

            <div className="mt-1 rounded-lg border border-border/80 bg-background/35 p-2">
              <div className="mb-2 text-xs font-medium text-muted-foreground">Language</div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-pressed={locale === "en"}
                  className={cn(
                    "flex-1 border",
                    locale === "en" ? "border-primary/60 bg-primary/20 text-primary" : "border-border/80"
                  )}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleLocaleChange("en");
                  }}
                >
                  English
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-pressed={locale === "nl"}
                  className={cn(
                    "flex-1 border",
                    locale === "nl" ? "border-primary/60 bg-primary/20 text-primary" : "border-border/80"
                  )}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleLocaleChange("nl");
                  }}
                >
                  Nederlands
                </Button>
              </div>
            </div>

            {!isDineIn && (
              <div className="mt-1 rounded-lg px-2 py-2 text-sm text-muted-foreground">
                Pickup instructions: ring the bell at the side entrance.
              </div>
            )}

            <div className="mt-1 flex min-h-12 items-center gap-3 rounded-lg px-2 text-muted-foreground">
              <Wifi className="h-4 w-4 shrink-0" />
              <span>You&apos;ve been here {sessionMinutes} min · Connected</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
