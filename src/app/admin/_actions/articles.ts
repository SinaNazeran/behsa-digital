"use server";

import { redirect } from "next/navigation";
import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";
import type { ArticleSection } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { SLUG_RE } from "@/lib/format";
import type { ActionState } from "@/components/admin/ui";
import { bool, done, fail, int, isUniqueViolation, parseJalaliInput, refresh, str, uuidOrNull } from "./helpers";

const sectionsSchema = z
  .array(z.object({ h: z.string().max(300).optional(), p: z.array(z.string().max(20_000)).max(100) }))
  .max(100);

function readArticle(fd: FormData) {
  const errors: Record<string, string> = {};
  const title = str(fd, "title", 255);
  const slug = str(fd, "slug", 160).toLowerCase();
  const status = str(fd, "status") === "published" ? "published" : "draft";
  const chart = str(fd, "chartStyle");

  let body: ArticleSection[] = [];
  try {
    body = sectionsSchema.parse(JSON.parse(str(fd, "body", 500_000) || "[]"))
      .map((s) => ({ ...(s.h?.trim() ? { h: s.h.trim() } : {}), p: s.p.map((x) => x.trim()).filter(Boolean) }))
      .filter((s) => s.h || s.p.length);
  } catch {
    errors.body = "ساختار متن مقاله نامعتبر است.";
  }

  const dateRaw = str(fd, "publishedDate", 20);
  const publishedAt = dateRaw ? parseJalaliInput(dateRaw, str(fd, "publishedTime", 5)) : null;

  if (!title) errors.title = "عنوان الزامی است.";
  if (!SLUG_RE.test(slug)) errors.slug = "نامک فقط حروف کوچک انگلیسی، عدد و خط تیره (مثل demand-penalty).";
  if (dateRaw && !publishedAt) errors.publishedDate = "تاریخ انتشار را به شکل ۱۴۰۴/۰۸/۱۸ وارد کنید.";
  if (status === "published" && body.length === 0) errors.body = "برای انتشار، متن مقاله نمی‌تواند خالی باشد.";

  const canonicalUrl = str(fd, "canonicalUrl", 500);
  if (canonicalUrl && !/^https?:\/\/\S+$/.test(canonicalUrl)) errors.canonicalUrl = "آدرس Canonical باید کامل و با https:// باشد.";

  const categoryId = int(fd, "categoryId");

  return {
    errors,
    values: {
      title,
      slug,
      excerpt: str(fd, "excerpt", 1000),
      body,
      categoryId: Number.isInteger(categoryId) && categoryId > 0 ? categoryId : null,
      authorName: str(fd, "authorName", 120) || "تیم تحلیل بهسا",
      chartStyle: (["line", "bars", "donut", "area"].includes(chart) ? chart : "area") as "line" | "bars" | "donut" | "area",
      coverMediaId: uuidOrNull(fd, "coverMediaId"),
      status: status as "draft" | "published",
      featured: bool(fd, "featured"),
      publishedAt: publishedAt ?? (status === "published" ? new Date() : null),
      seoTitle: str(fd, "seoTitle", 255),
      seoDescription: str(fd, "seoDescription", 1000),
      ogMediaId: uuidOrNull(fd, "ogMediaId"),
      canonicalUrl,
      noindex: bool(fd, "noindex"),
    },
  };
}

export async function saveArticle(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = int(fd, "id");
  const { errors, values } = readArticle(fd);
  if (Object.keys(errors).length) return fail("لطفاً خطاهای فرم را برطرف کنید.", errors);

  let savedId = id;
  try {
    await db.transaction(async (tx) => {
      if (id > 0) {
        const res = await tx.update(schema.articles).set(values).where(eq(schema.articles.id, id)).returning({ id: schema.articles.id });
        if (!res.length) throw new Error("NOT_FOUND");
      } else {
        const [row] = await tx.insert(schema.articles).values(values).returning({ id: schema.articles.id });
        savedId = row.id;
      }
      /* only one featured article at a time */
      if (values.featured) {
        await tx.update(schema.articles).set({ featured: false }).where(and(eq(schema.articles.featured, true), ne(schema.articles.id, savedId)));
      }
    });
  } catch (e) {
    if (isUniqueViolation(e)) return fail("این نامک قبلاً برای مقاله دیگری استفاده شده است.", { slug: "نامک تکراری است." });
    if (e instanceof Error && e.message === "NOT_FOUND") return fail("مقاله پیدا نشد.");
    throw e;
  }

  refresh("articles");
  if (!(id > 0)) redirect(`/admin/articles/${savedId}?created=1`);
  return done(values.status === "published" ? "ذخیره و منتشر شد." : "پیش‌نویس ذخیره شد.");
}

export async function deleteArticle(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = int(fd, "id");
  if (!(id > 0)) return fail("شناسه نامعتبر است.");
  await db.delete(schema.articles).where(eq(schema.articles.id, id));
  refresh("articles");
  redirect("/admin/articles?deleted=1");
}

/* ── Categories ── */

export async function saveCategory(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = int(fd, "id");
  const name = str(fd, "name", 120);
  const slug = str(fd, "slug", 120).toLowerCase();
  if (!name) return fail("نام دسته الزامی است.");
  if (!SLUG_RE.test(slug)) return fail("نامک فقط حروف کوچک انگلیسی، عدد و خط تیره.");
  const values = { name, slug, description: str(fd, "description", 1000), sortOrder: Number.isFinite(int(fd, "sortOrder")) ? int(fd, "sortOrder") : 0 };
  try {
    if (id > 0) await db.update(schema.categories).set(values).where(eq(schema.categories.id, id));
    else await db.insert(schema.categories).values(values);
  } catch (e) {
    if (isUniqueViolation(e)) return fail("این نامک تکراری است.");
    throw e;
  }
  refresh("categories", "articles");
  return done(id > 0 ? "دسته به‌روزرسانی شد." : "دسته اضافه شد.");
}

export async function deleteCategory(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = int(fd, "id");
  if (!(id > 0)) return fail("شناسه نامعتبر است.");
  await db.delete(schema.categories).where(eq(schema.categories.id, id));
  refresh("categories", "articles");
  return done("دسته حذف شد؛ مقالات آن بدون دسته ماندند.");
}
