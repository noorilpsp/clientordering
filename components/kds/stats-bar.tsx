"use client";

import { Stats } from "@/lib/kds-types";

interface StatsBarProps {
  stats: Stats;
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="flex items-center justify-around px-6 py-3 bg-muted/50 border-b border-border">
      <div className="flex items-center gap-2">
        <span className="text-lg">🔥</span>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Active</span>
          <span className="text-lg font-semibold">{stats.active}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-lg">⏱️</span>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Avg Wait</span>
          <span className="text-lg font-semibold">{stats.avgWaitTime}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-lg">✅</span>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Today</span>
          <span className="text-lg font-semibold">{stats.completedToday}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-lg">🏆</span>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Streak</span>
          <span className="text-lg font-semibold">{stats.streak}</span>
        </div>
      </div>
    </div>
  );
}
