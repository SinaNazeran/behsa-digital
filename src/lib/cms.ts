import "server-only";
import { unstable_cache } from "next/cache";
import { and, asc, desc, eq, lte } from "drizzle-orm";
import { db, schema } from "@/db";
import type { ArticleSection, ChartStyle, SiteSettings } from "@/db/schema";
import { DEFAULT_SETTINGS } from "@/content/defaults";
import {
  CROSS_LINKS, DEFAULT_NAV, isExternalHref, slugOf,
  type LandingNode, type NavItemView, type NavSectionView,
} from "@/content/navigation";
import { SECTIONS, SECTION_BY_KEY } from "@/content/sections";
import type { IconName } from "@/components/icons";
import { formatJalali, readingTime } from "@/lib/format";

/* ════════════════════════════════════════════════════════════════
   Public read layer. Every query is cached and tagged; admin Server
   Actions call updateTag(TAGS.x) so edits appear immediately.
   ════════════════════════════════════════════════════════════════ */

export const TAGS = {
  articles: "cms:articles",
  categories: "cms:categories",
  faqs: "cms:faqs",
  testimonials: "cms:testimonials",
  clients: "cms:clients",
  settings: "cms:settings",
  seo: "cms:seo",
  nav: "cms:nav",
  content: "cms:content",
} as const;

const HOUR = 3600;

/* `next build` runs with no database (the Dockerfile builds before any
   DATABASE_URL exists), and the public pages are prerendered. During the
   build only, a failed read falls back to the same factory defaults an
   un-seeded install renders, and the first request after deploy revalidates
   it with real data. At runtime the error still propagates — ISR keeps
   serving the last good HTML while it retries, which is the honest
   behaviour; silently serving defaults would hide a real outage. */
async function orDefault<T>(query: () => PromiseLike<T>, fallback: () => T): Promise<T> {
  try {
    return await query();
  } catch (e) {
    if (process.env.NEXT_PHASE !== "phase-production-build") throw e;
    return fallback();
  }
}

/* ── Types handed to UI components (serialisable) ── */

export type ArticleView = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cat: string;
  catSlug: string | null;
  author: string;
  chart: ChartStyle;
  body: ArticleSection[];
  featured: boolean;
  /** Persian display date */
  date: string;
  /** ISO for <time> and JSON-LD */
  publishedAt: string | null;
  updatedAt: string;
  read: string;
  coverUrl: string | null;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string | null;
  canonicalUrl: string;
  noindex: boolean;
  status: "draft" | "published";
};

export const mediaUrl = (id: string | null | undefined) => (id ? `/media/${id}` : null);

type ArticleRow = typeof schema.articles.$inferSelect & { category: typeof schema.categories.$inferSelect | null };

function toView(a: ArticleRow): ArticleView {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    cat: a.category?.name ?? "مقاله",
    catSlug: a.category?.slug ?? null,
    author: a.authorName,
    chart: a.chartStyle,
    body: a.body,
    featured: a.featured,
    date: formatJalali(a.publishedAt ?? a.createdAt),
    publishedAt: a.publishedAt?.toISOString() ?? null,
    updatedAt: a.updatedAt.toISOString(),
    read: readingTime(a.body.flatMap((s) => [s.h ?? "", ...s.p])),
    coverUrl: mediaUrl(a.coverMediaId),
    seoTitle: a.seoTitle,
    seoDescription: a.seoDescription,
    ogImageUrl: mediaUrl(a.ogMediaId ?? a.coverMediaId),
    canonicalUrl: a.canonicalUrl,
    noindex: a.noindex,
    status: a.status,
  };
}

const publishedWhere = () =>
  and(eq(schema.articles.status, "published"), lte(schema.articles.publishedAt, new Date()));

/* ── Articles ── */

export const getPublishedArticles = unstable_cache(
  async (): Promise<ArticleView[]> => {
    const rows = await orDefault(() => db
      .select({ a: schema.articles, c: schema.categories })
      .from(schema.articles)
      .leftJoin(schema.categories, eq(schema.articles.categoryId, schema.categories.id))
      .where(publishedWhere())
      .orderBy(desc(schema.articles.publishedAt)), () => []);
    return rows.map((r) => toView({ ...r.a, category: r.c }));
  },
  ["published-articles"],
  { tags: [TAGS.articles, TAGS.categories], revalidate: HOUR },
);

export const getArticleBySlug = unstable_cache(
  async (slug: string): Promise<ArticleView | null> => {
    const [row] = await db
      .select({ a: schema.articles, c: schema.categories })
      .from(schema.articles)
      .leftJoin(schema.categories, eq(schema.articles.categoryId, schema.categories.id))
      .where(and(eq(schema.articles.slug, slug), publishedWhere()))
      .limit(1);
    return row ? toView({ ...row.a, category: row.c }) : null;
  },
  ["article-by-slug"],
  { tags: [TAGS.articles, TAGS.categories], revalidate: HOUR },
);

/** uncached, ignores status — only for authenticated draft preview */
export async function getArticleForPreview(slug: string): Promise<ArticleView | null> {
  const [row] = await db
    .select({ a: schema.articles, c: schema.categories })
    .from(schema.articles)
    .leftJoin(schema.categories, eq(schema.articles.categoryId, schema.categories.id))
    .where(eq(schema.articles.slug, slug))
    .limit(1);
  return row ? toView({ ...row.a, category: row.c }) : null;
}

export const getCategories = unstable_cache(
  async () => orDefault(() => db.select().from(schema.categories).orderBy(asc(schema.categories.sortOrder), asc(schema.categories.id)), () => []),
  ["categories"],
  { tags: [TAGS.categories], revalidate: HOUR },
);

/* ── Collections ── */

export const getFaqs = unstable_cache(
  async () =>
    (await orDefault(() => db.select().from(schema.faqs).where(eq(schema.faqs.isPublished, true)).orderBy(asc(schema.faqs.sortOrder), asc(schema.faqs.id)), () => []))
      .map((f) => ({ q: f.question, a: f.answer })),
  ["faqs"],
  { tags: [TAGS.faqs], revalidate: HOUR },
);

export const getTestimonials = unstable_cache(
  async () =>
    (await orDefault(() => db.select().from(schema.testimonials).where(eq(schema.testimonials.isPublished, true)).orderBy(asc(schema.testimonials.sortOrder), asc(schema.testimonials.id)), () => []))
      .map((t) => ({ quote: t.quote, name: t.name, org: t.org })),
  ["testimonials"],
  { tags: [TAGS.testimonials], revalidate: HOUR },
);

export const getClients = unstable_cache(
  async () =>
    (await orDefault(() => db.select().from(schema.clients).where(eq(schema.clients.isPublished, true)).orderBy(asc(schema.clients.sortOrder), asc(schema.clients.id)), () => []))
      .map((c) => c.name),
  ["clients"],
  { tags: [TAGS.clients], revalidate: HOUR },
);

/* ── Settings ── */

export const getSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    const [row] = await orDefault(() => db.select().from(schema.siteSettings).where(eq(schema.siteSettings.key, "site")).limit(1), () => []);
    const value = row?.value ?? DEFAULT_SETTINGS;
    /* empty fields fall back to defaults so the site never renders blanks */
    const merged = { ...DEFAULT_SETTINGS };
    for (const k of Object.keys(DEFAULT_SETTINGS) as (keyof SiteSettings)[]) {
      const v = value[k];
      if (v !== undefined && v !== null && v !== "") (merged as Record<string, unknown>)[k] = v;
    }
    return merged;
  },
  ["site-settings"],
  { tags: [TAGS.settings], revalidate: HOUR },
);

/* ── Page SEO overrides ── */

export const getAllPageSeo = unstable_cache(
  async () => orDefault(() => db.select().from(schema.pageSeo), () => []),
  ["page-seo"],
  { tags: [TAGS.seo], revalidate: HOUR },
);

export async function getPageSeo(path: string) {
  const all = await getAllPageSeo();
  return all.find((p) => p.path === path) ?? null;
}

/* ── Navigation ─────────────────────────────────────────────────
   The menu is editor-managed (`nav_items`). When the table is empty
   — a fresh database that has not been seeded — the factory menu in
   src/content/navigation.ts is used so the site is never menu-less. */

const asIcon = (v: string): IconName | undefined => (v ? (v as IconName) : undefined);

function defaultNavigation(): NavSectionView[] {
  return DEFAULT_NAV.map((s, si) => ({
    id: -(si + 1),
    title: s.label,
    href: s.href,
    description: s.description ?? "",
    icon: s.icon,
    newTab: s.newTab ?? isExternalHref(s.href),
    kind: s.kind,
    lens: s.lens,
    intro: s.intro
      ? { title: s.intro.title, description: s.intro.description, cta: { label: s.intro.ctaLabel, href: s.intro.ctaHref } }
      : null,
    items: s.items.filter((i) => i.isActive !== false).map((i, ii) => ({
      id: -((si + 1) * 100 + ii + 1),
      title: i.label,
      href: i.href,
      description: i.description ?? "",
      icon: i.icon,
      newTab: i.newTab ?? isExternalHref(i.href),
    })),
  }));
}

export const getNavigation = unstable_cache(
  async (): Promise<NavSectionView[]> => {
    const rows = await orDefault(() => db
      .select()
      .from(schema.navItems)
      .where(eq(schema.navItems.isActive, true))
      .orderBy(asc(schema.navItems.sortOrder), asc(schema.navItems.id)), () => []);
    const tops = rows.filter((r) => r.parentId === null);
    if (tops.length === 0) return defaultNavigation();

    return tops.map((s) => ({
      id: s.id,
      title: s.label,
      href: s.href,
      description: s.description,
      icon: asIcon(s.icon),
      newTab: s.openInNewTab || isExternalHref(s.href),
      kind: s.kind,
      lens: s.lens,
      intro: s.introTitle || s.introDescription
        ? {
            title: s.introTitle,
            description: s.introDescription,
            cta: s.introCtaLabel && s.introCtaHref ? { label: s.introCtaLabel, href: s.introCtaHref } : null,
          }
        : null,
      items: rows
        .filter((r) => r.parentId === s.id)
        .map((i): NavItemView => ({
          id: i.id,
          title: i.label,
          href: i.href,
          description: i.description,
          icon: asIcon(i.icon),
          newTab: i.openInNewTab || isExternalHref(i.href),
        })),
    }));
  },
  ["navigation"],
  { tags: [TAGS.nav], revalidate: HOUR },
);

/** every internal menu target that the `/[...slug]` landing template can render */
export async function getLandingIndex(): Promise<Record<string, LandingNode>> {
  const sections = await getNavigation();
  const index: Record<string, LandingNode> = {};

  for (const section of sections) {
    if (isExternalHref(section.href)) continue;
    const parent = { title: section.title, href: section.href, slug: slugOf(section.href) };

    /* the mega intro is itself a landing target (e.g. /product/platform) */
    if (section.intro?.cta && !isExternalHref(section.intro.cta.href)) {
      const slug = slugOf(section.intro.cta.href);
      index[slug] = {
        slug,
        href: section.intro.cta.href,
        title: section.intro.title,
        description: section.intro.description,
        icon: section.items[0]?.icon,
        section: parent,
        links: CROSS_LINKS[slug],
        lens: section.lens,
      };
    }

    index[parent.slug] = {
      slug: parent.slug,
      href: section.href,
      title: section.title,
      description: section.description || section.intro?.description || `مرور ${section.title} بهسا دیجیتال`,
      icon: section.icon ?? section.items[0]?.icon,
      section: parent,
      children: section.items,
      links: CROSS_LINKS[parent.slug],
      lens: section.lens,
    };

    for (const item of section.items) {
      if (isExternalHref(item.href)) continue;
      const slug = slugOf(item.href);
      index[slug] = {
        slug,
        href: item.href,
        title: item.title,
        description: item.description,
        icon: item.icon,
        section: parent,
        links: CROSS_LINKS[slug],
        lens: section.lens,
      };
    }
  }
  return index;
}

/* ── Editable page sections (hero, homepage bands, company strip) ── */

export type SectionItemView = {
  id: number;
  title: string;
  description: string;
  icon?: IconName;
  tag: string;
  href: string;
  bullets: string[];
  imageUrl: string | null;
};

export type SectionView = {
  key: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl: string | null;
  mobileImageUrl: string | null;
  videoUrl: string;
  videoEnabled: boolean;
  isActive: boolean;
  items: SectionItemView[];
};

export type ContentMap = Record<string, SectionView>;

function defaultSection(key: string): SectionView {
  const def = SECTION_BY_KEY[key]?.defaults ?? {};
  return {
    key,
    eyebrow: def.eyebrow ?? "",
    title: def.title ?? "",
    description: def.description ?? "",
    ctaLabel: def.ctaLabel ?? "",
    ctaHref: def.ctaHref ?? "",
    imageUrl: null,
    mobileImageUrl: null,
    videoUrl: def.videoUrl ?? "",
    videoEnabled: def.videoEnabled ?? false,
    /* a band may ship switched off — e.g. one whose copy claims real
       screenshots, or the reserved proof slot (content-spec.md §8) */
    isActive: def.isActive ?? true,
    items: (def.items ?? []).map((i, idx) => ({
      id: -(idx + 1),
      title: i.title,
      description: i.description ?? "",
      icon: i.icon ? (i.icon as IconName) : undefined,
      tag: i.tag ?? "",
      href: i.href ?? "",
      bullets: i.bullets ?? [],
      imageUrl: null,
    })),
  };
}

/**
 * All editable sections in one cached read.
 * A section that has no database row yet falls back to its factory
 * default, so an un-seeded install still renders the current site.
 * A section that HAS a row is authoritative — including when the
 * editor emptied its item list.
 */
export const getContent = unstable_cache(
  async (): Promise<ContentMap> => {
    const [sections, items] = await Promise.all([
      orDefault(() => db.select().from(schema.contentSections), () => []),
      orDefault(() => db.select().from(schema.contentItems)
        .where(eq(schema.contentItems.isActive, true))
        .orderBy(asc(schema.contentItems.sortOrder), asc(schema.contentItems.id)), () => []),
    ]);

    const map: ContentMap = {};
    for (const def of SECTIONS) map[def.key] = defaultSection(def.key);

    for (const s of sections) {
      map[s.key] = {
        key: s.key,
        eyebrow: s.eyebrow,
        title: s.title,
        description: s.description,
        ctaLabel: s.ctaLabel,
        ctaHref: s.ctaHref,
        imageUrl: mediaUrl(s.mediaId),
        mobileImageUrl: mediaUrl(s.mobileMediaId),
        videoUrl: s.videoUrl,
        videoEnabled: s.videoEnabled,
        isActive: s.isActive,
        items: items
          .filter((i) => i.sectionKey === s.key)
          .map((i) => ({
            id: i.id,
            title: i.title,
            description: i.description,
            icon: asIcon(i.icon),
            tag: i.tag,
            href: i.href,
            bullets: Array.isArray(i.bullets) ? i.bullets : [],
            imageUrl: mediaUrl(i.mediaId),
          })),
      };
    }
    return map;
  },
  ["content-sections"],
  { tags: [TAGS.content], revalidate: HOUR },
);

/** single section, with the same fallback rules as getContent() */
export async function getSection(key: string): Promise<SectionView> {
  const all = await getContent();
  return all[key] ?? defaultSection(key);
}
