import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = (body.name || "").trim();
    const rawEmail = (body.email || "").trim().toLowerCase();
    const rawPhone = (body.phone || "").trim();
    const password = body.password;
    const rememberMe = body.rememberMe !== false; // Default true to keep logged in

    if (!name) {
      return NextResponse.json({ error: "Full Name is required" }, { status: 400 });
    }

    if (!rawEmail && !rawPhone) {
      return NextResponse.json(
        { error: "Please provide either an Email address or a Phone number" },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Validate email format if provided
    let cleanEmail: string | null = null;
    if (rawEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(rawEmail)) {
        return NextResponse.json(
          { error: "Please enter a valid email address" },
          { status: 400 }
        );
      }
      cleanEmail = rawEmail;

      const existingEmail = await prisma.user.findFirst({
        where: { email: cleanEmail },
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: "This email address is already registered" },
          { status: 400 }
        );
      }
    }

    // Validate phone if provided
    let cleanPhone: string | null = null;
    if (rawPhone) {
      const normalized = rawPhone.replace(/[\s\-]/g, "");
      if (normalized.length < 8 || normalized.length > 20) {
        return NextResponse.json(
          { error: "Please enter a valid phone number" },
          { status: 400 }
        );
      }
      cleanPhone = normalized;

      const existingPhone = await prisma.user.findFirst({
        where: {
          OR: [{ phone: cleanPhone }, { phone: rawPhone }],
        },
      });
      if (existingPhone) {
        return NextResponse.json(
          { error: "This phone number is already registered" },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await hashPassword(password);

    // If first user in database, grant ADMIN role, otherwise USER
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? "ADMIN" : "USER";

    const user = await prisma.user.create({
      data: {
        name,
        email: cleanEmail,
        phone: cleanPhone,
        password: hashedPassword,
        role,
      },
    });

    // Auto-create a default OrganizationProfile for this user
    await prisma.organizationProfile.create({
      data: {
        userId: user.id,
        businessName: `${name}'s Business`,
        phone: cleanPhone,
        currency: "BDT",
      },
    });

    const token = await signToken(
      {
        userId: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
      rememberMe
    );

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      redirect: user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard",
    });

    const maxAgeSeconds = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: maxAgeSeconds,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create account" },
      { status: 500 }
    );
  }
}
