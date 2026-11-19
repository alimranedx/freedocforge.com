import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminSession } from "@/lib/auth";
import { handleApiError } from "@/lib/errorHandler";

// In-memory runtime persistence for platform configuration
let currentPlatformSettings = {
  platformName: "FreeDocForge.com",
  supportPhone: "+880 1712-345678",
  supportEmail: "support@freedocforge.com",
  officeAddress: "House 42, Road 11, Dhanmondi, Dhaka - 1205, Bangladesh",
  defaultCurrency: "৳ (BDT)",
  maintenanceMode: false,
  maintenanceMessage: "Scheduled engine optimization in progress. Document downloads remain operational.",
  aiModelEngine: "gemini-2.5-flash",
  defaultAiTokens: 5,
  lastUpdated: new Date().toISOString(),
};

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const admin = await getAdminSession(token);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    settings: currentPlatformSettings,
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
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
    }

    // Input bounds validation and field whitelisting to prevent prototype/property pollution (SEC-NEXT-01)
    const sanitized: Partial<typeof currentPlatformSettings> = {};

    if (typeof body.platformName === "string") {
      sanitized.platformName = body.platformName.trim().slice(0, 100);
    }
    if (typeof body.supportPhone === "string") {
      sanitized.supportPhone = body.supportPhone.trim().slice(0, 50);
    }
    if (typeof body.supportEmail === "string") {
      sanitized.supportEmail = body.supportEmail.trim().slice(0, 100);
    }
    if (typeof body.officeAddress === "string") {
      sanitized.officeAddress = body.officeAddress.trim().slice(0, 300);
    }
    if (typeof body.defaultCurrency === "string") {
      sanitized.defaultCurrency = body.defaultCurrency.trim().slice(0, 20);
    }
    if (typeof body.maintenanceMode === "boolean") {
      sanitized.maintenanceMode = body.maintenanceMode;
    }
    if (typeof body.maintenanceMessage === "string") {
      sanitized.maintenanceMessage = body.maintenanceMessage.trim().slice(0, 500);
    }
    if (typeof body.aiModelEngine === "string") {
      sanitized.aiModelEngine = body.aiModelEngine.trim().slice(0, 50);
    }
    if (typeof body.defaultAiTokens === "number" && !isNaN(body.defaultAiTokens)) {
      sanitized.defaultAiTokens = Math.max(0, Math.min(1000, Math.floor(body.defaultAiTokens)));
    }

    currentPlatformSettings = {
      ...currentPlatformSettings,
      ...sanitized,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Platform settings updated successfully.",
      settings: currentPlatformSettings,
    });
  } catch (error: any) {
    return handleApiError(error, "Failed to update platform settings");
  }
}
