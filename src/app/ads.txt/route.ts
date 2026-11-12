import { NextResponse } from "next/server";

export async function GET() {
  const rawId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "pub-0000000000000000";
  // Clean 'ca-' prefix if user entered 'ca-pub-XXXX'
  const pubId = rawId.replace(/^ca-/, "");

  const content = `# FreeDocForge.com Authorized Digital Sellers (ads.txt)
# https://support.google.com/adsense/answer/7532444
google.com, ${pubId}, DIRECT, f08c47fec0942fa0
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
