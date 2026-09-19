import type { IconName } from "@/components/icons";

/* ════════════════════════════════════════════════════════════════
   Behsa Digital — Capabilities · Single Source of Truth
   ────────────────────────────────────────────────────────────────
   This file mirrors the verified product capability list.
   - No marketing copy; names preserved verbatim.
   - `description?` is reserved for phase 2 (add without schema change).
   - Overlap policy: each capability item is listed once in its
     primary category; sibling pages connect via `links` cross-refs.
   ════════════════════════════════════════════════════════════════ */

export type NarrativeStage = "data" | "intelligence" | "decision" | "optimization" | "outcome";

export interface FeatureGroup {
  title?: string;
  items: string[];
}

export interface CapabilityCategory {
  id: string;
  title: string;
  /** matches the slug in data/navigation.ts */
  slug: string;
  href: string;
  narrativeStage: NarrativeStage;
  status?: "active" | "coming-soon";
  /** phase 2 — long-form explanation lives here later */
  description?: string;
  icon: IconName;
  featureGroups: FeatureGroup[];
  links?: { label: string; slug: string }[];
}

/* The five stages are a sequence, not five categories, so they read as a
   journey across the brand pair rather than as five competing hues:
   blue where the work is data, orange where it becomes action, green where
   it lands as a business result. Each colour is text on its own 14% tint,
   so each is measured there: 6.45 / 4.88 / 6.27 / 4.59 / 4.65 — the old set
   ran between 1.9 and 2.6 and was unreadable at this size. */
export const STAGE_META: Record<NarrativeStage, { label: string; order: number; color: string; soft: string }> = {
  data:         { label: "داده",             order: 1, color: "#044F98", soft: "rgb(4 79 152 / 0.14)" },
  intelligence: { label: "هوشمندی",          order: 2, color: "#0062BD", soft: "rgb(0 98 189 / 0.14)" },
  decision:     { label: "تصمیم",            order: 3, color: "#8D3605", soft: "rgb(141 54 5 / 0.14)" },
  optimization: { label: "بهینه‌سازی",        order: 4, color: "#B04608", soft: "rgb(176 70 8 / 0.14)" },
  outcome:      { label: "نتیجهٔ کسب‌وکار",   order: 5, color: "#0A7649", soft: "rgb(10 118 73 / 0.14)" },
};

export const CAPABILITY_CATEGORIES: CapabilityCategory[] = [
  {
    id: "energy-cost",
    title: "مدیریت انرژی و هزینه",
    slug: "product/capabilities/energy-cost-management",
    href: "/product/capabilities/energy-cost-management",
    narrativeStage: "outcome",
    status: "active",
    icon: "rial",
    featureGroups: [
      {
        items: [
          "تحلیل قبوض برق",
          "تحلیل تعرفه‌های برق",
          "بهینه‌سازی قدرت قراردادی",
          "تحلیل قراردادهای دوجانبه",
          "بررسی خرید برق از بورس انرژی (تجدیدپذیر و غیرتجدیدپذیر)",
          "نمودار هزینه‌های انرژی",
        ],
      },
    ],
    links: [{ label: "راهکار: مدیریت هزینه و مصرف", slug: "solutions/cost-consumption" }],
  },
  {
    id: "consumption",
    title: "پایش و تحلیل مصرف",
    slug: "product/capabilities/consumption-monitoring",
    href: "/product/capabilities/consumption-monitoring",
    narrativeStage: "data",
    status: "active",
    icon: "monitor",
    featureGroups: [
      {
        title: "پایش لحظه‌ای",
        items: [
          "نمایش مصرف لحظه‌ای کنتورهای هوشمند (صنعتی، عمومی، خورشیدی، دیزل و سایر تعرفه‌ها)",
          "نمودار مصرف و تولید",
        ],
      },
      {
        title: "نمودارهای تعرفه‌ای",
        items: [
          "نمودار مصرف روز جاری به تفکیک تعرفه‌های کاربری",
          "نمودار مصرف به تفکیک تعرفه‌های کم‌باری، میان‌باری و اوج‌باری (ماه جاری و ماه مشابه سال گذشته)",
        ],
      },
      {
        title: "روندها و مقایسه‌های دوره‌ای",
        items: [
          "نمودار مصرف ماه‌های مختلف سال",
          "نمودار مصرف ۱۲ ماه اخیر",
          "نمودار مقایسه مصرف سه ماه اخیر با دوره مشابه سه سال گذشته",
          "مقایسه مصرف روز جاری با میانگین ماهانه",
          "نمودار نسبت اوج مصرف شب به میانگین مصرف صبح",
        ],
      },
      {
        title: "شاخص‌های دیماند و ضریب توان",
        items: [
          "نمودار بیشینه دیماند مصرفی نسبت به قدرت قراردادی",
          "نمودار ضریب توان ماهانه مشترک",
        ],
      },
    ],
    links: [
      { label: "هشدارها و مدیریت دیماند", slug: "product/capabilities/demand-management" },
      { label: "کیفیت توان", slug: "product/capabilities/power-quality" },
    ],
  },
  {
    id: "demand",
    title: "هشدارها و مدیریت دیماند",
    slug: "product/capabilities/demand-management",
    href: "/product/capabilities/demand-management",
    narrativeStage: "decision",
    status: "active",
    icon: "demand",
    featureGroups: [
      {
        items: [
          "هشدار تجاوز از دیماند و ارسال نوتیفیکیشن و پیامک پیش از رسیدن به قدرت قراردادی",
          "هشدار افت ضریب توان",
          "کاهش جرائم تجاوز از دیماند",
        ],
      },
    ],
    links: [
      { label: "نمودارهای دیماند در پایش مصرف", slug: "product/capabilities/consumption-monitoring" },
      { label: "راهکار: دیماند و قدرت قراردادی", slug: "solutions/demand-management" },
    ],
  },
  {
    id: "power-quality",
    title: "کیفیت توان",
    slug: "product/capabilities/power-quality",
    href: "/product/capabilities/power-quality",
    narrativeStage: "optimization",
    status: "active",
    icon: "wave",
    featureGroups: [
      {
        items: [
          "اصلاح ضریب توان",
          "مدیریت توان راکتیو و طراحی بانک خازنی",
          "تحلیل هارمونیک‌ها",
          "بررسی عدم تعادل فازها",
          "تحلیل افت ولتاژ",
          "پایش نوسانات شبکه",
          "بهبود پایداری تجهیزات حساس",
        ],
      },
    ],
    links: [
      { label: "نمودار ضریب توان در پایش مصرف", slug: "product/capabilities/consumption-monitoring" },
      { label: "راهکار: کیفیت توان", slug: "solutions/power-quality" },
    ],
  },
  {
    id: "meter-health",
    title: "پایش سلامت کنتورها",
    slug: "product/capabilities/meter-health",
    href: "/product/capabilities/meter-health",
    narrativeStage: "intelligence",
    status: "active",
    icon: "realtime",
    featureGroups: [
      {
        items: [
          "شناسایی کنتورهای مشکوک به استخراج رمزارز",
          "شناسایی کنتورهای خاموش یا آفلاین",
          "شناسایی کنتورهای معیوب با مصرف ثابت",
          "شناسایی کنتورهای با ضریب توان کمتر از حد قانونی",
          "شناسایی کنتورهای دارای افزایش مصرف نسبت به سال گذشته",
          "تعداد کنتورهای دارای افزایش مصرف نسبت به سال گذشته",
        ],
      },
    ],
  },
  {
    id: "advanced-analytics",
    title: "هوشمندسازی و تحلیل پیشرفته",
    slug: "product/capabilities/advanced-analytics",
    href: "/product/capabilities/advanced-analytics",
    narrativeStage: "intelligence",
    status: "active",
    icon: "forecast",
    featureGroups: [
      {
        items: [
          "پیش‌بینی مصرف",
          "کشف ناهنجاری‌ها",
          "شناسایی مصرف‌های مشکوک",
          "تحلیل عملکرد تجهیزات",
          "پیشنهاد اقدامات اصلاحی",
        ],
      },
    ],
    links: [{ label: "راهکار: هوشمندسازی", slug: "solutions/advanced-intelligence" }],
  },
  {
    id: "renewable",
    title: "انرژی‌های تجدیدپذیر",
    slug: "product/capabilities/renewable-energy",
    href: "/product/capabilities/renewable-energy",
    narrativeStage: "outcome",
    status: "active",
    icon: "sun",
    featureGroups: [
      {
        items: [
          "مطالعات نیروگاه خورشیدی",
          "طراحی مدل سرمایه‌گذاری",
          "پیش‌بینی میزان پیش‌خرید برق تجدیدپذیر و غیرتجدیدپذیر",
          "تحلیل سهم انرژی خورشیدی در مصرف مشترک (مطابق ماده ۱۶)",
        ],
      },
    ],
    links: [{ label: "صنعت: انرژی خورشیدی", slug: "industries/solar" }],
  },
  {
    /* در ناوبری موجود است اما در فهرست واقعی محصول نیست — placeholder آینده‌نگر */
    id: "multi-site",
    title: "مدیریت چندسایتی",
    slug: "product/capabilities/multi-site",
    href: "/product/capabilities/multi-site",
    narrativeStage: "decision",
    status: "coming-soon",
    icon: "holding",
    featureGroups: [],
    links: [{ label: "راهکار: مدیریت چندسایتی", slug: "solutions/multi-site" }],
  },
];

export const capabilityBySlug = (slug: string): CapabilityCategory | undefined =>
  CAPABILITY_CATEGORIES.find((c) => c.slug === slug);

export const featureCount = (c: CapabilityCategory): number =>
  c.featureGroups.reduce((n, g) => n + g.items.length, 0);
