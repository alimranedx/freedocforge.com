"use client";

import React, { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

interface AdSenseSlotProps {
  slotId?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  className?: string;
  label?: "Advertisement" | "Sponsored Links" | string;
}

const GOOGLE_ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXXXX";
const ENABLE_ADS = process.env.NEXT_PUBLIC_ENABLE_ADS === "true";

// Layout reservation classes preventing Cumulative Layout Shift (CLS)
const FORMAT_CLS_RESERVATION: Record<string, string> = {
  horizontal: "min-h-[100px] w-full max-w-[728px]",
  rectangle: "min-h-[280px] w-full max-w-[336px]",
  vertical: "min-h-[600px] w-full max-w-[300px]",
  auto: "min-h-[110px] w-full",
};

export default function AdSenseSlot({
  slotId = "default-slot",
  format = "auto",
  responsive = true,
  className = "",
  label = "Advertisement",
}: AdSenseSlotProps) {
  const adPushedRef = useRef(false);

  // Google Publisher Policy Enforcement:
  // Ads may strictly only be labeled as "Advertisement" or "Sponsored Links"
  const compliantLabel =
    label === "Sponsored Links" ? "Sponsored Links" : "Advertisement";

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

  // Completely hide the ad slot and all placeholders until official approval (SEC-PRIV-01)
  if (!ENABLE_ADS) {
    return null;
  }

  const reservationClass = FORMAT_CLS_RESERVATION[format] || FORMAT_CLS_RESERVATION.auto;

  return (
    <aside
      role="region"
      aria-label="Advertisement"
      className={`relative overflow-hidden my-6 mx-auto text-center border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 rounded-2xl p-2.5 transition-all print:hidden ${reservationClass} ${className}`}
    >
      <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-1.5 select-none text-center">
        {compliantLabel}
      </div>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={GOOGLE_ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </aside>
  );
}
