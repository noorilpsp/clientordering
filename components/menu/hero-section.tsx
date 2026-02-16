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
        className="absolute top-4 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm shadow-sm"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5 text-foreground" />
      </button>

      {/* Banner Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={restaurant.bannerUrl || "/placeholder.svg"}
          alt={`${restaurant.name} banner`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
      </div>

      {/* Logo and Restaurant Info */}
      <div className="relative flex flex-col items-center px-4 pb-4">
        {/* Overlapping Logo */}
        <div className="relative -mt-12 mb-3">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-card bg-card shadow-lg">
            <Image
              src={restaurant.logoUrl || "/placeholder.svg"}
              alt={`${restaurant.name} logo`}
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Restaurant Name */}
        <h1 className="text-xl font-bold text-foreground text-balance text-center">
          {restaurant.name}
        </h1>

        {/* Description */}
        <p className="mt-1 text-sm text-muted-foreground text-center text-pretty max-w-xs">
          {restaurant.description}
        </p>

        {/* Hours & Info Link */}
        <button
          type="button"
          onClick={onInfoClick}
          className="mt-3 flex items-center gap-1.5 text-sm hover:text-primary/80 transition-colors text-destructive"
        >
          <Info className="h-4 w-4" />
          <span className="text-destructive">Tap for hours & info</span>
        </button>
      </div>
    </div>
  );
}
