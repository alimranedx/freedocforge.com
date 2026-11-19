"use client";

import React, { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

export interface AdSenseSlotProps {
  slotId?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  className?: string;
  label?: "Advertisement" | "Sponsored Links" | "বিজ্ঞাপন" | string;
  testMode?: boolean;
}

const GOOGLE_ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXXXX";
const ENABLE_ADS = process.env.NEXT_PUBLIC_ENABLE_ADS === "true";
const IS_DEV = process.env.NODE_ENV !== "production";

// Production-Calibrated Layout Reservations for Zero Cumulative Layout Shift (CLS < 0.01)
// Accounts for standard IAB dimensions + 20px padding + 21px label + 2px border.
const FORMAT_CLS_RESERVATION: Record<string, string> = {
  horizontal: "min-h-[95px] sm:min-h-[135px] w-full max-w-[728px]",
  rectangle: "min-h-[295px] w-full max-w-[336px]",
  vertical: "min-h-[640px] w-full max-w-[300px]",
  auto: "min-h-[95px] sm:min-h-[135px] w-full",
};

// Dimensions description for developer/admin sandbox verification
const FORMAT_DIMENSIONS: Record<string, string> = {
  horizontal: "728 × 90 Leaderboard (320 × 50 Mobile)",
  rectangle: "300 × 250 / 336 × 280 Rectangle",
  vertical: "300 × 600 Half Page Skyscraper",
  auto: "Responsive Smart Banner",
};

export default function AdSenseSlot({
  slotId = "default-slot",
  format = "auto",
  responsive = true,
  className = "",
  label = "Advertisement",
  testMode,
}: AdSenseSlotProps) {
  const adPushedRef = useRef(false);
  const insRef = useRef<HTMLModElement>(null);
  const [isUnfilled, setIsUnfilled] = useState(false);

  // Determine if sandbox/test mode is active:
  // Active if explicitly passed, or if test mode is enabled in development without a real client ID.
  const isSandbox =
    testMode !== undefined
      ? testMode
      : process.env.NEXT_PUBLIC_ADS_TEST_MODE === "true" ||
        (IS_DEV && (GOOGLE_ADSENSE_CLIENT_ID.includes("XXXX") || GOOGLE_ADSENSE_CLIENT_ID.includes("placeholder")));

  // Google Publisher Policy Enforcement:
  // Ads may strictly only be labeled as "Advertisement", "Sponsored Links", or official translation "বিজ্ঞাপন"
  const compliantLabel =
    label === "Sponsored Links"
      ? "Sponsored Links"
      : label === "বিজ্ঞাপন"
      ? "বিজ্ঞাপন"
      : "Advertisement";

  // Dynamic push of adsbygoogle on component mount
  useEffect(() => {
    if (!ENABLE_ADS || isSandbox || adPushedRef.current) return;

    try {
      if (typeof window !== "undefined") {
        const insElement = insRef.current;
        // Avoid duplicate push if Next.js already hydrated or pushed to this ins tag
        if (insElement && insElement.getAttribute("data-adsbygoogle-status")) {
          return;
        }

        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        adPushedRef.current = true;

        trackEvent({
          name: "ad_slot_impression",
          properties: {
            slot_id: slotId,
            format,
          },
        });

        // Listen for AdSense unfilled status via MutationObserver to prevent blank boxes
        if (insElement) {
          const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
              if (
                mutation.type === "attributes" &&
                mutation.attributeName === "data-ad-status"
              ) {
                const status = insElement.getAttribute("data-ad-status");
                if (status === "unfilled") {
                  setIsUnfilled(true);
                }
              }
            }
          });
          observer.observe(insElement, { attributes: true });
          return () => observer.disconnect();
        }
      }
    } catch {
      // AdSense push error swallowed to prevent UI disruption
    }
  }, [slotId, format, isSandbox]);

  // If ads are globally disabled and not in sandbox mode, completely collapse
  if (!ENABLE_ADS && !isSandbox) {
    return null;
  }

  // If AdSense confirmed unfilled, gracefully collapse or hide to avoid empty dashed boxes
  if (isUnfilled && !isSandbox) {
    return null;
  }

  const reservationClass = FORMAT_CLS_RESERVATION[format] || FORMAT_CLS_RESERVATION.auto;

  // SAFE SANDBOX / TEST MODE PREVIEW
  // Renders a high-fidelity visual blueprint unit for layout and responsiveness verification
  // with ZERO risk of Google account bans for invalid self-impressions.
  if (isSandbox) {
    return (
      <aside
        role="region"
        aria-label="AdSense Preview Sandbox"
        className={`relative overflow-hidden my-4 mx-auto text-center border-2 border-dashed border-blue-300 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl p-3 transition-all print:hidden flex flex-col items-center justify-center select-none ${reservationClass} ${className}`}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400">
            ADSENSE SANDBOX • 0 IMPRESSIONS BILLED
          </span>
        </div>

        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
          {FORMAT_DIMENSIONS[format] || "Responsive Ad Unit"}
        </div>

        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
          <span>Slot: <code className="bg-blue-100 dark:bg-blue-900/40 px-1 py-0.5 rounded text-blue-700 dark:text-blue-300">{slotId}</code></span>
          <span>•</span>
          <span>{compliantLabel}</span>
        </div>
      </aside>
    );
  }

  // PRODUCTION LIVE ADSENSE UNIT
  return (
    <aside
      role="region"
      aria-label={compliantLabel}
      className={`relative overflow-hidden my-6 mx-auto text-center border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 rounded-2xl p-2.5 transition-all print:hidden ${reservationClass} ${className}`}
    >
      <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-1.5 select-none text-center">
        {compliantLabel}
      </div>
      <ins
        ref={insRef}
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
