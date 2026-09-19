"use server";

import { asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { isIconName } from "@/components/icons";
import { SECTION_BY_KEY, type ItemFieldName, type SectionDef } from "@/content/sections";
import { ensureSection } from "@/lib/admin-data";
import type { ActionState } from "@/components/admin/ui";
import { bool, done, fail, int, isSafeHref, refresh, str, uuidOrNull } from "./helpers";

/* Editable page sections. What an editor may change is declared in the
   section registry (src/content/sections.ts); anything not declared for
   a section is ignored here, so a crafted form cannot reach fields the
   section does not own. */

const MAX_BULLETS = 20;

function defOf(fd: FormData): SectionDef | null {
  return SECTION_BY_KEY[str(fd, "key", 48)] ?? null;
}

export async function saveSection(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const def = defOf(fd);
  if (!def) return fail("این بخش شناخته نشد.");

  const errors: Record<string, string> = {};
  const values: Record<string, unknown> = { isActive: bool(fd, "isActive"), updatedAt: new Date() };

  if (def.header.eyebrow) values.eyebrow = str(fd, "eyebrow", 120);
  if (def.header.title) values.title = str(fd, "title", 500);
  if (def.header.description) values.description = str(fd, "description", 2000);
  if (def.header.cta) {
    const ctaHref = str(fd, "ctaHref", 500);
    if (!isSafeHref(ctaHref)) errors.ctaHref = "آدرس دکمه باید با / یا https:// شروع شود.";
    values.ctaLabel = str(fd, "ctaLabel", 120);
    values.ctaHref = ctaHref;
  }
  if (def.header.media) {
    values.mediaId = uuidOrNull(fd, "mediaId");
    values.mobileMediaId = uuidOrNull(fd, "mobileMediaId");
  }
  if (def.header.video) {
    const videoUrl = str(fd, "videoUrl", 500);
    if (!isSafeHref(videoUrl)) errors.videoUrl = "آدرس ویدئو باید با / یا https:// شروع شود.";
    values.videoUrl = videoUrl;
    values.videoEnabled = bool(fd, "videoEnabled");
  }
  if (Object.keys(errors).length) return fail("لطفاً خطاهای فرم را برطرف کنید.", errors);

  await db.insert(schema.contentSections).values({ key: def.key, ...values })
    .onConflictDoUpdate({ target: schema.contentSections.key, set: values });
  refresh("content");
  return done("ذخیره شد.");
}

function readItemValues(def: SectionDef, fd: FormData) {
  const fields = new Set<ItemFieldName>((def.items?.fields ?? []).map((f) => f.name));
  const errors: Record<string, string> = {};
  const title = str(fd, "title", 255);
  if (!title) errors.title = `${def.items?.titleLabel ?? "عنوان"} الزامی است.`;

  const values: Record<string, unknown> = { title, updatedAt: new Date(), isActive: bool(fd, "isActive") };

  if (fields.has("description")) values.description = str(fd, "description", 2000);
  if (fields.has("icon")) {
    const icon = str(fd, "icon", 40);
    values.icon = isIconName(icon) ? icon : "";
  }
  if (fields.has("tag")) values.tag = str(fd, "tag", 120);
  if (fields.has("href")) {
    const href = str(fd, "href", 500);
    if (!isSafeHref(href)) errors.href = "آدرس باید با / یا https:// شروع شود.";
    values.href = href;
  }
  if (fields.has("bullets")) {
    values.bullets = str(fd, "bullets", 4000)
      .split("\n").map((l) => l.trim()).filter(Boolean).slice(0, MAX_BULLETS)
      .map((l) => l.slice(0, 200));
  }
  if (fields.has("image")) values.mediaId = uuidOrNull(fd, "mediaId");

  return { errors, values };
}

export async function saveSectionItem(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const def = defOf(fd);
  if (!def?.items) return fail("این بخش آیتم ندارد.");
  const { errors, values } = readItemValues(def, fd);
  if (Object.keys(errors).length) return fail("لطفاً خطاهای فرم را برطرف کنید.", errors);

  const id = int(fd, "id");
  if (id > 0) {
    const res = await db.update(schema.contentItems).set(values)
      .where(eq(schema.contentItems.id, id)).returning({ id: schema.contentItems.id });
    if (!res.length) return fail("این مورد دیگر وجود ندارد.");
  } else {
    await ensureSection(def.key);
    const rows = await db.select({ s: schema.contentItems.sortOrder }).from(schema.contentItems)
      .where(eq(schema.contentItems.sectionKey, def.key));
    const next = rows.reduce((m, r) => Math.max(m, r.s), -1) + 1;
    await db.insert(schema.contentItems).values({ ...values, sectionKey: def.key, sortOrder: next } as never);
  }
  refresh("content");
  return done(id > 0 ? "ذخیره شد." : "اضافه شد.");
}

export async function deleteSectionItem(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = int(fd, "id");
  if (!(id > 0)) return fail("شناسه نامعتبر است.");
  await db.delete(schema.contentItems).where(eq(schema.contentItems.id, id));
  refresh("content");
  return done("حذف شد.");
}

export async function moveSectionItem(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const def = defOf(fd);
  const id = int(fd, "id");
  const dir = str(fd, "dir") === "up" ? -1 : 1;
  if (!def || !(id > 0)) return fail("درخواست نامعتبر است.");

  await db.transaction(async (tx) => {
    const rows = await tx.select({ id: schema.contentItems.id }).from(schema.contentItems)
      .where(eq(schema.contentItems.sectionKey, def.key))
      .orderBy(asc(schema.contentItems.sortOrder), asc(schema.contentItems.id));
    const i = rows.findIndex((r) => r.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= rows.length) return;
    [rows[i], rows[j]] = [rows[j], rows[i]];
    for (let k = 0; k < rows.length; k++) {
      await tx.update(schema.contentItems).set({ sortOrder: k }).where(eq(schema.contentItems.id, rows[k].id));
    }
  });
  refresh("content");
  return { ok: true };
}

/** put a section (and its items) back to the factory content */
export async function resetSection(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const def = defOf(fd);
  if (!def) return fail("این بخش شناخته نشد.");
  await db.transaction(async (tx) => {
    await tx.delete(schema.contentItems).where(eq(schema.contentItems.sectionKey, def.key));
    await tx.delete(schema.contentSections).where(eq(schema.contentSections.key, def.key));
  });
  await ensureSection(def.key);
  refresh("content");
  return done("محتوای پیش‌فرض این بخش بازگردانده شد.");
}
