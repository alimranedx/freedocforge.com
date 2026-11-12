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

    const documents = await prisma.savedDocument.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, documents });
  } catch (error: any) {
    return handleApiError(error, "Failed to load documents");
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Please log in to save templates and documents" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid session token" }, { status: 401 });
    }

    const body = await req.json();
    const {
      id,
      templateSlug,
      templateTitle,
      category,
      documentNumber,
      recipientName,
      amountOrDetails,
      status,
      dataJson,
    } = body;

    if (!templateSlug || !documentNumber || !dataJson) {
      return NextResponse.json(
        { error: "Template slug, document number, and document data are required" },
        { status: 400 }
      );
    }

    // Sanitize string inputs
    const sanitizedTitle = (templateTitle || "Saved Document").slice(0, 150);
    const sanitizedDocNum = documentNumber.slice(0, 50);
    const sanitizedRecipient = recipientName ? String(recipientName).slice(0, 150) : null;
    const sanitizedAmount = amountOrDetails ? String(amountOrDetails).slice(0, 100) : null;
    const sanitizedCategory = category || "Business";
    const sanitizedStatus = status || "Saved";

    // If updating an existing document, verify user ownership (IDOR defense)
    if (id) {
      const existing = await prisma.savedDocument.findUnique({
        where: { id },
      });

      if (!existing || existing.userId !== payload.userId) {
        return NextResponse.json({ error: "Document not found or access denied" }, { status: 404 });
      }

      const updated = await prisma.savedDocument.update({
        where: { id },
        data: {
          templateTitle: sanitizedTitle,
          documentNumber: sanitizedDocNum,
          recipientName: sanitizedRecipient,
          amountOrDetails: sanitizedAmount,
          category: sanitizedCategory,
          status: sanitizedStatus,
          dataJson,
        },
      });

      return NextResponse.json({ success: true, document: updated });
    }

    // Get user's active profile if available
    const profile = await prisma.organizationProfile.findFirst({
      where: { userId: payload.userId },
      orderBy: { createdAt: "desc" },
    });

    const newDoc = await prisma.savedDocument.create({
      data: {
        userId: payload.userId,
        profileId: profile?.id || null,
        templateSlug,
        templateTitle: sanitizedTitle,
        category: sanitizedCategory,
        documentNumber: sanitizedDocNum,
        recipientName: sanitizedRecipient,
        amountOrDetails: sanitizedAmount,
        status: sanitizedStatus,
        dataJson,
      },
    });

    return NextResponse.json({ success: true, document: newDoc });
  } catch (error: any) {
    return handleApiError(error, "Failed to save document");
  }
}
