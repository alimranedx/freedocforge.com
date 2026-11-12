"use client";

import React, { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

interface AdSenseSlotProps {
  slotId?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  className?: string;
  label?: string;
}

const GOOGLE_ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXXXX";
const ENABLE_ADS = process.env.NEXT_PUBLIC_ENABLE_ADS === "true";

export default function AdSenseSlot({
  slotId = "default-slot",
  format = "auto",
  responsive = true,
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

  return (
    <div
      className={`relative overflow-hidden my-4 mx-auto text-center border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl p-2 print:hidden ${className}`}
    >
      <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-1 select-none">
        {label}
      </div>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={GOOGLE_ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
