import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/errorHandler";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid session token" }, { status: 401 });
    }

    // Strict user ownership check (SEC-IDOR-01)
    const doc = await prisma.savedDocument.findFirst({
      where: { id, userId: payload.userId },
    });

    if (!doc) {
      return NextResponse.json({ error: "Document not found or access denied" }, { status: 404 });
    }

    return NextResponse.json({ success: true, userId: payload.userId, document: doc });
  } catch (error: any) {
    return handleApiError(error, "Failed to fetch document");
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid session token" }, { status: 401 });
    }

    // Strict user ownership check (SEC-IDOR-01 & SEC-TENANT-01)
    const existing = await prisma.savedDocument.findFirst({
      where: { id, userId: payload.userId },
      select: {
        id: true,
        templateTitle: true,
        templateSlug: true,
        documentNumber: true,
        recipientName: true,
        amountOrDetails: true,
        category: true,
        status: true,
        dataJson: true,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Document not found or access denied" }, { status: 404 });
    }

    const body = await req.json();
    const {
      templateSlug,
      templateTitle,
      category,
      documentNumber,
      recipientName,
      amountOrDetails,
      status,
      dataJson,
    } = body;

    const sanitizedTitle = (templateTitle || existing.templateTitle || "Saved Document").slice(0, 150);
    const sanitizedDocNum = documentNumber ? String(documentNumber).trim().slice(0, 50) : existing.documentNumber;
    const sanitizedRecipient = recipientName !== undefined ? (recipientName ? String(recipientName).slice(0, 150) : null) : existing.recipientName;
    const sanitizedAmount = amountOrDetails !== undefined ? (amountOrDetails ? String(amountOrDetails).slice(0, 100) : null) : existing.amountOrDetails;
    const sanitizedCategory = category ? String(category).slice(0, 50) : existing.category;
    const sanitizedStatus = status ? String(status).slice(0, 50) : existing.status;
    const sanitizedSlug = templateSlug ? String(templateSlug).trim().slice(0, 100) : existing.templateSlug;

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
        dataJson: dataJson || existing.dataJson,
      },
    });

    return NextResponse.json({ success: true, userId: payload.userId, document: updated });
  } catch (error: any) {
    return handleApiError(error, "Failed to update document");
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return PUT(req, context);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid session token" }, { status: 401 });
    }

    // Strict user ownership check (SEC-IDOR-01)
    const existing = await prisma.savedDocument.findFirst({
      where: { id, userId: payload.userId },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Document not found or access denied" }, { status: 404 });
    }

    await prisma.savedDocument.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ success: true, userId: payload.userId, message: "Document deleted successfully" });
  } catch (error: any) {
    return handleApiError(error, "Failed to delete document");
  }
}
