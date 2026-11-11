import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawIdentifier = (body.identifier || body.email || body.phone || "").trim();
    const password = body.password;
    const rememberMe = body.rememberMe !== false; // Default true to keep user logged in

    if (!rawIdentifier || !password) {
      return NextResponse.json(
        { error: "Email or Phone number and password are required" },
        { status: 400 }
      );
    }

    const cleanIdentifier = rawIdentifier.toLowerCase();
    const normalizedDigits = rawIdentifier.replace(/[\s\-\(\)]/g, "");

    // Query user by email OR phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanIdentifier },
          { phone: rawIdentifier },
          { phone: normalizedDigits },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email/phone or password" },
        { status: 401 }
      );
    }

    // Account registered via Google OAuth without a password
    if (!user.password) {
      return NextResponse.json(
        {
          error:
            "This account is linked with Google. Please click 'Continue with Google' to sign in.",
        },
        { status: 400 }
      );
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email/phone or password" },
        { status: 401 }
      );
    }

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

    // 30 days if rememberMe, 1 day otherwise
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
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to login" },
      { status: 500 }
    );
  }
}
