import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  const isConfigured = Boolean(
    clientId &&
    clientSecret &&
    !clientId.includes("your-google-client-id") &&
    !clientId.includes("placeholder")
  );

  return NextResponse.json({
    configured: isConfigured,
  });
}
