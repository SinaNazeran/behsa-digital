/* Idempotent seed: imports the content that was hardcoded in the Vite app.
   Existing rows (matched by slug / key) are left untouched, so it is safe
   to re-run after editors have changed content. */
import { eq, sql } from "drizzle-orm";
import { connect } from "./_db";
import { ARTICLE_CATS, ARTICLES, FAQ_ITEMS } from "./seed-data";
import { parseJalaliLabel } from "../src/lib/format";
import { DEFAULT_SETTINGS } from "../src/content/defaults";
import { DEFAULT_NAV } from "../src/content/navigation";
import { SECTIONS } from "../src/content/sections";
import { REPORT_AUDIENCE, REPORT_CATEGORIES, REPORT_MENU, REPORT_PAGES } from "./seed-reports";

const CAT_SLUGS: Record<string, string> = {
  "مدیریت انرژی": "energy-management",
  "مدیریت دیماند": "demand-management",
  "توان راکتیو": "reactive-power",
  "خرید برق": "electricity-purchase",
  "انرژی خورشیدی": "solar-energy",
  "کیفیت برق": "power-quality",
  "آموزش": "education",
  "اخبار و قوانین": "news-regulations",
};

const { client, db, schema } = connect();

await db.transaction(async (tx) => {
  /* settings */
  await tx.insert(schema.siteSettings).values({ key: "site", value: DEFAULT_SETTINGS }).onConflictDoNothing();

  /* categories */
  const cats = ARTICLE_CATS.filter((c) => c !== "همه");
  await tx.insert(schema.categories)
    .values(cats.map((name, i) => ({ name, slug: CAT_SLUGS[name] ?? `category-${i + 1}`, sortOrder: i })))
    .onConflictDoNothing();
  const catRows = await tx.select().from(schema.categories);
  const catId = (name: string) => catRows.find((c) => c.name === name)?.id ?? null;

  /* articles */
  await tx.insert(schema.articles).values(ARTICLES.map((a, i) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    body: a.body,
    categoryId: catId(a.cat),
    authorName: a.author,
    chartStyle: a.chart,
    status: "published" as const,
    featured: i === 0,
    publishedAt: parseJalaliLabel(a.date) ?? new Date(),
  }))).onConflictDoNothing();

  /* ordered collections — only when empty */
  const [{ n: faqCount }] = await tx.select({ n: sql<number>`count(*)::int` }).from(schema.faqs);
  if (faqCount === 0) await tx.insert(schema.faqs).values(FAQ_ITEMS.map((f, i) => ({ question: f.q, answer: f.a, sortOrder: i })));

  /* testimonials and clients are deliberately NOT seeded: the site must
     never ship invented customer names or quotes. Both tables are filled
     only with real, permission-cleared entries
     (docs/content-strategy.md §Trust / Proof Strategy). */

  /* navigation — only when the menu has never been stored */
  const [{ n: navCount }] = await tx.select({ n: sql<number>`count(*)::int` }).from(schema.navItems);
  if (navCount === 0) {
    for (const [si, section] of DEFAULT_NAV.entries()) {
      const [row] = await tx.insert(schema.navItems).values({
        label: section.label, href: section.href, description: section.description ?? "", icon: section.icon ?? "",
        kind: section.kind, lens: section.lens, openInNewTab: section.newTab ?? false,
        introTitle: section.intro?.title ?? "", introDescription: section.intro?.description ?? "",
        introCtaLabel: section.intro?.ctaLabel ?? "", introCtaHref: section.intro?.ctaHref ?? "",
        sortOrder: si,
      }).returning({ id: schema.navItems.id });
      if (section.items.length) {
        await tx.insert(schema.navItems).values(section.items.map((i, ii) => ({
          parentId: row.id, label: i.label, href: i.href, description: i.description ?? "",
          icon: i.icon ?? "", openInNewTab: i.newTab ?? false, sortOrder: ii,
          isActive: i.isActive ?? true,
        })));
      }
    }
  }

/* report catalogue — only into empty tables, so categories or reports the
     content team deleted are never brought back */
  const [{ n: catCount }] = await tx.select({ n: sql<number>`count(*)::int` }).from(schema.reportCategories);
  const [{ n: reportCount }] = await tx.select({ n: sql<number>`count(*)::int` }).from(schema.reports);
  if (catCount === 0 && reportCount === 0) {
    const now = new Date();
    for (const [ci, cat] of REPORT_CATEGORIES.entries()) {
      const [row] = await tx.insert(schema.reportCategories)
        .values({ slug: cat.slug, name: cat.name, question: cat.question, icon: cat.icon, sortOrder: ci })
        .returning({ id: schema.reportCategories.id });
      for (const [ri, id] of cat.reports.entries()) {
        const page = REPORT_PAGES.find((p) => p.id === id);
        if (!page) throw new Error(`seed: unknown report ${id}`);
        const menu = REPORT_MENU[page.href];
        await tx.insert(schema.reports).values({
          slug: page.slug.slice("reports/".length),
          title: page.title,
          menuTitle: menu?.label ?? "",
          /* the menu line is the short question; the page description is the lead */
          question: menu?.question ?? "",
          lead: page.description ?? "",
          categoryId: row.id,
          audiences: REPORT_AUDIENCE[id] ?? [],
          icon: page.icon,
          sections: page.sections ?? [],
          relatedPages: (page.links ?? []).map((l) => l.slug).filter((s) => !s.startsWith("reports/")),
          status: "published",
          sortOrder: ri,
          publishedAt: now,
        });
      }
    }
    /* related reports need every id to exist first */
    const rows = await tx.select({ id: schema.reports.id, slug: schema.reports.slug }).from(schema.reports);
    for (const page of REPORT_PAGES) {
      const ids = (page.links ?? [])
        .filter((l) => l.slug.startsWith("reports/"))
        .map((l) => rows.find((r) => `reports/${r.slug}` === l.slug)?.id)
        .filter((x): x is number => x !== undefined);
      if (ids.length) {
        await tx.update(schema.reports).set({ relatedReportIds: ids })
          .where(eq(schema.reports.slug, page.slug.slice("reports/".length)));
      }
    }
  }

  /* editable page sections — per section, only when it is missing, so
     an editor's changes to one section never block seeding another */
  const existing = new Set((await tx.select({ key: schema.contentSections.key }).from(schema.contentSections)).map((r) => r.key));
  for (const def of SECTIONS) {
    if (existing.has(def.key)) continue;
    const d = def.defaults;
    await tx.insert(schema.contentSections).values({
      key: def.key,
      eyebrow: d.eyebrow ?? "", title: d.title ?? "", description: d.description ?? "",
      ctaLabel: d.ctaLabel ?? "", ctaHref: d.ctaHref ?? "",
      videoUrl: d.videoUrl ?? "", videoEnabled: d.videoEnabled ?? false,
      isActive: d.isActive ?? true,
    });
    if (d.items?.length) {
      await tx.insert(schema.contentItems).values(d.items.map((i, idx) => ({
        sectionKey: def.key, title: i.title, description: i.description ?? "", icon: i.icon ?? "",
        tag: i.tag ?? "", href: i.href ?? "", bullets: i.bullets ?? [], sortOrder: idx,
      })));
    }
  }
});

console.log("✔ seed complete");
await client.end();
