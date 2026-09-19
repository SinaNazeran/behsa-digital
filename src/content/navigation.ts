import type { IconName } from "@/components/icons";
import type { NavLens } from "@/db/schema";

/* ════════════════════════════════════════════════════════════════
   Behsa Digital — Information Architecture / Navigation Model
   ────────────────────────────────────────────────────────────────
   The live menu lives in the database (`nav_items`, Admin → منو).
   This file keeps three things that are NOT editor content:

   1. the view types the navigation components render,
   2. the factory default menu used to seed the database (and as a
      fallback when the table is empty, so the site is never menu-less),
   3. the capability ⇄ solution cross-links, which are an editorial
      relationship between product pages, not a menu entry.

   Slug convention (English, semantic, hierarchical):
     /product/capabilities/<feature>   → feature-oriented (WHAT it does)
     /solutions/<outcome>              → outcome-oriented (WHICH problem)
     /industries/<vertical>            → vertical-oriented (HOW applied)
   Why English slugs: stable URLs under a Persian UI, predictable
   transliteration-free routing, and clean analytics segments.
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

export interface NavSectionView extends NavItemView {
  kind: "mega" | "dropdown";
  lens: NavLens;
  /** mega-panel intro column; null when the editor left it empty */
  intro: NavIntro | null;
  items: NavItemView[];
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

/* Fixed conversion affordances of the header. The contact page is a
   real route and the panel URL already lives in site settings, so
   these are wiring, not editor content. */
export const NAV_CONTACT = { title: 'تماس با ما', href: '/contact' } as const;
export const NAV_CTA_LABEL = 'ورود به سامانه';

/* ── Factory default menu (seed + empty-table fallback) ─────────── */

export type DefaultNavItem = {
  label: string;
  href: string;
  description?: string;
  icon?: IconName;
  newTab?: boolean;
};

export type DefaultNavSection = DefaultNavItem & {
  kind: "mega" | "dropdown";
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
      description: "هستهٔ داده‌محور بهسا: از اتصال کنتور تا گزارش مدیریتی، در یک سامانهٔ یکپارچه.",
      ctaLabel: "آشنایی با پلتفرم",
      ctaHref: "/product/platform",
    },
    items: [
      { label: "مدیریت انرژی و هزینه", href: "/product/capabilities/energy-cost-management", description: "بهای تمام‌شده، تعرفه و روند هزینه", icon: "rial" },
      { label: "پایش و تحلیل مصرف", href: "/product/capabilities/consumption-monitoring", description: "دادهٔ لحظه‌ای و پروفایل بار ۱۵ دقیقه‌ای", icon: "monitor" },
      { label: "هشدارها و مدیریت دیماند", href: "/product/capabilities/demand-management", description: "هشدار آستانه و تحلیل بیشینهٔ مصرف", icon: "demand" },
      { label: "کیفیت توان", href: "/product/capabilities/power-quality", description: "ولتاژ، هارمونیک و توان راکتیو", icon: "wave" },
      { label: "پایش سلامت کنتورها", href: "/product/capabilities/meter-health", description: "پایش اتصال، قطعی و صحت دادهٔ کنتور", icon: "realtime" },
      { label: "تحلیل پیشرفته", href: "/product/capabilities/advanced-analytics", description: "پیش‌بینی مصرف و مدل‌های هوشمند", icon: "forecast" },
      { label: "انرژی‌های تجدیدپذیر", href: "/product/capabilities/renewable-energy", description: "پایش تولید خورشیدی و راندمان", icon: "sun" },
      { label: "مدیریت چندسایتی", href: "/product/capabilities/multi-site", description: "داشبورد تجمیعی هلدینگ و مقایسهٔ سایت‌ها", icon: "holding" },
    ],
  },
  {
    label: "راهکارها",
    href: "/solutions",
    kind: "mega",
    lens: "outcome",
    intro: {
      title: "مسئلهٔ کسب‌وکار، نه فقط ابزار",
      description: "هر راهکار یک اثر مالی مشخص را هدف می‌گیرد و با قابلیت‌های پلتفرم پشتیبانی می‌شود.",
      ctaLabel: "مشاهدهٔ راهکارها",
      ctaHref: "/solutions",
    },
    items: [
      { label: "مدیریت هزینه و مصرف انرژی", href: "/solutions/cost-consumption", description: "کاهش بهای تمام‌شده بدون افت تولید", icon: "save" },
      { label: "مدیریت دیماند و قدرت قراردادی", href: "/solutions/demand-management", description: "حذف جریمه دیماند و بهینه‌سازی قرارداد", icon: "contract" },
      { label: "کیفیت توان", href: "/solutions/power-quality", description: "اصلاح ضریب توان و حذف جریمهٔ راکتیو", icon: "capacitor" },
      { label: "تأمین و خرید انرژی", href: "/solutions/energy-procurement", description: "پیش‌بینی خرید و کاهش ریسک انحراف", icon: "cart" },
      { label: "هوشمندسازی و تحلیل پیشرفته", href: "/solutions/advanced-intelligence", description: "از دادهٔ خام تا تصمیم خودکار", icon: "tech" },
      { label: "مدیریت انرژی چندسایتی", href: "/solutions/multi-site", description: "دید تجمیعی و استانداردسازی گزارش هلدینگ", icon: "holding" },
    ],
  },
  {
    label: "صنایع",
    href: "/industries",
    kind: "mega",
    lens: "vertical",
    intro: {
      title: "هر صنعت، الگوی مصرف خودش",
      description: "پلتفرم با تعرفه، بار و الزامات هر بخش تنظیم می‌شود — نه یک داشبورد عمومی.",
      ctaLabel: "صنعت خود را پیدا کنید",
      ctaHref: "/industries",
    },
    items: [
      { label: "صنایع و کارخانه‌ها", href: "/industries/manufacturing", description: "فولاد، سیمان، پتروشیمی و غذایی", icon: "factory" },
      { label: "هلدینگ‌ها", href: "/industries/holdings", description: "مدیریت تجمیعی زیرمجموعه‌های متعدد", icon: "holding" },
      { label: "نیروگاه‌ها", href: "/industries/power-plants", description: "پایش تولید و راندمان نیروگاه", icon: "plant" },
      { label: "انرژی و توزیع", href: "/industries/utilities", description: "خرده‌فروشان برق و شرکت‌های توزیع", icon: "retail" },
      { label: "کسب‌وکارهای تجاری", href: "/industries/commercial", description: "مجتمع‌ها، بیمارستان‌ها و مراکز داده", icon: "org" },
      { label: "کشاورزی", href: "/industries/agriculture", description: "پمپاژ، گلخانه و تعرفهٔ کشاورزی", icon: "leaf" },
      { label: "انرژی خورشیدی", href: "/industries/solar", description: "نیروگاه‌های خورشیدی و سقف صنعتی", icon: "sun" },
    ],
  },
  {
    label: "منابع",
    href: "/resources",
    kind: "dropdown",
    lens: "content",
    items: [
      { label: "مقالات", href: "/articles", description: "تحلیل‌های تخصصی مدیریت انرژی", icon: "doc" },
      { label: "آموزش‌ها", href: "/resources/training", description: "دوره‌ها و وبینارهای فنی", icon: "precision" },
      { label: "گزارش‌ها", href: "/resources/reports", description: "گزارش‌های دوره‌ای بازار انرژی", icon: "chart" },
      { label: "مطالعات موردی", href: "/resources/case-studies", description: "نتایج واقعی پروژه‌های مشتریان", icon: "board" },
      { label: "ویدئوها", href: "/resources/videos", description: "دمو و آموزش‌های ویدئویی", icon: "play" },
      { label: "راهنماها", href: "/resources/guides", description: "مستندات استقرار و API", icon: "contract" },
    ],
  },
  {
    label: "درباره ما",
    href: "/about",
    kind: "dropdown",
    lens: "company",
    items: [
      { label: "درباره بهسا", href: "/about", description: "مأموریت، چشم‌انداز و رویکرد ما", icon: "info" },
      { label: "تخصص و توانمندی‌ها", href: "/about/expertise", description: "تیم مهندسی برق قدرت و داده", icon: "decision" },
      { label: "تیم", href: "/about/team", description: "افرادی که بهسا را می‌سازند", icon: "org" },
    ],
  },
];

/* ── Capability ⇄ solution cross-links (editorial, not menu data) ── */

export const CROSS_LINKS: Record<string, { label: string; slug: string }[]> = {
  "product/capabilities/energy-cost-management": [{ label: "راهکار: مدیریت هزینه و مصرف", slug: "solutions/cost-consumption" }],
  "product/capabilities/demand-management": [{ label: "راهکار: دیماند و قدرت قراردادی", slug: "solutions/demand-management" }],
  "product/capabilities/power-quality": [{ label: "راهکار: کیفیت توان", slug: "solutions/power-quality" }],
  "product/capabilities/advanced-analytics": [{ label: "راهکار: هوشمندسازی", slug: "solutions/advanced-intelligence" }],
  "product/capabilities/renewable-energy": [{ label: "صنعت: انرژی خورشیدی", slug: "industries/solar" }],
  "product/capabilities/multi-site": [{ label: "راهکار: مدیریت چندسایتی", slug: "solutions/multi-site" }],
  "solutions/cost-consumption": [{ label: "قابلیت: مدیریت هزینه", slug: "product/capabilities/energy-cost-management" }],
  "solutions/demand-management": [{ label: "قابلیت: هشدارها و مدیریت دیماند", slug: "product/capabilities/demand-management" }],
  "solutions/power-quality": [{ label: "قابلیت: کیفیت توان", slug: "product/capabilities/power-quality" }],
  "solutions/energy-procurement": [{ label: "قابلیت: تحلیل پیشرفته", slug: "product/capabilities/advanced-analytics" }],
  "solutions/advanced-intelligence": [{ label: "قابلیت: تحلیل پیشرفته", slug: "product/capabilities/advanced-analytics" }],
  "solutions/multi-site": [{ label: "قابلیت: چندسایتی", slug: "product/capabilities/multi-site" }],
};

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
