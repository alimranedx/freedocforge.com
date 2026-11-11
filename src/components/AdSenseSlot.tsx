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
      <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-medium">
        {label}
      </span>
      <div className="w-full bg-slate-100/70 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-lg p-4 flex flex-col items-center justify-center min-h-[90px] text-center text-xs text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100 dark:hover:bg-slate-800/80">
        <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Google AdSense Slot ({slotId})
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          Displays targeted high-CPC business & software ads here in production.
        </p>
      </div>
    </div>
  );
}
