import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "freedocforge-super-secret-key-change-this-in-production-2026"
);

export interface SessionPayload {
  userId: string;
  email?: string | null;
  phone?: string | null;
  name: string;
  role: "USER" | "ADMIN";
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export async function signToken(payload: SessionPayload, rememberMe: boolean = true): Promise<string> {
  const expiration = rememberMe ? "30d" : "1d";
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiration)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getAdminSession(cookieToken?: string): Promise<SessionPayload | null> {
  if (!cookieToken) return null;
  const payload = await verifyToken(cookieToken);
  if (!payload || payload.role !== "ADMIN") return null;
  return payload;
}
