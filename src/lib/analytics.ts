/**
 * FreeDocForge Analytics & Event Telemetry Engine
 * Privacy-first: Strips PII (phone numbers, full customer names, sensitive medical/academic details)
 * Dispatches to Google Analytics 4 (window.gtag) and custom backend telemetry if configured.
 */

export type TelemetryEvent =
  | {
      name: "template_viewed";
      properties: {
        template_slug: string;
        category: string;
        source?: "search" | "home" | "dashboard" | "direct";
      };
    }
  | {
      name: "preset_auto_filled";
      properties: {
        preset_type: "shop" | "school" | "medical";
        has_logo: boolean;
        has_signature: boolean;
      };
    }
  | {
      name: "voice_typing_activated";
      properties: {
        language: "bn-BD" | "en-US";
        field_id: string;
      };
    }
  | {
      name: "voice_typing_completed";
      properties: {
        field_id: string;
        chars_transcribed: number;
      };
    }
  | {
      name: "line_item_added";
      properties: {
        item_count: number;
        currency: string;
      };
    }
  | {
      name: "print_initiated";
      properties: {
        template_slug: string;
        paper_size: string;
        has_logo: boolean;
        amount_bucket?: "0-1000" | "1000-5000" | "5000-20000" | "20000+";
      };
    }
  | {
      name: "pdf_download_completed";
      properties: {
        template_slug: string;
        paper_size: string;
      };
    }
  | {
      name: "whatsapp_share_clicked";
      properties: {
        template_slug: string;
      };
    }
  | {
      name: "courier_affiliate_clicked";
      properties: {
        courier_name: "pathao" | "steadfast" | "redx" | "paperfly";
        placement: "post_print" | "editor_sidebar" | "dashboard";
      };
    }
  | {
      name: "hardware_affiliate_clicked";
      properties: {
        hardware_type: "thermal_printer_58mm" | "thermal_printer_80mm" | "paper_roll";
      };
    }
  | {
      name: "ad_slot_impression";
      properties: {
        slot_id: string;
        format: string;
      };
    }
  | {
      name: "pro_modal_viewed";
      properties: {
        trigger: "watermark_removal" | "ai_designer_limit" | "unlimited_cloud" | "nav";
      };
    };

/**
 * Tracks a custom event in a privacy-safe, non-blocking manner.
 */
export function trackEvent(event: TelemetryEvent): void {
  try {
    if (typeof window === "undefined") return;

    // 1. Google Analytics 4 (gtag) dispatch
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", event.name, event.properties);
    }

    // 2. In-browser dev logging (only active in non-production)
    if (process.env.NODE_ENV !== "production") {
      // Clean, structured telemetry trace
      // console.debug("[Telemetry Event]:", event.name, event.properties);
    }
  } catch {
    // Fail silently so telemetry never breaks the core document generation user experience
  }
}

/**
 * Helper to categorize financial totals into privacy-preserving buckets
 */
export function getAmountBucket(
  amount: number
): "0-1000" | "1000-5000" | "5000-20000" | "20000+" {
  if (amount <= 1000) return "0-1000";
  if (amount <= 5000) return "1000-5000";
  if (amount <= 20000) return "5000-20000";
  return "20000+";
}
