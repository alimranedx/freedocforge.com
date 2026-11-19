import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminSession } from "@/lib/auth";
import { handleApiError } from "@/lib/errorHandler";

export interface AdConfig {
  enabled: boolean;
  publisherId: string;
  testMode: boolean;
  slots: {
    header: boolean;
    sidebar: boolean;
    postDownload: boolean;
    inGallery: boolean;
  };
  lastUpdated: string;
}

// In-memory runtime persistence for ad configuration
let currentAdConfig: AdConfig = {
  enabled: process.env.NEXT_PUBLIC_ENABLE_ADS === "true",
  publisherId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-9928374829103847",
  testMode: true,
  slots: {
    header: true,
    sidebar: true,
    postDownload: true,
    inGallery: true,
  },
  lastUpdated: new Date().toISOString(),
};

export function getCurrentAdConfig(): AdConfig {
  return currentAdConfig;
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const admin = await getAdminSession(token);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    config: currentAdConfig,
  });
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const admin = await getAdminSession(token);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
  }

  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Request body must be a valid object" }, { status: 400 });
    }

    // 1. Validate & Sanitize publisherId
    let publisherId = currentAdConfig.publisherId;
    if (typeof body.publisherId === "string") {
      const cleanPubId = body.publisherId.trim();
      if (cleanPubId.length > 50) {
        return NextResponse.json({ error: "Publisher ID exceeds maximum length of 50 characters" }, { status: 400 });
      }
      // Valid AdSense format: ca-pub-XXXXXXXXXXXXXXXX or pub-XXXXXXXXXXXXXXXX
      const isValidPubId =
        cleanPubId === "" ||
        /^(ca-)?pub-\d{10,20}$/i.test(cleanPubId) ||
        /^(ca-)?pub-[X\d]+$/i.test(cleanPubId);

      if (!isValidPubId) {
        return NextResponse.json(
          { error: "Invalid Google AdSense Publisher ID format. Expected 'ca-pub-XXXXXXXXXXXXXXXX'" },
          { status: 400 }
        );
      }
      publisherId = cleanPubId;
    }

    // 2. Validate boolean flags
    const enabled = typeof body.enabled === "boolean" ? body.enabled : currentAdConfig.enabled;
    const testMode = typeof body.testMode === "boolean" ? body.testMode : currentAdConfig.testMode;

    // 3. Validate slots object
    const slots = { ...currentAdConfig.slots };
    if (body.slots && typeof body.slots === "object") {
      if (typeof body.slots.header === "boolean") slots.header = body.slots.header;
      if (typeof body.slots.sidebar === "boolean") slots.sidebar = body.slots.sidebar;
      if (typeof body.slots.postDownload === "boolean") slots.postDownload = body.slots.postDownload;
      if (typeof body.slots.inGallery === "boolean") slots.inGallery = body.slots.inGallery;
    }

    // Construct validated, sanitized config object (prevent raw object spread injection)
    currentAdConfig = {
      enabled,
      publisherId,
      testMode,
      slots,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "AdSense settings updated successfully.",
      config: currentAdConfig,
    });
  } catch (error: any) {
    return handleApiError(error, "Failed to save ad settings");
  }
}
