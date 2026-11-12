import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { INITIAL_TEMPLATES } from "@/lib/templates";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const admin = await getAdminSession(token);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
  }

  const memoryUsage = process.memoryUsage();
  const systemInfo = {
    nodeVersion: process.version,
    platform: process.platform,
    uptimeSeconds: Math.floor(process.uptime()),
    heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    heapTotalMB: Math.round(memoryUsage.heapTotal / 1024 / 1024),
  };

  try {
    const [totalUsers, totalDocs, recentDocs, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.savedDocument.count(),
      prisma.savedDocument.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true, phone: true } },
        },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          profiles: { select: { businessName: true } },
          _count: { select: { documents: true } },
        },
      }),
    ]);

    // Aggregate category counts
    const businessCount = await prisma.savedDocument.count({
      where: { category: { in: ["Business", "Retail", "F-Commerce"] } },
    });
    const healthCount = await prisma.savedDocument.count({
      where: { category: { in: ["Healthcare", "Medical", "Clinic"] } },
    });
    const educationCount = await prisma.savedDocument.count({
      where: { category: { in: ["Education", "Academic", "School"] } },
    });
    const posCount = await prisma.savedDocument.count({
      where: { category: { in: ["POS", "Restaurant", "Food"] } },
    });

    return NextResponse.json({
      dbOnline: true,
      stats: {
        totalUsers,
        totalDocs,
        totalTemplates: INITIAL_TEMPLATES.length,
        categoryCounts: {
          business: businessCount,
          healthcare: healthCount,
          education: educationCount,
          pos: posCount,
        },
      },
      recentDocs,
      recentUsers,
      systemInfo,
    });
  } catch (error: any) {
    // Graceful fallback if MySQL is offline
    return NextResponse.json({
      dbOnline: false,
      dbError: error.message || "Database connection failed",
      stats: {
        totalUsers: 14,
        totalDocs: 48,
        totalTemplates: INITIAL_TEMPLATES.length,
        categoryCounts: {
          business: 28,
          healthcare: 11,
          education: 6,
          pos: 3,
        },
      },
      recentDocs: [
        {
          id: "doc-fallback-1",
          documentNumber: "MEMO-8821",
          templateTitle: "F-Commerce Cash Memo",
          category: "Business",
          recipientName: "Tanvir Hasan",
          amountOrDetails: "৳3,450",
          status: "Saved",
          createdAt: new Date().toISOString(),
          user: { name: "Stylist Fashion BD", email: "shop@freedocforge.com" },
        },
        {
          id: "doc-fallback-2",
          documentNumber: "RX-4091",
          templateTitle: "Doctor Rx Prescription Pad",
          category: "Healthcare",
          recipientName: "Begum Rowshan Ara (54y/F)",
          amountOrDetails: "Tab. Napa Extra, Tab. Seclo",
          status: "Saved",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          user: { name: "Dr. Farhana Yasmin", email: "doctor@freedocforge.com" },
        },
        {
          id: "doc-fallback-3",
          documentNumber: "ACAD-2026-08",
          templateTitle: "Academic Marksheet (GPA 5.00)",
          category: "Education",
          recipientName: "Sadia Afrin (Roll: 104)",
          amountOrDetails: "GPA 5.00 (A+)",
          status: "Saved",
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          user: { name: "Ideal Coaching Center", email: "school@freedocforge.com" },
        },
      ],
      recentUsers: [
        {
          id: "usr-fallback-1",
          name: "Stylist Fashion BD",
          email: "shop@freedocforge.com",
          role: "USER",
          aiQuota: 5,
          profiles: [{ businessName: "Stylist Fashion BD" }],
          _count: { documents: 18 },
        },
        {
          id: "usr-fallback-2",
          name: "Dr. Farhana Yasmin",
          email: "doctor@freedocforge.com",
          role: "USER",
          aiQuota: 10,
          profiles: [{ businessName: "Care & Cure Medical" }],
          _count: { documents: 14 },
        },
        {
          id: "usr-fallback-3",
          name: "Ideal Coaching Center",
          email: "school@freedocforge.com",
          role: "USER",
          aiQuota: 5,
          profiles: [{ businessName: "Ideal Model School" }],
          _count: { documents: 9 },
        },
      ],
      systemInfo,
    });
  }
}
