"use server";

import { asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import type { ActionState } from "@/components/admin/ui";
import { bool, done, fail, int, refresh, str } from "./helpers";

/* FAQ, testimonials and client names share one ordered-list pattern. */

const TABLES = {
  faqs: schema.faqs,
  testimonials: schema.testimonials,
  clients: schema.clients,
} as const;
type Kind = keyof typeof TABLES;

function kindOf(fd: FormData): Kind | null {
  const k = str(fd, "kind");
  return k in TABLES ? (k as Kind) : null;
}

function readValues(kind: Kind, fd: FormData): { values?: Record<string, unknown>; error?: string } {
  const isPublished = bool(fd, "isPublished");
  if (kind === "faqs") {
    const question = str(fd, "question", 500);
    const answer = str(fd, "answer", 5000);
    if (!question || !answer) return { error: "پرسش و پاسخ هر دو الزامی‌اند." };
    return { values: { question, answer, isPublished } };
  }
  if (kind === "testimonials") {
    const quote = str(fd, "quote", 1000);
    const name = str(fd, "name", 120);
    if (!quote || !name) return { error: "متن نظر و نام گوینده الزامی‌اند." };
    return { values: { quote, name, org: str(fd, "org", 160), isPublished } };
  }
  const name = str(fd, "name", 160);
  if (!name) return { error: "نام مشتری الزامی است." };
  return { values: { name, isPublished } };
}

export async function saveItem(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const kind = kindOf(fd);
  if (!kind) return fail("نوع محتوا نامعتبر است.");
  const { values, error } = readValues(kind, fd);
  if (error || !values) return fail(error ?? "خطا");
  const table = TABLES[kind];
  const id = int(fd, "id");

  if (id > 0) {
    await db.update(table).set(values).where(eq(table.id, id));
  } else {
    const rows = await db.select({ s: table.sortOrder }).from(table);
    const next = rows.reduce((m, r) => Math.max(m, r.s), -1) + 1;
    await db.insert(table).values({ ...values, sortOrder: next } as never);
  }
  refresh(kind);
  return done(id > 0 ? "ذخیره شد." : "اضافه شد.");
}

export async function deleteItem(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const kind = kindOf(fd);
  const id = int(fd, "id");
  if (!kind || !(id > 0)) return fail("درخواست نامعتبر است.");
  const table = TABLES[kind];
  await db.delete(table).where(eq(table.id, id));
  refresh(kind);
  return done("حذف شد.");
}

/** swap position with the previous/next item */
export async function moveItem(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const kind = kindOf(fd);
  const id = int(fd, "id");
  const dir = str(fd, "dir") === "up" ? -1 : 1;
  if (!kind || !(id > 0)) return fail("درخواست نامعتبر است.");
  const table = TABLES[kind];

  await db.transaction(async (tx) => {
    const rows = await tx.select({ id: table.id }).from(table).orderBy(asc(table.sortOrder), asc(table.id));
    const i = rows.findIndex((r) => r.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= rows.length) return;
    [rows[i], rows[j]] = [rows[j], rows[i]];
    /* renumber densely so ordering is always stable */
    for (let k = 0; k < rows.length; k++) await tx.update(table).set({ sortOrder: k }).where(eq(table.id, rows[k].id));
  });
  refresh(kind);
  return { ok: true };
}
