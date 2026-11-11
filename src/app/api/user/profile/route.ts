import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid session token" }, { status: 401 });
    }

    const profile = await prisma.organizationProfile.findFirst({
      where: { userId: payload.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, profile: profile || null });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid session token" }, { status: 401 });
    }

    const body = await req.json();
    const {
      businessName,
      tagline,
      phone,
      address,
      currency,
      terms,
      logoUrl,
      signatureUrl,
    } = body;

    if (!businessName || typeof businessName !== "string" || businessName.trim().length === 0) {
      return NextResponse.json({ error: "Business / Organization Name is required" }, { status: 400 });
    }

    // Sanitize string inputs to reasonable lengths
    const sanitizedBusinessName = businessName.trim().slice(0, 150);
    const sanitizedTagline = tagline ? String(tagline).trim().slice(0, 200) : null;
    const sanitizedPhone = phone ? String(phone).trim().slice(0, 50) : null;
    const sanitizedAddress = address ? String(address).trim().slice(0, 500) : null;
    const sanitizedCurrency = currency ? String(currency).trim().slice(0, 10) : "BDT";
    const sanitizedTerms = terms ? String(terms).trim().slice(0, 1000) : null;

    // Check if existing profile belongs to this user
    const existingProfile = await prisma.organizationProfile.findFirst({
      where: { userId: payload.userId },
    });

    let savedProfile;
    if (existingProfile) {
      savedProfile = await prisma.organizationProfile.update({
        where: { id: existingProfile.id },
        data: {
          businessName: sanitizedBusinessName,
          tagline: sanitizedTagline,
          phone: sanitizedPhone,
          address: sanitizedAddress,
          currency: sanitizedCurrency,
          terms: sanitizedTerms,
          logoUrl: logoUrl || existingProfile.logoUrl,
          signatureUrl: signatureUrl || existingProfile.signatureUrl,
        },
      });
    } else {
      savedProfile = await prisma.organizationProfile.create({
        data: {
          userId: payload.userId,
          businessName: sanitizedBusinessName,
          tagline: sanitizedTagline,
          phone: sanitizedPhone,
          address: sanitizedAddress,
          currency: sanitizedCurrency,
          terms: sanitizedTerms,
          logoUrl: logoUrl || null,
          signatureUrl: signatureUrl || null,
        },
      });
    }

    return NextResponse.json({ success: true, profile: savedProfile });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
