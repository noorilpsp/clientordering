"use client";

import Image from "next/image";
import { ArrowLeft, Info } from "lucide-react";
import { restaurant } from "@/lib/menu-data";

interface HeroSectionProps {
  onInfoClick: () => void;
}

export function HeroSection({ onInfoClick }: HeroSectionProps) {
  return (
    <div className="relative">
      {/* Back Button */}
      <button
        type="button"
        className="absolute top-4 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-full glass border border-border/50 shadow-lg"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5 text-foreground" />
      </button>

      {/* Banner Image */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={restaurant.bannerUrl || "/placeholder.svg"}
          alt={`${restaurant.name} banner`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
      </div>

      {/* Logo and Restaurant Info */}
      <div className="relative flex flex-col items-center px-6 pb-5">
        {/* Overlapping Logo */}
        <div className="relative -mt-14 mb-3">
          <div className="h-28 w-28 overflow-hidden rounded-2xl border-2 border-primary/30 bg-card shadow-xl glow-amber">
            <Image
              src={restaurant.logoUrl || "/placeholder.svg"}
              alt={`${restaurant.name} logo`}
              width={112}
              height={112}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Restaurant Name */}
        <h1 className="font-serif text-2xl font-bold text-foreground text-balance text-center tracking-tight">
          {restaurant.name}
        </h1>

        {/* Description */}
        <p className="mt-1.5 text-sm text-muted-foreground text-center text-pretty max-w-xs leading-relaxed">
          {restaurant.description}
        </p>

        {/* Hours & Info Link */}
        <button
          type="button"
          onClick={onInfoClick}
          className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <Info className="h-4 w-4" />
          <span>Hours & Info</span>
        </button>
      </div>
    </div>
  );
}
