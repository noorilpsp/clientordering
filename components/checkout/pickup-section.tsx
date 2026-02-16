"use client";

import { useState, useRef } from "react";
import { MapPin, Clock, ChevronDown, Store } from "lucide-react";
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
      onScheduleClose();
    } else {
      setDragY(0);
    }
  };
  // Convert 24-hour format to 12-hour format with AM/PM
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
      <div className="h-40 rounded-lg border border-border overflow-hidden">
        <img 
          src="/placeholder.jpg" 
          alt="Map location" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Restaurant Info */}
      <div className="mb-5 py-4 px-0 bg-card rounded-lg border border-border">
        {/* Name and Address */}
        <div className="flex gap-3">
          <Store className="w-6 h-6 flex-shrink-0 text-foreground self-center" />
          <div className="flex-1">
            <h3 className="text-lg text-foreground font-medium">
              {restaurant.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {restaurant.address}
            </p>
          </div>
        </div>

        {/* Separator */}
        <Separator className="mt-5 mb-5 ml-9 bg-gray-200 dark:bg-gray-700" />

        {/* Distance */}
        <div className="flex gap-3">
          <WalkingPersonLottie className="w-12 h-12 flex-shrink-0 text-foreground self-center -ml-4" />
          <div className="flex-1">
            <h3 className="text-lg text-foreground font-medium">
              Distance
            </h3>
            <p className="text-sm text-muted-foreground">
              {restaurant.distance}
            </p>
          </div>
        </div>

        {/* Separator */}
        <Separator className="mt-5 mb-0 ml-9 bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Pickup Time */}
      <div className="mb-0 -mt-8 pt-4 pb-0 px-0 bg-card rounded-lg border border-border space-y-3">
        <div className="flex gap-3 items-center">
          <Clock className="w-6 h-6 flex-shrink-0 text-foreground" />
          <div className="flex-1">
            <h3 className="text-lg text-foreground font-medium">
              Pickup Time
            </h3>
          </div>
          {timeMode === "standard" ? (
            <span className="text-sm text-muted-foreground flex-shrink-0">10-15 min</span>
          ) : (
            <span className="text-sm text-muted-foreground flex-shrink-0">
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
            className={`flex-1 p-4 rounded-lg border-2 transition-colors bg-transparent ${
              timeMode === "standard"
                ? "text-foreground border-foreground"
                : "text-foreground border-border hover:border-foreground shadow-md"
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
                // Open drawer immediately when switching to schedule mode
                setTimeout(() => {
                  onScheduleClick();
                }, 0);
              } else {
                onScheduleClick();
              }
            }}
            className={`flex-1 p-4 rounded-lg border-2 transition-colors bg-transparent cursor-pointer ${
              timeMode === "schedule"
                ? "text-foreground border-foreground"
                : "text-foreground border-border hover:border-foreground shadow-md"
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium">Schedule</span>
              {timeMode === "schedule" && (
                <>
                  <span className="text-xs text-muted-foreground mt-1">
                    {days.find((d) => d.value === selectedDay)?.label}, {days.find((d) => d.value === selectedDay)?.date}
                  </span>
                  <span className="text-xs text-muted-foreground mt-0.5">
                    {convertTo12Hour(selectedTime)}
                  </span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Thick Separator - Full width */}
      <div className="h-0.5 bg-gray-200 mt-3 mb-3 -mx-4" />

      {/* Schedule Drawer */}
      <Sheet open={isScheduleOpen} onOpenChange={(open) => !open && onScheduleClose()}>
        <SheetContent
          ref={scrollRef}
          side="bottom"
          className="rounded-t-2xl max-h-[85vh] overflow-y-auto px-4"
          style={{
            transform: `translateY(${dragY}px)`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Drag Handle */}
          <div
            className="flex justify-center pt-3 pb-2 touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="h-1 w-12 rounded-full bg-gray-300" />
          </div>

          <div>
            <SheetHeader className="pb-2 px-0 text-center -mt-8">
              <SheetTitle className="text-xl">Schedule Pickup</SheetTitle>
            </SheetHeader>

            <div className="space-y-1 px-0">
            {/* Days */}
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
                      className={`flex-shrink-0 p-4 rounded-lg border-2 transition-colors bg-transparent cursor-pointer relative ${
                        selectedDay === day.value
                          ? "text-foreground border-foreground"
                          : "text-foreground border-border hover:border-foreground shadow-md"
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

            {/* Time Slots */}
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
                            </div>
                            <RadioGroupItem value={slot} id={slot} className="sr-only" />
                          </label>
                          {index < timeSlots.length - 1 && (
                            <div className="h-px bg-gray-200" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Confirm Button */}
            <Button
              className="w-full h-12 font-semibold bg-black text-white hover:bg-gray-900 text-xl mt-4 mb-4"
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
