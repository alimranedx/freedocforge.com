"use client";

import React, { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

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
  const adPushedRef = useRef(false);

  // Dynamic push of adsbygoogle on component mount
  useEffect(() => {
    if (!ENABLE_ADS || adPushedRef.current) return;

    try {
      if (typeof window !== "undefined") {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        adPushedRef.current = true;

        trackEvent({
          name: "ad_slot_impression",
          properties: {
            slot_id: slotId,
            format,
          },
        });
      }
    } catch {
      // AdSense push error swallowed to prevent UI disruption
    }
  }, [slotId, format]);

  // Completely hide the ad slot and all placeholders until approval
  if (!ENABLE_ADS) {
    return null;
  }

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-placeholder";

  return (
    <div
      className={`my-7 py-2 w-full flex flex-col items-center justify-center print:hidden select-none ${className}`}
      data-ad-unit={slotId}
    >
      <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 font-medium select-none pointer-events-none">
        {label}
      </span>
      {/* Live Google AdSense container with reserved boundary to prevent Cumulative Layout Shift (CLS) */}
      <div className="w-full min-h-[90px] flex items-center justify-center overflow-hidden bg-slate-50/50 dark:bg-slate-900/30 rounded-lg">
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
