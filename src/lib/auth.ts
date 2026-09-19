import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { and, eq, gt, lt, sql } from "drizzle-orm";
import { db, schema } from "@/db";

/* ════════════════════════════════════════════════════════════════
   Session auth for the CMS — no third-party service.
   · random 32-byte token in an httpOnly cookie; only its SHA-256 is stored
   · fixed 7-day expiry, server-side revocation (logout, password reset)
   · brute-force throttle per email and per IP
   · Server Actions are additionally protected by Next's Origin check
   ════════════════════════════════════════════════════════════════ */

export const SESSION_COOKIE = "behsa_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_FAILS = 5;
const FAIL_WINDOW_MS = 15 * 60 * 1000;

export type CurrentUser = { id: number; email: string; name: string; role: "admin" | "editor" };

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

async function clientInfo() {
  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "").trim().slice(0, 64) || null;
  return { ip, userAgent: h.get("user-agent")?.slice(0, 500) ?? null };
}

async function setSessionCookie(token: string, expires: Date) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

/* ── Login / logout ── */

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function login(emailRaw: string, password: string): Promise<LoginResult> {
  const email = emailRaw.trim().toLowerCase();
  const { ip, userAgent } = await clientInfo();
  const since = new Date(Date.now() - FAIL_WINDOW_MS);

  const [{ fails }] = await db
    .select({ fails: sql<number>`count(*)::int` })
    .from(schema.loginAttempts)
    .where(and(
      eq(schema.loginAttempts.success, false),
      gt(schema.loginAttempts.createdAt, since),
      ip ? sql`(${schema.loginAttempts.email} = ${email} OR ${schema.loginAttempts.ip} = ${ip})` : eq(schema.loginAttempts.email, email),
    ));
  if (fails >= MAX_FAILS) {
    return { ok: false, error: "تعداد تلاش‌های ناموفق زیاد است. ۱۵ دقیقه بعد دوباره تلاش کنید." };
  }

  const [user] = await db.select().from(schema.adminUsers).where(sql`lower(${schema.adminUsers.email}) = ${email}`).limit(1);
  /* compare against a dummy hash when the user doesn't exist → constant-ish timing */
  const valid = await bcrypt.compare(password, user?.passwordHash ?? "$2b$12$/q.JLMtyQ8rd3DW2eaNIqOAGRocX6IrwqV.p7zNR8whQO34xuDhRa");

  await db.insert(schema.loginAttempts).values({ email, ip, success: Boolean(user && valid && user.isActive) });

  if (!user || !valid || !user.isActive) return { ok: false, error: "ایمیل یا رمز عبور نادرست است." };

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(schema.sessions).values({ id: hashToken(token), userId: user.id, expiresAt, ip, userAgent });
  await db.update(schema.adminUsers).set({ lastLoginAt: new Date() }).where(eq(schema.adminUsers.id, user.id));
  await setSessionCookie(token, expiresAt);

  /* housekeeping */
  await db.delete(schema.sessions).where(lt(schema.sessions.expiresAt, new Date()));
  await db.delete(schema.loginAttempts).where(lt(schema.loginAttempts.createdAt, new Date(Date.now() - 30 * 24 * 3600 * 1000)));
  return { ok: true };
}

export async function logout() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await db.delete(schema.sessions).where(eq(schema.sessions.id, hashToken(token)));
  jar.delete(SESSION_COOKIE);
}

/* ── Current user (memoised per request) ── */

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || token.length > 100) return null;

  const [row] = await db
    .select({ s: schema.sessions, u: schema.adminUsers })
    .from(schema.sessions)
    .innerJoin(schema.adminUsers, eq(schema.sessions.userId, schema.adminUsers.id))
    .where(and(eq(schema.sessions.id, hashToken(token)), gt(schema.sessions.expiresAt, new Date())))
    .limit(1);
  if (!row || !row.u.isActive) return null;

  return { id: row.u.id, email: row.u.email, name: row.u.name, role: row.u.role };
});

/** use in every admin page and EVERY server action */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin?error=forbidden");
  return user;
}

export const hashPassword = (password: string) => bcrypt.hash(password, 12);
export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash);

export async function revokeUserSessions(userId: number, exceptCurrent = true) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const keep = exceptCurrent && token ? hashToken(token) : null;
  await db.delete(schema.sessions).where(
    keep ? and(eq(schema.sessions.userId, userId), sql`${schema.sessions.id} <> ${keep}`) : eq(schema.sessions.userId, userId),
  );
}
