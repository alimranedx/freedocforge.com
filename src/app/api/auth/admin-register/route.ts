import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password, secretKey } = await req.json();

    if (!name || !email || !password || !secretKey) {
      return NextResponse.json({ error: "All fields including provisioning key are required" }, { status: 400 });
    }

    const expectedKey = process.env.ADMIN_PROVISION_KEY || "admin2026";
    if (secretKey !== expectedKey) {
      return NextResponse.json({ error: "Invalid Admin Provisioning Key. Access forbidden." }, { status: 403 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: "ADMIN",
    });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: "ADMIN" },
      redirect: "/admin/dashboard",
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Admin registration error:", error);
    return NextResponse.json({ error: error.message || "Failed to register admin" }, { status: 500 });
  }
}
