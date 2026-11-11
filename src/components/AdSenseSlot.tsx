"use client";

import React from "react";

interface AdSenseSlotProps {
  slotId?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  label?: string;
}

export default function AdSenseSlot({
  slotId = "default-slot",
  format = "horizontal",
  className = "",
  label = "Sponsor Advertisement",
}: AdSenseSlotProps) {
  return (
    <div className={`my-4 w-full flex flex-col items-center justify-center ${className}`}>
      <span className="text-[10px] uppercase tracking-wider text-gray-600 mb-1 font-medium">
        {label}
      </span>
      <div className="w-full bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center min-h-[90px] text-center text-xs text-gray-600 transition-all hover:bg-gray-100/70">
        <div className="flex items-center gap-2 font-medium text-gray-600">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Google AdSense Slot ({slotId})
        </div>
        <p className="text-[11px] text-gray-600 mt-1">
          Displays targeted high-CPC business & software ads here in production.
        </p>
      </div>
    </div>
  );
}
