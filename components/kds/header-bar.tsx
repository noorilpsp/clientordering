"use client";

import { Staff } from "@/lib/kds-types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderBarProps {
  staff: Staff;
  isConnected: boolean;
  restaurantName?: string;
}

export function HeaderBar({ staff, isConnected, restaurantName = "Pizza Palace" }: HeaderBarProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-background border-b border-border">
      {/* Left: Connection Status */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          {isConnected ? "LIVE" : "OFFLINE"}
        </span>
      </div>

      {/* Center: Restaurant Name */}
      <div className="text-lg font-semibold">
        {restaurantName}
      </div>

      {/* Right: Staff Info */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{staff.name}</span>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-base">{staff.avatar}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
