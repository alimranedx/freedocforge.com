"use client";

import React from "react";

interface AdSenseSlotProps {
  slotId?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  label?: string;
}

// ADS SWITCH: Hidden by default. Turn to "true" in .env after receiving Google AdSense approval.
const ENABLE_ADS = process.env.NEXT_PUBLIC_ENABLE_ADS === "true";

export default function AdSenseSlot({
  slotId = "default-slot",
  format = "horizontal",
  className = "",
  label = "Sponsor Advertisement",
}: AdSenseSlotProps) {
  // Completely hide the ad slot and all placeholders until approval
  if (!ENABLE_ADS) {
    return null;
  }

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-placeholder";

  return (
    <div className={`my-4 w-full flex flex-col items-center justify-center ${className}`}>
      <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-medium">
        {label}
      </span>
      {/* Live Google AdSense container */}
      <div className="w-full min-h-[90px] flex items-center justify-center overflow-hidden">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
