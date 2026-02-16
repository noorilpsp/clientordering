"use client";

import { useState, useRef } from "react";
import { Clock, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { WalkingPersonLottie } from "@/components/ui/walking-person-lottie";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface PickupSectionProps {
  restaurant: {
    name: string;
    address: string;
    distance: string;
  };
  timeMode: "standard" | "schedule";
  selectedDay: string;
  selectedTime: string;
  onTimeChange: () => void;
  onScheduleClick: () => void;
  days: Array<{ label: string; date: string; value: string }>;
  onDayChange: (day: string) => void;
  onTimeSelect: (time: string) => void;
  timeSlots: string[];
  isScheduleOpen: boolean;
  onScheduleClose: () => void;
}

export function PickupSection({
  restaurant,
  timeMode,
  selectedDay,
  selectedTime,
  onTimeChange,
  onScheduleClick,
  days,
  onDayChange,
  onTimeSelect,
  timeSlots,
  isScheduleOpen,
  onScheduleClose,
}: PickupSectionProps) {
  const [dragY, setDragY] = useState(0);
  const touchStartY = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;
    const isScrolledToTop = scrollRef.current ? scrollRef.current.scrollTop <= 5 : true;

    if (diff > 0 && isScrolledToTop) {
      e.preventDefault();
      setDragY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (dragY > 100) {
      setDragY(0);
      onScheduleClose();
    } else {
      setDragY(0);
    }
  };

  const convertTo12Hour = (time24: string) => {
    const [start, end] = time24.split(" - ");
    const convert = (time: string) => {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };
    return `${convert(start)} - ${convert(end)}`;
  };

  return (
    <>
      {/* Map Placeholder */}
      <div className="h-40 rounded-xl border border-border/50 overflow-hidden">
        <img 
          src="/placeholder.jpg" 
          alt="Map location" 
          className="w-full h-full object-cover opacity-70"
        />
      </div>

      {/* Restaurant Info */}
      <div className="mb-5 py-4 px-4 bg-secondary/50 rounded-xl border border-border/50">
        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Store className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg text-foreground font-semibold">
              {restaurant.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {restaurant.address}
            </p>
          </div>
        </div>

        <Separator className="mt-4 mb-4 ml-13 bg-border" />

        <div className="flex gap-3">
          <WalkingPersonLottie className="w-12 h-12 flex-shrink-0 text-foreground self-center -ml-1" />
          <div className="flex-1">
            <h3 className="text-lg text-foreground font-semibold">
              Distance
            </h3>
            <p className="text-sm text-muted-foreground">
              {restaurant.distance}
            </p>
          </div>
        </div>
      </div>

      {/* Pickup Time */}
      <div className="mb-5 pt-4 pb-4 px-0 space-y-3">
        <div className="flex gap-3 items-center">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg text-foreground font-semibold">
              Pickup Time
            </h3>
          </div>
          {timeMode === "standard" ? (
            <span className="text-sm text-primary font-medium">10-15 min</span>
          ) : (
            <span className="text-sm text-primary font-medium">
              {convertTo12Hour(selectedTime)}
            </span>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              if (timeMode !== "standard") {
                onTimeChange();
              }
            }}
            className={`flex-1 p-4 rounded-xl border-2 transition-colors bg-transparent ${
              timeMode === "standard"
                ? "text-foreground border-primary"
                : "text-foreground border-border hover:border-primary/50"
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium">Standard</span>
              <span className="text-xs text-muted-foreground mt-1">10-15 min</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              if (timeMode !== "schedule") {
                onTimeChange();
                setTimeout(() => {
                  onScheduleClick();
                }, 0);
              } else {
                onScheduleClick();
              }
            }}
            className={`flex-1 p-4 rounded-xl border-2 transition-colors bg-transparent cursor-pointer ${
              timeMode === "schedule"
                ? "text-foreground border-primary"
                : "text-foreground border-border hover:border-primary/50"
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium">Schedule</span>
              {timeMode === "schedule" && (
                <>
                  <span className="text-xs text-muted-foreground mt-1">
                    {days.find((d) => d.value === selectedDay)?.label}, {days.find((d) => d.value === selectedDay)?.date}
                  </span>
                  <span className="text-xs text-primary mt-0.5">
                    {convertTo12Hour(selectedTime)}
                  </span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      <div className="h-px bg-border my-3" />

      {/* Schedule Drawer */}
      <Sheet open={isScheduleOpen} onOpenChange={(open) => !open && onScheduleClose()}>
        <SheetContent
          ref={scrollRef}
          side="bottom"
          className="rounded-t-3xl max-h-[85vh] overflow-y-auto px-5 bg-card border-t border-border"
          style={{
            transform: `translateY(${dragY}px)`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex justify-center pt-3 pb-2 touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="h-1 w-12 rounded-full bg-border" />
          </div>

          <div>
            <SheetHeader className="pb-2 px-0 text-center -mt-8">
              <SheetTitle className="text-xl font-serif text-foreground">Schedule Pickup</SheetTitle>
            </SheetHeader>

            <div className="space-y-1 px-0">
              <div className="-mt-4">
                <div 
                  className="w-full overflow-x-auto scrollbar-hide"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <div className="flex gap-3 py-4">
                    {days.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => onDayChange(day.value)}
                        className={`flex-shrink-0 p-4 rounded-xl border-2 transition-colors bg-transparent cursor-pointer ${
                          selectedDay === day.value
                            ? "text-foreground border-primary"
                            : "text-foreground border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-sm font-semibold">{day.label}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {day.date}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <RadioGroup value={selectedTime} onValueChange={onTimeSelect}>
                  <div 
                    className="h-72 overflow-y-auto scrollbar-hide"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    <div className="pr-4 space-y-0">
                      {timeSlots.map((slot, index) => {
                        const isSelected = selectedTime === slot;
                        return (
                          <div key={slot}>
                            <label
                              htmlFor={slot}
                              className="flex w-full items-center justify-between gap-3 px-0 py-3 text-left cursor-pointer"
                            >
                              <span className="text-sm font-medium text-foreground">
                                {convertTo12Hour(slot)}
                              </span>
                              <div className="flex-shrink-0">
                                <div
                                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                    isSelected
                                      ? "border-primary bg-primary"
                                      : "border-border bg-secondary"
                                  }`}
                                >
                                  {isSelected && (
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                                  )}
                                </div>
                              </div>
                              <RadioGroupItem value={slot} id={slot} className="sr-only" />
                            </label>
                            {index < timeSlots.length - 1 && (
                              <div className="h-px bg-border/50" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <Button
                className="w-full h-12 font-semibold bg-primary text-primary-foreground hover:opacity-90 text-lg mt-4 mb-4 rounded-xl glow-amber"
                onClick={() => {
                  onScheduleClose();
                }}
              >
                Schedule
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
