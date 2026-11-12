import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = process.env.NEXTAUTH_URL || url.origin;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  if (oauthError) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(oauthError)}`, origin)
    );
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get("google_oauth_state")?.value;

  if (!state || !storedState || state !== storedState) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_csrf_state", origin)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_code", origin)
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${origin}/api/auth/callback/google`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL("/login?error=google_not_configured", origin)
    );
  }

  try {
    // 1. Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Google token exchange error:", tokenData);
      return NextResponse.redirect(
        new URL("/login?error=token_exchange_failed", origin)
      );
    }

    // 2. Fetch user profile from Google UserInfo endpoint
    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await profileResponse.json();

    if (!profileResponse.ok || !profile.sub) {
      console.error("Google user profile error:", profile);
      return NextResponse.redirect(
        new URL("/login?error=profile_fetch_failed", origin)
      );
    }

    const googleId = profile.sub;
    const email = profile.email ? profile.email.toLowerCase() : null;
    const name = profile.name || profile.given_name || "Google User";
    const avatarUrl = profile.picture || null;

    // 3. Find or create user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId },
          ...(email ? [{ email }] : []),
        ],
      },
    });

    if (user) {
      // If user existed by email but hadn't linked googleId yet
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId,
            avatarUrl: user.avatarUrl || avatarUrl,
          },
        });
      }
    } else {
      // First user registered becomes ADMIN, otherwise USER
      const userCount = await prisma.user.count();
      const role = userCount === 0 ? "ADMIN" : "USER";

      user = await prisma.user.create({
        data: {
          name,
          email,
          googleId,
          avatarUrl,
          role,
        },
      });

      // Auto-create default OrganizationProfile
      await prisma.organizationProfile.create({
        data: {
          userId: user.id,
          businessName: `${name}'s Organization`,
          logoUrl: avatarUrl,
          currency: "BDT",
        },
      });
    }

    // 4. Sign persistent JWT token (30 days for OAuth persistent login)
    const token = await signToken(
      {
        userId: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
      true // Keep logged in
    );

    const redirectPath = user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
    const response = NextResponse.redirect(new URL(redirectPath, origin));

    // 30 days session cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    // Clear state cookie
    response.cookies.delete("google_oauth_state");

    return response;
  } catch (err: any) {
    console.error("Google OAuth callback exception:", err);
    return NextResponse.redirect(
      new URL("/login?error=oauth_internal_error", origin)
    );
  }
}
