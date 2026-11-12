import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminSession } from "@/lib/auth";

// In-memory runtime persistence for platform configuration
let currentPlatformSettings = {
  platformName: "FreeDocForge.com",
  supportPhone: "+880 1711-000000",
  supportEmail: "support@freedocforge.com",
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
    currentPlatformSettings = {
      ...currentPlatformSettings,
      ...body,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Platform settings updated successfully.",
      settings: currentPlatformSettings,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update platform settings" }, { status: 500 });
  }
}
