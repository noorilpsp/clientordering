"use client";

import React from "react"

import { useRef, useEffect, useState } from "react";
import { categories } from "@/lib/menu-data";

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  isSticky: boolean;
  tabsContainerRef: React.RefObject<HTMLDivElement>;
}

export function CategoryTabs({
  activeCategory,
  onCategoryChange,
  isSticky,
  tabsContainerRef,
}: CategoryTabsProps) {
  const [underlineStyle, setUnderlineStyle] = useState({
    left: 0,
    width: 0,
  });
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  // Update underline position when active category changes
  useEffect(() => {
    if (activeBtnRef.current) {
      const button = activeBtnRef.current;
      setUnderlineStyle({
        left: button.offsetLeft,
        width: button.offsetWidth,
      });
    }
  }, [activeCategory]);

  return (
    <div
      className={`bg-card border-b border-border transition-shadow ${
        isSticky ? "shadow-md" : ""
      }`}
    >
      <div
        ref={tabsContainerRef}
        className="relative flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Sliding underline */}
        <div
          className="absolute bottom-0 h-1 bg-foreground transition-all"
          style={{
            left: `${underlineStyle.left + 16}px`,
            width: `${underlineStyle.width - 32}px`,
            transitionDuration: "200ms",
            transitionTimingFunction: "ease-out",
          }}
        />

        {categories.map((category) => (
          <button
            key={category.id}
            ref={activeCategory === category.id ? activeBtnRef : null}
            type="button"
            onClick={() => onCategoryChange(category.id)}
            data-category-id={category.id}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors relative z-10 ${
              activeCategory === category.id
                ? "font-bold text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{category.emoji}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
