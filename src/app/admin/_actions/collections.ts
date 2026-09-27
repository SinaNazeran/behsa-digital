"use server";

import { and, asc, eq, lt, notExists } from "drizzle-orm";
import { db, schema } from "@/db";
import { moveInPlace } from "@/lib/utils";
import { requireUser } from "@/lib/auth";
import type { ActionState } from "@/components/admin/ui";
import { bool, done, fail, int, refresh, str, uuidOrNull } from "./helpers";

/* FAQ, testimonials, client names and catalogues share one ordered-list pattern. */

const TABLES = {
  faqs: schema.faqs,
  testimonials: schema.testimonials,
  clients: schema.clients,
  catalogs: schema.catalogs,
} as const;
type Kind = keyof typeof TABLES;

function kindOf(fd: FormData): Kind | null {
  const k = str(fd, "kind");
  return k in TABLES ? (k as Kind) : null;
}

async function readValues(kind: Kind, fd: FormData): Promise<{ values?: Record<string, unknown>; error?: string }> {
  const isPublished = bool(fd, "isPublished");
  if (kind === "catalogs") {
    const title = str(fd, "title", 160);
    const fileId = uuidOrNull(fd, "fileId");
    if (!title) return { error: "عنوان کاتالوگ الزامی است." };
    if (!fileId) return { error: "فایل کاتالوگ را بارگذاری کنید." };
    const [file] = await db.select({ mime: schema.media.mime }).from(schema.media).where(eq(schema.media.id, fileId)).limit(1);
    if (file?.mime !== "application/pdf") return { error: "فایل کاتالوگ پیدا نشد؛ دوباره بارگذاری کنید." };
    const pages = int(fd, "pages");
    return {
      values: {
        title,
        description: str(fd, "description", 1000),
        highlights: str(fd, "highlights", 3000).split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 12),
        edition: str(fd, "edition", 80),
        pages: pages > 0 ? pages : null,
        fileId,
        coverMediaId: uuidOrNull(fd, "coverMediaId"),
        isPublished,
      },
    };
  }
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
  const { values, error } = await readValues(kind, fd);
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
  if (kind === "catalogs") await sweepCatalogFiles();
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
  if (kind === "catalogs") await sweepCatalogFiles();
  refresh(kind);
  return done("حذف شد.");
}

/* Catalogue files no catalogue points at: replaced, deleted, or uploaded
   into a form that was never saved. A day's grace spares an upload
   another editor is about to save. */
function sweepCatalogFiles() {
  const m = schema.media, c = schema.catalogs;
  return db.delete(m).where(and(
    eq(m.mime, "application/pdf"),
    lt(m.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)),
    notExists(db.select({ id: c.id }).from(c).where(eq(c.fileId, m.id))),
  ));
}

/** swap position with the previous/next item */
export async function moveItem(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const kind = kindOf(fd);
  const id = int(fd, "id");
  const dir = str(fd, "dir");
  const to = int(fd, "to");
  if (!kind || !(id > 0)) return fail("درخواست نامعتبر است.");
  const table = TABLES[kind];

  await db.transaction(async (tx) => {
    const rows = await tx.select({ id: table.id }).from(table).orderBy(asc(table.sortOrder), asc(table.id));
    const i = rows.findIndex((r) => r.id === id);
    /* one step (↑/↓ buttons) or straight to a 1-based position (the select) */
    if (!moveInPlace(rows, i, dir ? i + (dir === "up" ? -1 : 1) : to - 1)) return;
    /* renumber densely so ordering is always stable */
    for (let k = 0; k < rows.length; k++) await tx.update(table).set({ sortOrder: k }).where(eq(table.id, rows[k].id));
  });
  refresh(kind);
  return { ok: true };
}
