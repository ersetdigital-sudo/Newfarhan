import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ADMIN_COOKIE = "fr_admin_session";
/** Sesi berlaku 12 jam. */
export const ADMIN_MAX_AGE = 60 * 60 * 12;

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || "";
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Cek password admin yang diketik di form login. */
export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  return safeEqual(input, expected);
}

/**
 * Token sesi = "<expiry>.<hmac>". Ditandatangani pakai ADMIN_SESSION_SECRET,
 * jadi nggak bisa dipalsukan walau cookie-nya httpOnly dan bisa dibaca user.
 */
export function createSessionToken(): string {
  const expiresAt = Date.now() + ADMIN_MAX_AGE * 1000;
  const payload = String(expiresAt);
  const signature = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token || !secret()) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = createHmac("sha256", secret()).update(payload).digest("hex");
  if (!safeEqual(signature, expected)) return false;

  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

/** True kalau request saat ini punya sesi admin yang valid. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return isValidSessionToken(store.get(ADMIN_COOKIE)?.value);
}

/**
 * Guard untuk API route admin. Balikin Response 401 kalau belum login,
 * atau null kalau boleh lanjut.
 */
export async function guardAdminApi(): Promise<NextResponse | null> {
  if (await isAdmin()) return null;
  return NextResponse.json({ error: "Belum login sebagai admin." }, { status: 401 });
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_MAX_AGE,
  };
}
