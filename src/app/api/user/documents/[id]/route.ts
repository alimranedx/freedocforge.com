import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    const doc = await prisma.savedDocument.findUnique({
      where: { id },
    });

    if (!doc || doc.userId !== payload.userId) {
      return NextResponse.json({ error: "Document not found or access denied" }, { status: 404 });
    }

    return NextResponse.json({ success: true, document: doc });
  } catch (error: any) {
    console.error("Error fetching single document:", error);
    return NextResponse.json({ error: "Failed to fetch document" }, { status: 500 });
  }
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

    const existing = await prisma.savedDocument.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== payload.userId) {
      return NextResponse.json({ error: "Document not found or access denied" }, { status: 404 });
    }

    await prisma.savedDocument.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Document deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting document:", error);
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
