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

  const isAdmin = session?.role === "ADMIN";
  const isUser = !!session && !isAdmin;

  // 1. Admin Root Route (/admin)
  if (pathname === "/admin") {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    if (isUser) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // 2. Dedicated Admin Auth Routes (/admin/login, /admin/registration)
  if (pathname === "/admin/login" || pathname === "/admin/registration") {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    if (isUser) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // 3. Protected Admin Routes (/admin/dashboard, /admin/templates, /admin/users, /admin/ads, etc.)
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdmin) {
      // Ordinary user is forbidden from admin panel -> isolate strictly to user dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // 4. Protected User Dashboard Routes (/dashboard, /dashboard/shop-profile, /dashboard/history, etc.)
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (isAdmin) {
      // Admin session is forbidden from user panel -> isolate strictly to admin console
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // 5. Regular User Auth Routes (/login, /register)
  if (pathname === "/login" || pathname === "/register") {
    if (session) {
      if (isAdmin) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
