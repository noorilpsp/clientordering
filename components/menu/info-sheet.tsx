"use client";

import React from "react"

import { useState, useRef } from "react";
import { MapPin, Phone, Clock, Globe } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { restaurant } from "@/lib/menu-data";

interface InfoSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InfoSheet({ open, onOpenChange }: InfoSheetProps) {
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
      onOpenChange(false);
    } else {
      setDragY(0);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
        {/* Drag Handle */}
        <div
          className="flex justify-center pt-2 pb-4 touch-none cursor-grab active:cursor-grabbing"
        >
          <div className="h-1 w-10 rounded-full bg-border" />
        </div>

        <div>
          <SheetHeader className="pb-4 px-0">
            <SheetTitle className="text-xl font-serif text-foreground">{restaurant.name}</SheetTitle>
          </SheetHeader>

          <div className="space-y-6 pb-20 px-0">
            {/* Address */}
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(restaurant.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 hover:opacity-80 transition-opacity"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Address</p>
                <p className="text-sm text-primary hover:underline">
                  {restaurant.address}
                </p>
              </div>
            </a>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Phone</p>
                <a
                  href={`tel:${restaurant.phone}`}
                  className="text-sm text-primary hover:underline"
                >
                  {restaurant.phone}
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-3">
                  Opening Hours
                </p>
                <div className="space-y-2">
                  {restaurant.hours.map((schedule) => (
                    <div
                      key={schedule.day}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">{schedule.day}</span>
                      <span className="text-foreground font-medium">
                        {schedule.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Website */}
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Website</p>
                <a
                  href={`https://${restaurant.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {restaurant.website}
                </a>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
