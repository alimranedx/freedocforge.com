import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/errorHandler";

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

    if (!profile) {
      return NextResponse.json({ success: true, profile: null });
    }

    let cleanTerms = profile.terms || "";
    let presetType = "shop";
    let academicSession = "2026";
    let academicShift = "Morning Shift";
    let examCenter = "Main Campus / Hall A";

    if (profile.terms && profile.terms.startsWith("{") && profile.terms.includes('"_meta"')) {
      try {
        const parsed = JSON.parse(profile.terms);
        cleanTerms = parsed.text ?? profile.terms;
        if (parsed._meta) {
          presetType = parsed._meta.presetType || "shop";
          academicSession = parsed._meta.academicSession || "2026";
          academicShift = parsed._meta.academicShift || "Morning Shift";
          examCenter = parsed._meta.examCenter || "Main Campus / Hall A";
        }
      } catch (e) {
        // legacy plain text terms
      }
    }

    return NextResponse.json({
      success: true,
      profile: {
        ...profile,
        terms: cleanTerms,
        presetType,
        academicSession,
        academicShift,
        examCenter,
      },
    });
  } catch (error) {
    return handleApiError(error, "Failed to load profile");
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

    // Bounds checking on uploaded images (max 4MB string length)
    if (logoUrl && typeof logoUrl === "string" && logoUrl.length > 4 * 1024 * 1024) {
      return NextResponse.json({ error: "Logo image exceeds maximum permitted size" }, { status: 400 });
    }
    if (signatureUrl && typeof signatureUrl === "string" && signatureUrl.length > 4 * 1024 * 1024) {
      return NextResponse.json({ error: "Signature image exceeds maximum permitted size" }, { status: 400 });
    }

    // Capture and serialize multi-preset and institutional metadata
    const presetType = ["shop", "school", "medical"].includes(body.presetType) ? body.presetType : "shop";
    const academicSession = typeof body.academicSession === "string" ? body.academicSession.trim().slice(0, 50) : "2026";
    const academicShift = typeof body.academicShift === "string" ? body.academicShift.trim().slice(0, 50) : "Morning Shift";
    const examCenter = typeof body.examCenter === "string" ? body.examCenter.trim().slice(0, 100) : "Main Campus / Hall A";

    const termsPayload = JSON.stringify({
      text: sanitizedTerms || "",
      _meta: {
        presetType,
        academicSession,
        academicShift,
        examCenter,
      },
    });

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
          terms: termsPayload,
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
          terms: termsPayload,
          logoUrl: logoUrl || null,
          signatureUrl: signatureUrl || null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      profile: {
        ...savedProfile,
        terms: sanitizedTerms,
        presetType,
        academicSession,
        academicShift,
        examCenter,
      },
    });
  } catch (error) {
    return handleApiError(error, "Failed to save profile");
  }
}
