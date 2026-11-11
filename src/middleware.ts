import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "freedocforge-super-secret-key-change-this-in-production-2026"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;

  let session: { role?: string; userId?: string } | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      session = payload as { role?: string; userId?: string };
    } catch {
      session = null;
    }
  }

  // 1. Dedicated Admin Auth Routes (/admin/login, /admin/registration)
  if (pathname === "/admin/login" || pathname === "/admin/registration") {
    if (session && session.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // 2. Protected Admin Routes (/admin, /admin/dashboard, /admin/templates, etc.)
  if (pathname.startsWith("/admin")) {
    if (!session || session.role !== "ADMIN") {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Protected User Dashboard Routes (/dashboard, /dashboard/shop-profile, etc.)
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. Regular User Auth Routes (/login, /register)
  if (pathname === "/login" || pathname === "/register") {
    if (session) {
      if (session.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
