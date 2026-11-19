"use client";

import React from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
const enableAds = process.env.NEXT_PUBLIC_ENABLE_ADS === "true";

// Private / Authenticated route prefixes where Google AdSense is STRICTLY FORBIDDEN
// per Google Publisher Policies (no ads behind login, on private dashboards, or admin consoles).
const EXCLUDED_PREFIXES = ["/admin", "/dashboard", "/login", "/register"];

export default function PublicAdSenseScript() {
  const pathname = usePathname();

  // If on admin screens, private merchant dashboard, or auth screens, DO NOT inject the script.
  const isExcluded = EXCLUDED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isExcluded) {
    return null;
  }

  // Ensure ads are enabled and a valid client ID is provided
  if (!enableAds || !adsenseClientId || adsenseClientId.includes("placeholder") || adsenseClientId.includes("XXXX")) {
    return null;
  }

  return (
    <Script
      id="google-adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
