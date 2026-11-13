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
      if (category === "Receipts" || category === "Business") {
        whereClause.category = { in: ["Receipts", "Business", "Retail", "F-Commerce", "POS"] };
      } else if (category === "Class Routines" || category === "class-routines") {
        whereClause.category = { in: ["Class Routines", "class-routines", "Routine", "Timetable", "Education"] };
      } else if (category === "Exam Routines" || category === "exam-routines") {
        whereClause.category = { in: ["Exam Routines", "exam-routines", "Exam", "Schedule"] };
      } else if (category === "Medical Bills" || category === "Healthcare" || category === "medical-receipts") {
        whereClause.category = { in: ["Medical Bills", "Healthcare", "Medical", "Clinic", "Diagnostic", "medical-receipts"] };
      } else {
        whereClause.category = category;
      }
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
        category: "Receipts",
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
        documentNumber: "ROUT-2026-012",
        templateSlug: "school-class-routine",
        templateTitle: "Master Class Routine (Class 9-10)",
        category: "Class Routines",
        recipientName: "Section A & B (Morning Shift)",
        amountOrDetails: "6 Periods / Day • Rm 302",
        status: "Saved",
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
        creatorName: "Dhanmondi Govt. High School",
        creatorEmail: "principal@dhanmondischool.edu.bd",
        dataJson: {
          shift: "Morning",
          periods: 6,
          className: "Class 10",
        },
      },
      {
        id: "doc-103",
        documentNumber: "EXAM-2026-551",
        templateSlug: "school-exam-routine",
        templateTitle: "Annual Board Exam Routine 2026",
        category: "Exam Routines",
        recipientName: "Science & Commerce Batch",
        amountOrDetails: "10:00 AM - 01:00 PM • Hall 01",
        status: "Saved",
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        creatorName: "Ideal College Campus",
        creatorEmail: "admin@idealcollege.edu.bd",
        dataJson: {
          examTitle: "Annual Examination 2026",
          hall: "Main Auditorium",
        },
      },
      {
        id: "doc-104",
        documentNumber: "MED-BILL-7721",
        templateSlug: "medical-money-receipt",
        templateTitle: "Diagnostic Pathology Investigation Bill",
        category: "Medical Bills",
        recipientName: "Mrs. Salma Begum (42y/F)",
        amountOrDetails: "৳3,600 (Paid: ৳3,000, Due: ৳600)",
        status: "Saved",
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        creatorName: "CarePoint Diagnostic Center",
        creatorEmail: "accounts@carepointclinic.com",
        dataJson: {
          tests: ["CBC with ESR", "Ultrasonography of W/A", "Serum Creatinine"],
          totalAmount: 3600,
          paidAmount: 3000,
          dueAmount: 600,
        },
      },
      {
        id: "doc-105",
        documentNumber: "RX-4091",
        templateSlug: "doctor-prescription-pad",
        templateTitle: "Doctor Rx Prescription Pad",
        category: "Healthcare",
        recipientName: "Begum Rowshan Ara (54y/F)",
        amountOrDetails: "Tab. Napa Extra, Tab. Seclo 20mg",
        status: "Saved",
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        creatorName: "Dr. Farhana Yasmin",
        creatorEmail: "demo.doctor@freedocforge.com",
        dataJson: {
          medicines: [{ name: "Tab. Napa Extra", dose: "1+0+1", days: "5 Days" }],
        },
      },
      {
        id: "doc-106",
        documentNumber: "ACAD-2026-104",
        templateSlug: "school-marksheet-result",
        templateTitle: "Academic Marksheet (GPA 5.00)",
        category: "Education",
        recipientName: "Sadia Afrin (Class 10)",
        amountOrDetails: "GPA 5.00 (Golden A+)",
        status: "Saved",
        createdAt: new Date(Date.now() - 3600000 * 7).toISOString(),
        creatorName: "Ideal Coaching Center",
        creatorEmail: "demo.school@freedocforge.com",
        dataJson: {
          gpa: "5.00",
          grade: "A+",
        },
      },
      {
        id: "doc-107",
        documentNumber: "POS-9902",
        templateSlug: "restaurant-pos-bill",
        templateTitle: "Restaurant Food POS Slip (80mm)",
        category: "POS",
        recipientName: "Table 04 (Walk-in)",
        amountOrDetails: "৳1,420",
        status: "Saved",
        createdAt: new Date(Date.now() - 3600000 * 9).toISOString(),
        creatorName: "Kacchi Ghor Restaurant",
        creatorEmail: "kacchi@freedocforge.com",
        dataJson: {
          items: [{ name: "Basmati Kacchi Full", qty: 2, rate: 450, amount: 900 }],
        },
      },
    ];

    const filtered = fallbackDocs.filter((d) => {
      let matchCat = true;
      if (category) {
        if (category === "Receipts") matchCat = ["Receipts", "Business", "POS"].includes(d.category);
        else if (category === "Class Routines") matchCat = ["Class Routines", "Education"].includes(d.category);
        else if (category === "Exam Routines") matchCat = ["Exam Routines", "Education"].includes(d.category);
        else if (category === "Medical Bills") matchCat = ["Medical Bills", "Healthcare"].includes(d.category);
        else matchCat = d.category === category;
      }
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
