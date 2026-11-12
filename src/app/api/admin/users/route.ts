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
  const role = searchParams.get("role") || "";

  try {
    const whereClause: any = {};
    if (role && (role === "USER" || role === "ADMIN")) {
      whereClause.role = role;
    }
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        aiQuota: true,
        googleId: true,
        avatarUrl: true,
        createdAt: true,
        profiles: {
          select: {
            id: true,
            businessName: true,
            phone: true,
            currency: true,
          },
        },
        _count: {
          select: {
            documents: true,
          },
        },
      },
    });

    return NextResponse.json({
      dbOnline: true,
      users: users.map((u) => ({
        ...u,
        isGoogleLinked: !!u.googleId,
        businessName: u.profiles[0]?.businessName || u.name,
        documentsCount: u._count.documents,
      })),
    });
  } catch (error: any) {
    // Graceful fallback for local development when MySQL is offline
    const fallbackUsers = [
      {
        id: "usr-demo-admin",
        name: "Super Admin",
        email: "admin@freedocforge.com",
        phone: "01700000000",
        role: "ADMIN",
        aiQuota: 999,
        isGoogleLinked: false,
        businessName: "FreeDocForge Management HQ",
        documentsCount: 4,
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr-demo-shop",
        name: "Stylist Fashion BD",
        email: "demo.shop@freedocforge.com",
        phone: "01711000001",
        role: "USER",
        aiQuota: 10,
        isGoogleLinked: false,
        businessName: "Stylist Fashion BD",
        documentsCount: 22,
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: "usr-demo-doctor",
        name: "Dr. Farhana Yasmin",
        email: "demo.doctor@freedocforge.com",
        phone: "01811000002",
        role: "USER",
        aiQuota: 15,
        isGoogleLinked: true,
        businessName: "Care & Cure Clinic",
        documentsCount: 14,
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      },
      {
        id: "usr-demo-school",
        name: "Ideal Coaching Center",
        email: "demo.school@freedocforge.com",
        phone: "01911000003",
        role: "USER",
        aiQuota: 5,
        isGoogleLinked: false,
        businessName: "Ideal Coaching Center",
        documentsCount: 8,
        createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
      },
    ];

    const filtered = fallbackUsers.filter((u) => {
      const matchRole = !role || u.role === role;
      const matchSearch =
        !search ||
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.businessName.toLowerCase().includes(search);
      return matchRole && matchSearch;
    });

    return NextResponse.json({
      dbOnline: false,
      users: filtered,
    });
  }
}

export async function PATCH(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const admin = await getAdminSession(token);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
  }

  try {
    const { userId, role, aiQuota } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const dataToUpdate: any = {};
    if (role && (role === "USER" || role === "ADMIN")) {
      dataToUpdate.role = role;
    }
    if (typeof aiQuota === "number" && aiQuota >= 0) {
      dataToUpdate.aiQuota = aiQuota;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: { id: true, name: true, email: true, role: true, aiQuota: true },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update user or MySQL is offline." },
      { status: 500 }
    );
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
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Safety defense: Prevent admin from deleting themselves
    if (userId === admin.userId) {
      return NextResponse.json(
        { error: "Security Violation: You cannot delete your own administrative account." },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true, message: "User deleted successfully." });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete user or MySQL is offline." },
      { status: 500 }
    );
  }
}
