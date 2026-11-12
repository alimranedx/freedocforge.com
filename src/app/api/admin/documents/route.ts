import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const admin = await getAdminSession(token);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = (searchParams.get("search") || "").trim().toLowerCase();
  const category = searchParams.get("category") || "";

  try {
    const whereClause: any = {};
    if (category) {
      whereClause.category = category;
    }
    if (search) {
      whereClause.OR = [
        { documentNumber: { contains: search } },
        { recipientName: { contains: search } },
        { templateTitle: { contains: search } },
      ];
    }

    const documents = await prisma.savedDocument.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        profile: {
          select: {
            businessName: true,
          },
        },
      },
    });

    return NextResponse.json({
      dbOnline: true,
      documents: documents.map((doc) => ({
        ...doc,
        creatorName: doc.profile?.businessName || doc.user?.name || "Anonymous Guest",
        creatorEmail: doc.user?.email || "—",
      })),
    });
  } catch (error: any) {
    // Graceful fallback for local development when MySQL is offline
    const fallbackDocs = [
      {
        id: "doc-101",
        documentNumber: "INV-2026-081",
        templateSlug: "f-commerce-invoice",
        templateTitle: "F-Commerce Cash Memo",
        category: "Business",
        recipientName: "Mehedi Hasan Niloy",
        amountOrDetails: "৳2,850",
        status: "Saved",
        createdAt: new Date().toISOString(),
        creatorName: "Stylist Fashion BD",
        creatorEmail: "demo.shop@freedocforge.com",
        dataJson: {
          items: [{ name: "Cotton Panjabi (L)", qty: 1, rate: 2150, amount: 2150 }, { name: "Delivery Fee", qty: 1, rate: 700, amount: 700 }],
        },
      },
      {
        id: "doc-102",
        documentNumber: "RX-4091",
        templateSlug: "doctor-prescription-pad",
        templateTitle: "Doctor Rx Prescription Pad",
        category: "Healthcare",
        recipientName: "Begum Rowshan Ara (54y/F)",
        amountOrDetails: "Tab. Napa Extra, Tab. Seclo 20mg",
        status: "Saved",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        creatorName: "Dr. Farhana Yasmin",
        creatorEmail: "demo.doctor@freedocforge.com",
        dataJson: {
          medicines: [{ name: "Tab. Napa Extra", dose: "1+0+1", days: "5 Days" }],
        },
      },
      {
        id: "doc-103",
        documentNumber: "ACAD-2026-104",
        templateSlug: "school-marksheet-result",
        templateTitle: "Academic Marksheet (GPA 5.00)",
        category: "Education",
        recipientName: "Sadia Afrin (Class 10)",
        amountOrDetails: "GPA 5.00 (Golden A+)",
        status: "Saved",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        creatorName: "Ideal Coaching Center",
        creatorEmail: "demo.school@freedocforge.com",
        dataJson: {
          gpa: "5.00",
          grade: "A+",
        },
      },
      {
        id: "doc-104",
        documentNumber: "POS-9902",
        templateSlug: "restaurant-pos-bill",
        templateTitle: "Restaurant Food POS Slip (80mm)",
        category: "POS",
        recipientName: "Table 04 (Walk-in)",
        amountOrDetails: "৳1,420",
        status: "Saved",
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
        creatorName: "Kacchi Ghor Restaurant",
        creatorEmail: "kacchi@freedocforge.com",
        dataJson: {
          items: [{ name: "Basmati Kacchi Full", qty: 2, rate: 450, amount: 900 }],
        },
      },
    ];

    const filtered = fallbackDocs.filter((d) => {
      const matchCat = !category || d.category === category;
      const matchSearch =
        !search ||
        d.documentNumber.toLowerCase().includes(search) ||
        (d.recipientName && d.recipientName.toLowerCase().includes(search)) ||
        d.templateTitle.toLowerCase().includes(search) ||
        d.creatorName.toLowerCase().includes(search);
      return matchCat && matchSearch;
    });

    return NextResponse.json({
      dbOnline: false,
      documents: filtered,
    });
  }
}

export async function DELETE(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const admin = await getAdminSession(token);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
  }

  try {
    const { documentId } = await req.json();

    if (!documentId) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 });
    }

    await prisma.savedDocument.delete({
      where: { id: documentId },
    });

    return NextResponse.json({ success: true, message: "Document deleted successfully." });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete document or MySQL is offline." },
      { status: 500 }
    );
  }
}
