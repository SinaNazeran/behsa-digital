/* Idempotent seed: imports the content that was hardcoded in the Vite app.
   Existing rows (matched by slug / key) are left untouched, so it is safe
   to re-run after editors have changed content. */
import { sql } from "drizzle-orm";
import { connect } from "./_db";
import { ARTICLE_CATS, ARTICLES, FAQ_ITEMS } from "./seed-data";
import { parseJalaliLabel } from "../src/lib/format";
import { DEFAULT_SETTINGS } from "../src/content/defaults";
import { DEFAULT_NAV } from "../src/content/navigation";
import { SECTIONS } from "../src/content/sections";

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
