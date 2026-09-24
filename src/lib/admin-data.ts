import "server-only";
import { asc, desc, eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { SECTIONS, SECTION_BY_KEY } from "@/content/sections";
import { CAPABILITY_CATEGORIES, CONTENT_PAGES } from "@/content/capabilities";
import { pageKind } from "@/content/reports";

/* Uncached reads for the admin panel (always fresh). */

export const listMediaOptions = () =>
  db.select({ id: schema.media.id, filename: schema.media.filename, alt: schema.media.alt })
    .from(schema.media).orderBy(desc(schema.media.createdAt));

export const listCategories = () =>
  db.select().from(schema.categories).orderBy(asc(schema.categories.sortOrder), asc(schema.categories.id));

export async function listArticles(status?: "draft" | "published") {
  return db
    .select({
      id: schema.articles.id, slug: schema.articles.slug, title: schema.articles.title, status: schema.articles.status,
      featured: schema.articles.featured, publishedAt: schema.articles.publishedAt, updatedAt: schema.articles.updatedAt,
      category: schema.categories.name, noindex: schema.articles.noindex,
    })
    .from(schema.articles)
    .leftJoin(schema.categories, eq(schema.articles.categoryId, schema.categories.id))
    .where(status ? eq(schema.articles.status, status) : undefined)
    .orderBy(desc(schema.articles.updatedAt));
}

export async function dashboardCounts() {
  const count = (t: typeof schema.faqs | typeof schema.testimonials | typeof schema.clients | typeof schema.media | typeof schema.categories) =>
    db.select({ n: sql<number>`count(*)::int` }).from(t).then((r) => r[0].n);
  const [statuses, faqs, testimonials, clients, media] = await Promise.all([
    db.select({ status: schema.articles.status, n: sql<number>`count(*)::int` }).from(schema.articles).groupBy(schema.articles.status),
    count(schema.faqs), count(schema.testimonials), count(schema.clients), count(schema.media),
  ]);
  return {
    published: statuses.find((s) => s.status === "published")?.n ?? 0,
    drafts: statuses.find((s) => s.status === "draft")?.n ?? 0,
    faqs, testimonials, clients, media,
  };
}

/* ── Navigation & sections (admin views are always uncached) ── */

export const listNavItems = () =>
  db.select().from(schema.navItems).orderBy(asc(schema.navItems.sortOrder), asc(schema.navItems.id));

/**
 * Materialise a section's factory content the first time the panel
 * touches it. Public pages already fall back to the same defaults, so
 * this only turns "default" into "editable" — the visible site does
 * not change.
 */
export async function ensureSection(key: string) {
  const def = SECTION_BY_KEY[key];
  if (!def) return;
  const [row] = await db.select({ key: schema.contentSections.key }).from(schema.contentSections)
    .where(eq(schema.contentSections.key, key)).limit(1);
  if (row) return;

  const d = def.defaults;
  await db.transaction(async (tx) => {
    const inserted = await tx.insert(schema.contentSections).values({
      key,
      eyebrow: d.eyebrow ?? "",
      title: d.title ?? "",
      description: d.description ?? "",
      ctaLabel: d.ctaLabel ?? "",
      ctaHref: d.ctaHref ?? "",
      videoUrl: d.videoUrl ?? "",
      videoEnabled: d.videoEnabled ?? false,
    }).onConflictDoNothing().returning({ key: schema.contentSections.key });
    if (!inserted.length || !d.items?.length) return;
    await tx.insert(schema.contentItems).values(d.items.map((i, idx) => ({
      sectionKey: key,
      title: i.title,
      description: i.description ?? "",
      icon: i.icon ?? "",
      tag: i.tag ?? "",
      href: i.href ?? "",
      bullets: i.bullets ?? [],
      sortOrder: idx,
    })));
  });
}

export async function loadSectionForAdmin(key: string) {
  await ensureSection(key);
  const [[section], items] = await Promise.all([
    db.select().from(schema.contentSections).where(eq(schema.contentSections.key, key)).limit(1),
    db.select().from(schema.contentItems).where(eq(schema.contentItems.sectionKey, key))
      .orderBy(asc(schema.contentItems.sortOrder), asc(schema.contentItems.id)),
  ]);
  return { section: section ?? null, items };
}

export async function sectionSummaries() {
  const rows = await db.select({
    key: schema.contentSections.key,
    isActive: schema.contentSections.isActive,
    updatedAt: schema.contentSections.updatedAt,
  }).from(schema.contentSections);
  const counts = await db.select({
    key: schema.contentItems.sectionKey,
    n: sql<number>`count(*) filter (where ${schema.contentItems.isActive})::int`,
  }).from(schema.contentItems).groupBy(schema.contentItems.sectionKey);
  return SECTIONS.map((def) => {
    const row = rows.find((r) => r.key === def.key);
    return {
      def,
      isActive: row?.isActive ?? true,
      updatedAt: row?.updatedAt ?? null,
      items: counts.find((c) => c.key === def.key)?.n ?? (row ? 0 : def.defaults.items?.length ?? 0),
      inDatabase: Boolean(row),
    };
  });
}

/* ── Report catalogue ── */

export const listReportCategories = () =>
  db.select({
    c: schema.reportCategories,
    n: sql<number>`(select count(*)::int from ${schema.reports} where ${schema.reports.categoryId} = ${schema.reportCategories.id})`,
  })
    .from(schema.reportCategories)
    .orderBy(asc(schema.reportCategories.sortOrder), asc(schema.reportCategories.id));

/** every report, any status, in public menu order */
export const listReports = () =>
  db.select({
    id: schema.reports.id, slug: schema.reports.slug, title: schema.reports.title, menuTitle: schema.reports.menuTitle,
    status: schema.reports.status, noindex: schema.reports.noindex, updatedAt: schema.reports.updatedAt,
    categoryId: schema.reports.categoryId, category: schema.reportCategories.name,
  })
    .from(schema.reports)
    .innerJoin(schema.reportCategories, eq(schema.reports.categoryId, schema.reportCategories.id))
    .orderBy(
      asc(schema.reportCategories.sortOrder), asc(schema.reportCategories.id),
      asc(schema.reports.sortOrder), asc(schema.reports.id),
    );

const PAGE_GROUP = { "قابلیت": "قابلیت‌های مرتبط", "راهکار": "راهکارهای مرتبط", "صنعت": "صنایع مرتبط" } as const;

/** landing pages a report may link to, grouped for the editor */
export const relatedPageOptions = () =>
  [...CAPABILITY_CATEGORIES, ...CONTENT_PAGES]
    .filter((p) => p.status !== "coming-soon")
    .map((p) => ({ slug: p.slug, title: p.title, group: PAGE_GROUP[pageKind(p.slug)] }));
