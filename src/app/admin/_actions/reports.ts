"use server";

import { redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";
import type { ReportImage, ReportSection } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { SLUG_RE } from "@/lib/format";
import { REPORT_AUDIENCES } from "@/content/reports";
import { CAPABILITY_CATEGORIES, CONTENT_PAGES } from "@/content/capabilities";
import type { ActionState } from "@/components/admin/ui";
import { bool, done, fail, int, isUniqueViolation, refresh, str, uuidOrNull } from "./helpers";

const sectionsSchema = z
  .array(z.object({
    title: z.string().max(300),
    body: z.array(z.string().max(20_000)).max(100).optional(),
    items: z.array(z.string().max(2_000)).max(200).optional(),
  }))
  .max(50);

const AUDIENCE_KEYS = new Set<string>(REPORT_AUDIENCES.map((a) => a.key));
const PAGE_SLUGS = new Set([...CAPABILITY_CATEGORIES, ...CONTENT_PAGES].map((p) => p.slug));

const clean = (xs: string[] | undefined) => (xs ?? []).map((x) => x.trim()).filter(Boolean);

function readReport(fd: FormData) {
  const errors: Record<string, string> = {};
  const title = str(fd, "title", 255);
  const slug = str(fd, "slug", 120).toLowerCase();
  const status = str(fd, "status") === "published" ? "published" : "draft";
  const question = str(fd, "question", 255);
  const lead = str(fd, "lead", 5_000);
  const categoryId = int(fd, "categoryId");

  let sections: ReportSection[] = [];
  try {
    sections = sectionsSchema.parse(JSON.parse(str(fd, "sections", 500_000) || "[]"))
      .map((s) => ({ title: s.title.trim(), body: clean(s.body), items: clean(s.items) }))
      .filter((s) => s.title || s.body.length || s.items.length);
    if (sections.some((s) => !s.title)) errors.sections = "هر بخش متنی باید تیتر داشته باشد.";
  } catch {
    errors.sections = "ساختار بخش‌های متنی نامعتبر است.";
  }

  /* media ids and captions arrive as two parallel lists, in row order */
  const captions = fd.getAll("galleryCaption").map((c) => String(c).trim().slice(0, 300));
  const gallery: ReportImage[] = fd.getAll("galleryMedia")
    .map((m, i) => ({ mediaId: String(m), caption: captions[i] ?? "" }))
    .filter((g) => /^[0-9a-f-]{36}$/i.test(g.mediaId));

  const audiences = [...new Set(fd.getAll("audiences").map(String))].filter((a) => AUDIENCE_KEYS.has(a));
  const relatedPages = [...new Set(fd.getAll("relatedPages").map(String))].filter((p) => PAGE_SLUGS.has(p));
  const relatedReportIds = [...new Set(fd.getAll("relatedReportIds").map(Number))].filter((n) => Number.isInteger(n) && n > 0);

  if (!title) errors.title = "نام گزارش الزامی است.";
  if (!SLUG_RE.test(slug)) errors.slug = "نامک فقط حروف کوچک انگلیسی، عدد و خط تیره (مثل peak-demand).";
  if (!(categoryId > 0)) errors.categoryId = "دستهٔ گزارش را انتخاب کنید.";
  /* a draft may be half-written; a published page may not */
  if (status === "published") {
    if (!question) errors.question = "برای انتشار، سؤالی که گزارش پاسخ می‌دهد الزامی است.";
    if (!lead) errors.lead = "برای انتشار، متن معرفی الزامی است.";
    if (!audiences.length) errors.audiences = "برای انتشار، حداقل یک مخاطب انتخاب کنید.";
    if (!sections.some((s) => s.body?.length || s.items?.length)) errors.sections ??= "برای انتشار، حداقل یک بخش متنی با محتوا لازم است.";
  }

  const sortOrder = int(fd, "sortOrder");
  return {
    errors,
    values: {
      title,
      slug,
      menuTitle: str(fd, "menuTitle", 120),
      question,
      lead,
      categoryId,
      audiences,
      icon: str(fd, "icon", 40),
      sections,
      gallery,
      relatedReportIds,
      relatedPages,
      /* one per line or comma-separated (Persian or Latin comma) */
      keywords: [...new Set(str(fd, "keywords", 2_000).split(/[\n,،]/).map((k) => k.trim()).filter(Boolean))].slice(0, 50),
      status: status as "draft" | "published",
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      seoTitle: str(fd, "seoTitle", 255),
      seoDescription: str(fd, "seoDescription", 1000),
      ogMediaId: uuidOrNull(fd, "ogMediaId"),
      noindex: bool(fd, "noindex"),
    },
  };
}

export async function saveReport(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = int(fd, "id");
  const { errors, values } = readReport(fd);
  if (Object.keys(errors).length) return fail("لطفاً خطاهای فرم را برطرف کنید.", errors);
  const [category] = await db.select({ id: schema.reportCategories.id }).from(schema.reportCategories)
    .where(eq(schema.reportCategories.id, values.categoryId)).limit(1);
  if (!category) return fail("دستهٔ انتخاب‌شده دیگر وجود ندارد.", { categoryId: "دسته را دوباره انتخاب کنید." });

  let savedId = id;
  try {
    if (id > 0) {
      const [old] = await db.select().from(schema.reports).where(eq(schema.reports.id, id)).limit(1);
      if (!old) return fail("گزارش پیدا نشد.");
      /* a slug that was ever public keeps working: its old address redirects */
      const previousSlugs = old.slug !== values.slug && old.publishedAt
        ? [...new Set([...old.previousSlugs, old.slug])].filter((s) => s !== values.slug)
        : old.previousSlugs.filter((s) => s !== values.slug);
      await db.update(schema.reports).set({
        ...values,
        relatedReportIds: values.relatedReportIds.filter((r) => r !== id),
        previousSlugs,
        publishedAt: old.publishedAt ?? (values.status === "published" ? new Date() : null),
      }).where(eq(schema.reports.id, id));
    } else {
      const [row] = await db.insert(schema.reports).values({
        ...values,
        publishedAt: values.status === "published" ? new Date() : null,
      }).returning({ id: schema.reports.id });
      savedId = row.id;
    }
  } catch (e) {
    if (isUniqueViolation(e)) return fail("این نامک قبلاً برای گزارش دیگری استفاده شده است.", { slug: "نامک تکراری است." });
    throw e;
  }

  refresh("reports");
  if (!(id > 0)) redirect(`/admin/reports/${savedId}?created=1`);
  return done(values.status === "published" ? "ذخیره و منتشر شد." : "پیش‌نویس ذخیره شد.");
}

export async function deleteReport(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = int(fd, "id");
  if (!(id > 0)) return fail("شناسه نامعتبر است.");
  await db.delete(schema.reports).where(eq(schema.reports.id, id));
  refresh("reports");
  redirect("/admin/reports?deleted=1");
}

/* ── Categories ── */

export async function saveReportCategory(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = int(fd, "id");
  const name = str(fd, "name", 120);
  const slug = str(fd, "slug", 120).toLowerCase();
  if (!name) return fail("نام دسته الزامی است.");
  if (!SLUG_RE.test(slug)) return fail("نامک فقط حروف کوچک انگلیسی، عدد و خط تیره.");
  const sortOrder = int(fd, "sortOrder");
  const values = {
    name,
    slug,
    question: str(fd, "question", 255),
    icon: str(fd, "icon", 40),
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
  };
  try {
    if (id > 0) await db.update(schema.reportCategories).set(values).where(eq(schema.reportCategories.id, id));
    else await db.insert(schema.reportCategories).values(values);
  } catch (e) {
    if (isUniqueViolation(e)) return fail("این نامک تکراری است.");
    throw e;
  }
  refresh("reports");
  return done(id > 0 ? "دسته به‌روزرسانی شد." : "دسته اضافه شد.");
}

export async function deleteReportCategory(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = int(fd, "id");
  if (!(id > 0)) return fail("شناسه نامعتبر است.");
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(schema.reports).where(eq(schema.reports.categoryId, id));
  if (n > 0) return fail("این دسته هنوز گزارش دارد. ابتدا گزارش‌های آن را به دستهٔ دیگری منتقل کنید.");
  await db.delete(schema.reportCategories).where(eq(schema.reportCategories.id, id));
  refresh("reports");
  return done("دسته حذف شد.");
}
