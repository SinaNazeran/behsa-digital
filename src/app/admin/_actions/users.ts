"use server";

import { eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { hashPassword, requireAdmin, requireUser, revokeUserSessions, verifyPassword } from "@/lib/auth";
import type { ActionState } from "@/components/admin/ui";
import { done, fail, int, isUniqueViolation, refresh, str } from "./helpers";

const MIN_PW = 10;

export async function createUser(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const email = str(fd, "email", 255).toLowerCase();
  const name = str(fd, "name", 120);
  const password = String(fd.get("password") ?? "");
  const role = str(fd, "role") === "admin" ? "admin" : "editor";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("ایمیل نامعتبر است.");
  if (!name) return fail("نام الزامی است.");
  if (password.length < MIN_PW) return fail(`رمز عبور باید حداقل ${MIN_PW} نویسه باشد.`);
  try {
    await db.insert(schema.adminUsers).values({ email, name, role, passwordHash: await hashPassword(password) });
  } catch (e) {
    if (isUniqueViolation(e)) return fail("کاربری با این ایمیل وجود دارد.");
    throw e;
  }
  refresh();
  return done("کاربر ساخته شد.");
}

export async function updateUser(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireAdmin();
  const id = int(fd, "id");
  if (!(id > 0)) return fail("شناسه نامعتبر است.");
  const role = str(fd, "role") === "admin" ? "admin" : "editor";
  const isActive = fd.get("isActive") === "on";
  const password = String(fd.get("password") ?? "");

  if (id === me.id && (!isActive || role !== "admin")) return fail("نمی‌توانید دسترسی مدیر یا فعال‌بودن حساب خودتان را بردارید.");
  if (password && password.length < MIN_PW) return fail(`رمز عبور باید حداقل ${MIN_PW} نویسه باشد.`);

  if (role !== "admin" || !isActive) {
    const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(schema.adminUsers)
      .where(sql`${schema.adminUsers.role} = 'admin' and ${schema.adminUsers.isActive} and ${schema.adminUsers.id} <> ${id}`);
    if (n === 0) return fail("حداقل یک مدیر فعال باید باقی بماند.");
  }

  await db.update(schema.adminUsers)
    .set({ role, isActive, name: str(fd, "name", 120) || undefined, ...(password ? { passwordHash: await hashPassword(password) } : {}) })
    .where(eq(schema.adminUsers.id, id));
  if (password || !isActive) await revokeUserSessions(id, id === me.id);
  refresh();
  return done("کاربر به‌روزرسانی شد.");
}

export async function changeOwnPassword(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireUser();
  const current = String(fd.get("current") ?? "");
  const next = String(fd.get("next") ?? "");
  const confirm = String(fd.get("confirm") ?? "");
  if (next.length < MIN_PW) return fail(`رمز جدید باید حداقل ${MIN_PW} نویسه باشد.`);
  if (next !== confirm) return fail("تکرار رمز جدید مطابقت ندارد.");
  const [user] = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.id, me.id));
  if (!user || !(await verifyPassword(current, user.passwordHash))) return fail("رمز فعلی نادرست است.");
  await db.update(schema.adminUsers).set({ passwordHash: await hashPassword(next) }).where(eq(schema.adminUsers.id, me.id));
  await revokeUserSessions(me.id, true);
  return done("رمز عبور تغییر کرد و سایر نشست‌ها خارج شدند.");
}
