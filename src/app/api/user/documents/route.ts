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

    // Strict User Isolation: Retrieve only documents belonging to the authenticated user
    const documents = await prisma.savedDocument.findMany({
      where: { userId: payload.userId },
    });

    // In-memory sort prevents MySQL error 1038 (out of sort memory) on large dataJson/logo payloads
    documents.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return NextResponse.json({ success: true, userId: payload.userId, documents });
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
    const sanitizedDocNum = String(documentNumber).trim().slice(0, 50);
    const sanitizedRecipient = recipientName ? String(recipientName).slice(0, 150) : null;
    const sanitizedAmount = amountOrDetails ? String(amountOrDetails).slice(0, 100) : null;
    const sanitizedCategory = category ? String(category).slice(0, 50) : "Business";
    const sanitizedStatus = status ? String(status).slice(0, 50) : "Saved";
    const sanitizedSlug = String(templateSlug).trim().slice(0, 100);

    // Case 1: Updating existing document by explicit ID (with strict user ownership verification - SEC-IDOR-01)
    if (id) {
      const existing = await prisma.savedDocument.findFirst({
        where: {
          id: String(id),
          userId: payload.userId, // Strict user isolation
        },
        select: { id: true },
      });

      if (!existing) {
        return NextResponse.json({ error: "Document not found or access denied" }, { status: 404 });
      }

      const updated = await prisma.savedDocument.update({
        where: { id: existing.id },
        data: {
          templateSlug: sanitizedSlug,
          templateTitle: sanitizedTitle,
          documentNumber: sanitizedDocNum,
          recipientName: sanitizedRecipient,
          amountOrDetails: sanitizedAmount,
          category: sanitizedCategory,
          status: sanitizedStatus,
          dataJson,
        },
      });

      return NextResponse.json({
        success: true,
        userId: payload.userId,
        document: updated,
        updated: true,
      });
    }

    // Case 2: ID not provided - Smart Duplicate Prevention Check
    // If the user already has a saved document with the exact same documentNumber and templateSlug, update it!
    const existingSameDoc = await prisma.savedDocument.findFirst({
      where: {
        userId: payload.userId, // Strict user isolation
        templateSlug: sanitizedSlug,
        documentNumber: sanitizedDocNum,
      },
      select: { id: true },
    });

    if (existingSameDoc) {
      const updated = await prisma.savedDocument.update({
        where: { id: existingSameDoc.id },
        data: {
          templateTitle: sanitizedTitle,
          recipientName: sanitizedRecipient,
          amountOrDetails: sanitizedAmount,
          category: sanitizedCategory,
          status: sanitizedStatus,
          dataJson,
        },
      });

      return NextResponse.json({
        success: true,
        userId: payload.userId,
        document: updated,
        updated: true,
        updatedExisting: true,
      });
    }

    // Case 3: Create a brand new document for this user
    const profile = await prisma.organizationProfile.findFirst({
      where: { userId: payload.userId },
      orderBy: { createdAt: "desc" },
    });

    const newDoc = await prisma.savedDocument.create({
      data: {
        userId: payload.userId, // Strict tenant / user isolation
        profileId: profile?.id || null,
        templateSlug: sanitizedSlug,
        templateTitle: sanitizedTitle,
        category: sanitizedCategory,
        documentNumber: sanitizedDocNum,
        recipientName: sanitizedRecipient,
        amountOrDetails: sanitizedAmount,
        status: sanitizedStatus,
        dataJson,
      },
    });

    return NextResponse.json({ success: true, userId: payload.userId, document: newDoc, created: true });
  } catch (error: any) {
    return handleApiError(error, "Failed to save document");
  }
}

export async function PUT(req: Request) {
  return POST(req);
}
