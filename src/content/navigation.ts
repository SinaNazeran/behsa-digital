import type { IconName } from "@/components/icons";
import type { NavKind, NavLens } from "@/db/schema";
import { CAPABILITY_CATEGORIES, CONTENT_PAGES } from "@/content/capabilities";

/* ════════════════════════════════════════════════════════════════
   Behsa Digital — Information Architecture / Navigation Model
   ────────────────────────────────────────────────────────────────
   The live menu lives in the database (`nav_items`, Admin → منو).
   This file keeps three things that are NOT editor content:

   1. the view types the navigation components render,
   2. the factory default menu used to seed the database (and as a
      fallback when the table is empty, so the site is never menu-less),
   3. the cross-links between product pages, derived from the `links`
      declared next to each page's content in content/capabilities.ts.

   Slug convention (English, semantic, hierarchical):
     /product/capabilities/<feature>   → feature-oriented (WHAT it does)
     /reports/<report>                 → the named report (L4, CMS-managed)
     /solutions/<outcome>              → outcome-oriented (WHICH problem)
     /industries/<vertical>            → vertical-oriented (HOW applied)
   Why English slugs: stable URLs under a Persian UI, predictable
   transliteration-free routing, and clean analytics segments.

   Rule of record (docs/content-strategy.md §Content Governance):
   a nav item ships with its page. Nothing is listed here that does
   not resolve to written content.
   ════════════════════════════════════════════════════════════════ */

export type { NavLens };

export interface NavItemView {
  id: number;
  title: string;
  href: string;
  description: string;
  icon?: IconName;
  /** external link, or an internal one the editor marked as new-tab */
  newTab: boolean;
}

export interface NavIntro {
  title: string;
  description: string;
  cta: { label: string; href: string } | null;
}

/** one category block of the report menu */
export interface NavGroupView {
  id: number;
  title: string;
  href: string;
  icon?: IconName;
  items: NavItemView[];
  /** the category has more reports than the menu shows */
  more: boolean;
}

export interface NavSectionView extends NavItemView {
  kind: NavKind;
  lens: NavLens;
  /** mega-panel intro column; null when the editor left it empty */
  intro: NavIntro | null;
  items: NavItemView[];
  /** kind "reports" only: the catalogue, grouped by category (`items` is the flat list) */
  groups?: NavGroupView[];
}

/** a node of the data-driven landing router (`/[...slug]`) */
export interface LandingNode {
  slug: string;
  href: string;
  title: string;
  description: string;
  icon?: IconName;
  section: { title: string; href: string; slug: string };
  children?: NavItemView[];
  links?: { label: string; slug: string }[];
  /** messaging lens, drives the landing template tone */
  lens: NavLens;
}

/** true for anything that is not an in-app path */
export const isExternalHref = (href: string) => !href.startsWith("/") || href.startsWith("//");

/** "/solutions/power-quality" → "solutions/power-quality" (landing router key) */
export const slugOf = (href: string) => href.replace(/^\//, "");

/* Fixed conversion affordances of the header. The contact page is a real
   route and the panel URL already lives in site settings, so these are
   wiring, not editor content.

   The site has ONE call to action — the product panel. Requested by the
   business; it supersedes the demo-first recommendation in
   docs/content-strategy.md §CTA Strategy. The contact page (with its
   form) remains the route for a visitor who has no panel account. */
export const NAV_CONTACT = { title: 'تماس با ما', href: '/contact' } as const;
export const NAV_CTA_LABEL = 'ورود به سامانه';

/* ── Factory default menu (seed + empty-table fallback) ─────────── */

export type DefaultNavItem = {
  label: string;
  href: string;
  description?: string;
  icon?: IconName;
  newTab?: boolean;
  isActive?: boolean;
};

export type DefaultNavSection = DefaultNavItem & {
  kind: NavKind;
  lens: NavLens;
  intro?: { title: string; description: string; ctaLabel: string; ctaHref: string };
  items: DefaultNavItem[];
};

export const DEFAULT_NAV: DefaultNavSection[] = [
  {
    label: "محصول",
    href: "/product",
    kind: "mega",
    lens: "feature",
    intro: {
      title: "معرفی پلتفرم",
      description: "از اتصال به کنتور تا عددی که می‌شود بر اساس آن تصمیم گرفت.",
      ctaLabel: "آشنایی با پلتفرم",
      ctaHref: "/product/platform",
    },
    items: [
      { label: "مدیریت انرژی و هزینه", href: "/product/capabilities/energy-cost-management", description: "تحلیل قبض، تعرفه و قدرت قراردادی", icon: "rial" },
      { label: "پایش و تحلیل مصرف", href: "/product/capabilities/consumption-monitoring", description: "مصرف لحظه‌ای و پروفایل بار ۱۵ دقیقه‌ای", icon: "monitor" },
      { label: "هشدارها و مدیریت دیماند", href: "/product/capabilities/demand-management", description: "هشدار پیش از رسیدن به قدرت قراردادی", icon: "demand" },
      { label: "کیفیت توان", href: "/product/capabilities/power-quality", description: "ضریب توان، هارمونیک و بانک خازنی", icon: "wave" },
      { label: "پایش سلامت کنتورها", href: "/product/capabilities/meter-health", description: "کنتور خاموش، معیوب و مصرف مشکوک", icon: "realtime" },
      { label: "هوشمندسازی و تحلیل پیشرفته", href: "/product/capabilities/advanced-analytics", description: "پیش‌بینی مصرف و کشف ناهنجاری", icon: "forecast" },
      { label: "انرژی‌های تجدیدپذیر", href: "/product/capabilities/renewable-energy", description: "پایش تولید خورشیدی و الزام ماده ۱۶", icon: "sun" },
      /* ships inactive: an unexplained security claim is worse than silence
         with a reviewer who knows what to ask. Activate once the engineering
         facts exist (docs/content-spec.md §3.3, placeholder P4). */
      { label: "امنیت و دادهٔ شما", href: "/product/security", description: "محل نگهداری داده و کنترل دسترسی", icon: "shield", isActive: false },
    ],
  },
  {
    label: "گزارش‌ها",
    href: "/reports",
    /* its items are the report catalogue (Admin → گزارش‌ها), grouped by
       category — renaming a category or publishing a report changes the
       menu without touching it here or in Admin → منو */
    kind: "reports",
    lens: "feature",
    intro: {
      title: "هر گزارش، یک تصمیم",
      description: "گزارش‌ها بر اساس تصمیمی که باید گرفته شود دسته‌بندی شده‌اند، نه بر اساس نوع نمودار.",
      ctaLabel: "همهٔ گزارش‌ها",
      ctaHref: "/reports",
    },
    items: [],
  },
  {
    label: "راهکارها",
    href: "/solutions",
    kind: "mega",
    lens: "outcome",
    intro: {
      title: "مسئلهٔ کسب‌وکار، نه فهرست ابزار",
      description: "هر راهکار یک قلم هزینه یا یک الزام قانونی مشخص را هدف می‌گیرد.",
      ctaLabel: "مشاهدهٔ راهکارها",
      ctaHref: "/solutions",
    },
    items: [
      { label: "حذف جریمهٔ دیماند", href: "/solutions/demand-management", description: "تنظیم قدرت قراردادی به اندازهٔ نیاز واقعی", icon: "gauge" },
      { label: "حذف جریمهٔ توان راکتیو", href: "/solutions/power-quality", description: "اصلاح ضریب توان با طراحی درست بانک خازنی", icon: "capacitor" },
      { label: "خرید برق بدون جریمهٔ انحراف", href: "/solutions/energy-procurement", description: "مقدار بهینهٔ خرید، نه برآورد", icon: "cart" },
      { label: "مدیریت انرژی چندسایتی", href: "/solutions/multi-site", description: "یک زبان مشترک برای همهٔ زیرمجموعه‌ها", icon: "holding" },
      { label: "الزام تأمین برق تجدیدپذیر (ماده ۱۶)", href: "/solutions/article-16", description: "سنجش سهم واقعی و کسری تولید", icon: "leaf" },
      { label: "الزام خرید از بازار (۱۵۰ کیلووات به بالا)", href: "/solutions/market-purchase", description: "برآورد دقیق سهم بازار برق", icon: "chart" },
    ],
  },
  {
    label: "صنایع",
    href: "/industries",
    kind: "mega",
    lens: "vertical",
    intro: {
      title: "هر صنعت، الگوی مصرف خودش",
      description: "الگوی بار، تعرفه و الزامات هر بخش متفاوت است — و گزارش‌هایی که برایش اهمیت دارند هم متفاوت‌اند.",
      ctaLabel: "صنعت خود را پیدا کنید",
      ctaHref: "/industries",
    },
    items: [
      { label: "صنایع پرمصرف", href: "/industries/heavy-industry", description: "فولاد، سیمان، پتروشیمی، ریخته‌گری و غذایی", icon: "factory" },
      { label: "هلدینگ‌ها و گروه‌های چندسایتی", href: "/industries/holdings", description: "زیرمجموعه‌های متنوع با گزارش غیرقابل‌مقایسه", icon: "holding" },
      { label: "مشاوران و طراحان برق", href: "/industries/consultants", description: "طراحی بانک خازنی بدون بازدید میدانی", icon: "consultant" },
      { label: "خرده‌فروشان و توزیع برق", href: "/industries/electricity-retailers", description: "سلامت کنتورها و پیش‌بینی سبد مشتریان", icon: "retail" },
    ],
  },
  {
    label: "منابع",
    href: "/resources",
    kind: "dropdown",
    lens: "content",
    items: [
      { label: "مقالات", href: "/articles", description: "تحلیل‌های تخصصی مدیریت انرژی", icon: "doc" },
      /* ships inactive: the route exists so the first real case study has
         a home, but an empty «نتایج واقعی» page is a promise with nothing
         behind it (docs/content-audit.md §Navigation Audit). */
      { label: "مطالعات موردی", href: "/resources/case-studies", description: "نتایج پروژه‌های واقعی", icon: "board", isActive: false },
    ],
  },
  {
    label: "درباره ما",
    href: "/about",
    kind: "dropdown",
    lens: "company",
    items: [],
  },
];

/* ── Cross-links — derived, not duplicated ──────────────────────────
   Each page declares its own related pages next to its content in
   content/capabilities.ts; this map is just the index the landing
   router reads, so the two can never drift apart. */

export const CROSS_LINKS: Record<string, { label: string; slug: string }[]> = Object.fromEntries(
  [...CAPABILITY_CATEGORIES, ...CONTENT_PAGES]
    .filter((c) => c.links && c.links.length > 0)
    .map((c) => [c.slug, c.links!]),
);

/** which top-level section owns a route — for the navbar active indicator */
export function sectionKeyForRoute(route: string, sections: NavSectionView[]): string | null {
  const path = route.replace(/\/+$/, "") || "/";
  for (const section of sections) {
    if (isExternalHref(section.href)) continue;
    const base = section.href.replace(/\/+$/, "");
    if (base && (path === base || path.startsWith(`${base}/`))) return String(section.id);
    if (section.items.some((i) => !isExternalHref(i.href) && i.href.replace(/\/+$/, "") === path)) return String(section.id);
  }
  if (path === "/contact") return "contact";
  return null;
}
