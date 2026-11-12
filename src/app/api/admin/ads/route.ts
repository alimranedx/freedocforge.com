import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminSession } from "@/lib/auth";

// In-memory runtime persistence for ad configuration
let currentAdConfig = {
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
    const body = await req.json();
    currentAdConfig = {
      ...currentAdConfig,
      ...body,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "AdSense settings updated successfully.",
      config: currentAdConfig,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save ad settings" }, { status: 500 });
  }
}
