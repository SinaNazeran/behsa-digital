import type { IconName } from "@/components/icons";

/* ════════════════════════════════════════════════════════════════
   Behsa Digital — Product content · Single Source of Truth
   ────────────────────────────────────────────────────────────────
   Two collections live here, both rendered by the same landing
   template (src/views/Landing.tsx → CapabilityFeatureList):

   1. CAPABILITY_CATEGORIES — the seven product categories, taken
      verbatim from info/. Feature names are NOT edited for marketing
      rhythm: they must match what a customer sees inside the panel.
      Also drives /product/platform (CapabilitiesOverview).

   2. CONTENT_PAGES — report, solution and industry pages. Same shape,
      but prose-led (`lead` + `sections`) instead of feature lists.

   Per docs/content-strategy.md this file is the single product
   taxonomy; data.ts no longer holds a competing one. It is owned by
   Product and changed by PR, not by the CMS — editorial bands on the
   homepage are the editor's surface, product facts are not.

   Evidence classification of every claim below: docs/content-spec.md.
   ════════════════════════════════════════════════════════════════ */

export type NarrativeStage = "data" | "intelligence" | "decision" | "optimization" | "outcome";

export interface FeatureGroup {
  title?: string;
  items: string[];
}

/** a prose block on a report / solution / industry page */
export interface ContentBlock {
  title: string;
  /** one or more paragraphs */
  body?: string[];
  /** bullet list, when the source material is a list */
  items?: string[];
}

export interface CapabilityCategory {
  id: string;
  title: string;
  /** matches the slug in content/navigation.ts */
  slug: string;
  href: string;
  narrativeStage: NarrativeStage;
  status?: "active" | "coming-soon";
  /** short explanation under the page title */
  description?: string;
  icon: IconName;
  /** verbatim feature names — capability pages only */
  featureGroups: FeatureGroup[];
  /** prose sections — report / solution / industry pages */
  sections?: ContentBlock[];
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

/* ════════════════════════════════════════════════════════════════
   1 · Capability categories (L3) — verbatim from info/
   ════════════════════════════════════════════════════════════════ */

export const CAPABILITY_CATEGORIES: CapabilityCategory[] = [
  {
    id: "energy-cost",
    title: "مدیریت انرژی و هزینه",
    slug: "product/capabilities/energy-cost-management",
    href: "/product/capabilities/energy-cost-management",
    narrativeStage: "outcome",
    status: "active",
    icon: "rial",
    description:
      "این بخش اجزای هزینهٔ برق را از هم جدا می‌کند: بهای انرژی به تفکیک تعرفه، هزینهٔ قدرت قراردادی و اقلام جریمه‌پذیر. مخاطب اصلی آن مدیر مالی و مدیر انرژی است. تصمیمی که از آن بیرون می‌آید معمولاً یکی از این سه است: تغییر قدرت قراردادی، تغییر روش تأمین برق، یا جابه‌جایی بار از ساعات اوج.",
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
    links: [
      { label: "گزارش: بهای انرژی مصرفی قبض", slug: "reports/bill-energy-cost" },
      { label: "گزارش: بهینه‌سازی قدرت قراردادی", slug: "reports/contracted-power" },
    ],
  },
  {
    id: "consumption",
    title: "پایش و تحلیل مصرف",
    slug: "product/capabilities/consumption-monitoring",
    href: "/product/capabilities/consumption-monitoring",
    narrativeStage: "data",
    status: "active",
    icon: "monitor",
    description:
      "این بخش دادهٔ خام کنتور را به تصویری قابل‌خواندن از رفتار بار تبدیل می‌کند: مصرف لحظه‌ای، پروفایل ۱۵ دقیقه‌ای، تفکیک تعرفه‌ای و مقایسه با دوره‌های گذشته. مخاطب آن بهره‌بردار و مدیر انرژی است. خروجی آن پاسخ به این پرسش است که بار در چه ساعتی و با چه الگویی مصرف می‌شود — مبنای هر تصمیم بعدی.",
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
      { label: "گزارش: پروفایل بار", slug: "reports/load-profile" },
      { label: "گزارش: بیشینه مصرف اکتیو", slug: "reports/peak-demand" },
      { label: "گزارش: مقایسه مصرف", slug: "reports/consumption-comparison" },
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
    description:
      "این بخش فاصلهٔ مصرف تا قدرت قراردادی را پایش می‌کند و پیش از رسیدن به آن حد، نوتیفیکیشن و پیامک می‌فرستد. مخاطب آن بهره‌بردار شیفت و مدیر تولید است. تصمیم حاصل، لحظه‌ای است: کاهش یا جابه‌جایی بار پیش از ثبت دیماند جدید.",
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
      { label: "گزارش: کنتورهای دارای تجاوز از دیماند", slug: "reports/demand-excess-meters" },
      { label: "راهکار: حذف جریمهٔ دیماند", slug: "solutions/demand-management" },
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
    description:
      "این بخش ضریب توان، توان راکتیو، هارمونیک‌ها، عدم تعادل فازها و افت ولتاژ را پایش و تحلیل می‌کند. مخاطب آن مهندس برق و مشاور طراح است. دو تصمیم از آن بیرون می‌آید: طراحی یا اصلاح بانک خازنی، و اقدام حفاظتی برای تجهیزات حساس.",
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
      { label: "گزارش: توان راکتیو جبرانی بانک خازنی", slug: "reports/capacitor-bank-design" },
      { label: "گزارش: نمودار ساعتی جبران‌ساز", slug: "reports/capacitor-bank-diagnostic" },
      { label: "گزارش: هشدار کیفیت ولتاژ", slug: "reports/voltage-quality" },
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
    description:
      "این بخش کنتورهایی را که رفتار غیرعادی دارند علامت‌گذاری می‌کند: خاموش یا آفلاین، مصرف ثابت و معیوب، ضریب توان کمتر از حد قانونی، مصرف مشکوک به استخراج رمزارز و افزایش مصرف نسبت به سال گذشته. مخاطب آن خرده‌فروش برق، شرکت توزیع و مدیر هلدینگ با تعداد زیاد کنتور است. خروجی آن فهرستی برای پیگیری میدانی است.",
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
    links: [
      { label: "گزارش: سلامت کنتورها", slug: "reports/meter-health" },
      { label: "صنعت: خرده‌فروشان و توزیع برق", slug: "industries/electricity-retailers" },
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
    description:
      "این بخش الگوی مصرف را مدل می‌کند: پیش‌بینی مصرف، کشف ناهنجاری، شناسایی مصرف‌های مشکوک و تحلیل عملکرد تجهیزات. مخاطب آن مدیر انرژی و تیم برنامه‌ریزی تأمین است. مهم‌ترین تصمیمی که به آن وابسته است، مقدار خرید برق ماه پیش‌رو است.",
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
    links: [
      { label: "گزارش: خرید بهینه انرژی ماه جاری", slug: "reports/optimal-purchase" },
      { label: "راهکار: خرید برق بدون جریمهٔ انحراف", slug: "solutions/energy-procurement" },
    ],
  },
  {
    id: "renewable",
    title: "انرژی‌های تجدیدپذیر",
    slug: "product/capabilities/renewable-energy",
    href: "/product/capabilities/renewable-energy",
    narrativeStage: "outcome",
    status: "active",
    icon: "sun",
    description:
      "این بخش تولید نیروگاه خورشیدی را پایش می‌کند و سهم واقعی آن را در مصرف مجموعه محاسبه می‌کند — نه بر اساس ظرفیت اسمی پنل. مخاطب آن مجموعه‌هایی است که مشمول الزام تأمین برق تجدیدپذیر هستند. خروجی آن، وضعیت انطباق و مقدار کسری یا مازاد تولید است.",
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
    links: [
      { label: "گزارش: ارزیابی سهم انرژی خورشیدی", slug: "reports/solar-share" },
      { label: "راهکار: الزام تأمین برق تجدیدپذیر", slug: "solutions/article-16" },
    ],
  },
];

/* ════════════════════════════════════════════════════════════════
   2 · Report pages (L4) — the product's real unit of value
   Names are verbatim; each page answers one management question.
   ════════════════════════════════════════════════════════════════ */

const REPORT_PAGES: CapabilityCategory[] = [
  {
    id: "r-contracted-power",
    title: "گزارش بهینه‌سازی قدرت قراردادی",
    slug: "reports/contracted-power",
    href: "/reports/contracted-power",
    narrativeStage: "decision",
    icon: "contract",
    description: "قدرت قراردادی شما زیاد است یا کم؟ این گزارش با تحلیل بیشینهٔ دیماند یک سال اخیر، عدد بهینه را مشخص می‌کند.",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "بیشینهٔ دیماند ثبت‌شده در یک سال اخیر، در برابر قدرت قراردادی فعلی",
          "اینکه قدرت قراردادی باید کاهش یابد یا افزایش",
          "ساعاتی که بیشترین ریسک تجاوز در آن‌ها وجود دارد",
        ],
      },
      {
        title: "چه کسی می‌خواند",
        body: ["مدیر انرژی و مدیر مالی — این گزارش مستقیماً به یک قلم ثابت قبض مربوط است."],
      },
      {
        title: "چه تصمیمی از آن بیرون می‌آید",
        body: ["درخواست تغییر قدرت قراردادی به شرکت توزیع، با عددی که پشتوانهٔ دادهٔ یک‌ساله دارد."],
      },
      {
        title: "چرا هر دو جهت خطا هزینه دارد",
        body: [
          "قدرت قراردادی بیش از نیاز، یعنی پرداخت هزینهٔ ثابت و ترانزیت برای ظرفیتی که استفاده نمی‌شود. قدرت قراردادی کمتر از نیاز، یعنی جریمهٔ تجاوز از دیماند. عدد بهینه جایی است که مجموع این دو کمینه شود.",
        ],
      },
    ],
    links: [
      { label: "گزارش: بیشینه مصرف اکتیو", slug: "reports/peak-demand" },
      { label: "راهکار: حذف جریمهٔ دیماند", slug: "solutions/demand-management" },
    ],
  },
  {
    id: "r-capacitor-design",
    title: "گزارش توان راکتیو جبرانی بانک خازنی",
    slug: "reports/capacitor-bank-design",
    href: "/reports/capacitor-bank-design",
    narrativeStage: "optimization",
    icon: "capacitor",
    description:
      "چه ظرفیتی، در چند پله، با کدام فیوز و کابل؟ این گزارش طراحی کامل بانک خازنی را از دادهٔ کنتور محاسبه می‌کند — بدون بازدید میدانی و بدون اندازه‌گیری جداگانه.",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "نمودار ساعتی توان راکتیو جبرانی، تا رسیدن به ضریب توان بالای ۰٫۹۱",
          "ظرفیت کل بانک خازنی، محاسبه‌شده از همان نمودار ساعتی",
          "تعداد پله‌ها، ظرفیت هر پله و خازن ثابت در صورت نیاز",
          "جریان هر خازن، جریان فیوز و سطح مقطع کابل مناسب",
          "پیشنهاد فیوز و کابل استاندارد موجود در بازار، برای هر پله",
        ],
      },
      {
        title: "چه کسی می‌خواند",
        body: ["مهندس برق کارخانه، و مشاور یا طراحی که مسئول تحویل طراحی بانک خازنی است."],
      },
      {
        title: "چه تصمیمی از آن بیرون می‌آید",
        body: ["مشخصات دقیق بانک خازنی برای خرید و نصب — بدون آزمون و خطا و بدون رفت‌وبرگشت با کارفرما."],
      },
      {
        title: "چرا دادهٔ ماهانهٔ قبض کافی نیست",
        body: [
          "قبض یک عدد تجمیعی ماهانه است و پیک‌های توان راکتیو در آن دیده نمی‌شوند. بانکی که با بار میانگین طراحی شود، در ساعات کم‌باری اضافه‌جبران می‌کند و در پیک کم می‌آورد. مبنای این گزارش، پروفایل ساعتی واقعی است.",
        ],
      },
      {
        title: "حد قانونی و هدف طراحی",
        body: [
          "جریمهٔ توان راکتیو برای مشترکان دیماندی زمانی اعمال می‌شود که ضریب توان از ۰٫۹ پایین‌تر باشد. هدف طراحی در این گزارش ۰٫۹۱ در نظر گرفته شده است تا نوسانات بار، ضریب را به زیر حد مجاز نبرد.",
        ],
      },
    ],
    links: [
      { label: "گزارش: نمودار ساعتی جبران‌ساز", slug: "reports/capacitor-bank-diagnostic" },
      { label: "برای مشاوران و طراحان برق", slug: "industries/consultants" },
      { label: "قابلیت: کیفیت توان", slug: "product/capabilities/power-quality" },
    ],
  },
  {
    id: "r-capacitor-diagnostic",
    title: "نمودار ساعتی جبران‌ساز بانک خازنی",
    slug: "reports/capacitor-bank-diagnostic",
    href: "/reports/capacitor-bank-diagnostic",
    narrativeStage: "intelligence",
    icon: "reactive",
    description: "بانک خازنی دارید — اما آیا کار می‌کند؟ این گزارش عملکرد واقعی بانک نصب‌شده را از روی دادهٔ کنتور نشان می‌دهد.",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        body: ["نمودار ساعتی جبران‌ساز، سه حالت را از هم تفکیک می‌کند:"],
        items: [
          "نمودار عمدتاً منفی — بانک خازنی اشتباه بسته شده است",
          "نمودار ترکیبی مثبت و منفی — رگولاتور یا پله‌بندی ایراد دارد",
          "نمودار عمدتاً مثبت — تعداد پله‌ها کافی نیست",
        ],
      },
      {
        title: "چه کسی می‌خواند",
        body: ["مهندس برق کارخانه، پیش از تخصیص بودجه برای اصلاح بانک خازنی."],
      },
      {
        title: "چه تصمیمی از آن بیرون می‌آید",
        body: ["اینکه مشکل از نصب است، از تنظیم رگولاتور، یا از ظرفیت — سه اقدام کاملاً متفاوت با سه هزینهٔ متفاوت."],
      },
      {
        title: "چرا این گزارش مهم است",
        body: [
          "نصب‌بودن بانک خازنی به‌معنای کارکردن آن نیست. بانکی با طراحی اشتباه، رگولاتور بدتنظیم یا پله‌بندی نامناسب، جریمه را حذف نمی‌کند و هزینهٔ آن پرداخت شده است.",
        ],
      },
    ],
    links: [
      { label: "گزارش: توان راکتیو جبرانی بانک خازنی", slug: "reports/capacitor-bank-design" },
      { label: "قابلیت: کیفیت توان", slug: "product/capabilities/power-quality" },
    ],
  },
  {
    id: "r-optimal-purchase",
    title: "گزارش خرید بهینه انرژی ماه جاری",
    slug: "reports/optimal-purchase",
    href: "/reports/optimal-purchase",
    narrativeStage: "decision",
    icon: "cart",
    description: "تا پایان ماه چقدر برق بخرید که نه جریمهٔ کسری بدهید و نه خرید مازاد روی دستتان بماند؟",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "پیش‌بینی مصرف روزهای باقی‌ماندهٔ ماه، بر اساس الگوی بار روزهای گذشته",
          "پیش‌بینی مصرف ماه آینده، بر اساس سابقهٔ مصرف",
          "مقدار بهینهٔ خرید، با هدف کمترین هزینهٔ نهایی با احتساب جریمه‌ها",
          "سهم برق تجدیدپذیر موردنیاز برای رعایت الزام",
          "تفکیک خرید از بورس انرژی و قراردادهای دوجانبه",
        ],
      },
      {
        title: "چه کسی می‌خواند",
        body: ["مسئول تأمین انرژی، مدیر مالی، و خرده‌فروشان برق برای مدیریت سبد."],
      },
      {
        title: "چه تصمیمی از آن بیرون می‌آید",
        body: ["مقدار خرید این ماه — یک عدد، نه یک بازه."],
      },
      {
        title: "چرا برآورد کافی نیست",
        body: [
          "انحراف از مقدار خریداری‌شده از هر دو طرف هزینه دارد: کسری با نرخ تنبیهی تسویه می‌شود و مازاد هزینهٔ اضافی تحمیل می‌کند. کاهش خطای برآورد، مستقیماً هزینهٔ تأمین را کم می‌کند.",
        ],
      },
    ],
    links: [
      { label: "راهکار: الزام خرید از بازار", slug: "solutions/market-purchase" },
      { label: "گزارش: ارزیابی سهم انرژی خورشیدی", slug: "reports/solar-share" },
    ],
  },
  {
    id: "r-solar-share",
    title: "گزارش ارزیابی سهم انرژی خورشیدی",
    slug: "reports/solar-share",
    href: "/reports/solar-share",
    narrativeStage: "outcome",
    icon: "sun",
    description: "پنل خورشیدی دارید — اما سهم واقعی آن در مصرف شما چقدر است، و آیا الزام رعایت شده است؟",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "سهم واقعی انرژی خورشیدی در مصرف مجموعه، نه بر اساس ظرفیت اسمی پنل",
          "بررسی خودکار وضعیت انطباق با الزام تأمین برق تجدیدپذیر",
          "کسری یا مازاد تولید، به تفکیک روزانه، ماهانه و سالانه",
        ],
      },
      {
        title: "چه کسی می‌خواند",
        body: ["مدیر انرژی مجموعه‌های مشمول الزام، و صاحبان نیروگاه خورشیدی خودمصرف."],
      },
      {
        title: "چه تصمیمی از آن بیرون می‌آید",
        body: ["اینکه چه مقدار برق سبز باید خریداری شود، یا چه ظرفیتی باید اضافه شود."],
      },
      {
        title: "چرا عدد واقعی تولید اهمیت دارد",
        body: [
          "تسویهٔ مازاد یا کسری با شرکت خرده‌فروش، بر پایهٔ تولید واقعی انجام می‌شود. بدون اندازه‌گیری، این تسویه قابل بررسی نیست.",
        ],
      },
    ],
    links: [
      { label: "راهکار: الزام تأمین برق تجدیدپذیر", slug: "solutions/article-16" },
      { label: "گزارش: خرید بهینه انرژی", slug: "reports/optimal-purchase" },
    ],
  },
  {
    id: "r-load-profile",
    title: "گزارش دریافت داده‌های کنتور (پروفایل بار)",
    slug: "reports/load-profile",
    href: "/reports/load-profile",
    narrativeStage: "data",
    icon: "loadprofile",
    description: "جزئیات دقیق پارامترهای الکتریکی کنتور، در بازهٔ زمانی و با تناوب دلخواه شما.",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "دیماند مصرفی",
          "انرژی مصرفی (مثبت، منفی و ترکیبی)",
          "توان و ضریب توان",
          "جریان و ولتاژ",
          "میزان تولید",
        ],
      },
      {
        title: "تناوب گزارش",
        body: ["انتخاب نوع گزارش در اختیار شماست:"],
        items: [
          "تناوب ۱۵ دقیقه‌ای یا ساعتی، برای تحلیل دقیق نوسانات",
          "گزارش روزانه، برای بررسی عملکرد هر روز",
          "گزارش ماهانه، برای تحلیل روند بلندمدت",
        ],
      },
      {
        title: "چه کسی می‌خواند",
        body: ["مهندس برق و کارشناس انرژی؛ این گزارش مبنای دادهٔ بیشتر تحلیل‌های دیگر است."],
      },
    ],
    links: [
      { label: "قابلیت: پایش و تحلیل مصرف", slug: "product/capabilities/consumption-monitoring" },
      { label: "گزارش: بیشینه مصرف اکتیو", slug: "reports/peak-demand" },
    ],
  },
  {
    id: "r-peak-demand",
    title: "گزارش بیشینه مصرف اکتیو",
    slug: "reports/peak-demand",
    href: "/reports/peak-demand",
    narrativeStage: "data",
    icon: "peak",
    description: "پیک مصرف دقیقاً چه زمانی رخ داده است؟ این گزارش بیشترین توان اکتیو ثبت‌شده را با زمان دقیق وقوع نشان می‌دهد.",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "ماکسیمم مصرف هر کنتور، به همراه زمان دقیق وقوع",
          "روند بیشینهٔ مصرف به‌صورت روزانه",
          "روزی که بیشترین مصرف در کل دوره در آن رخ داده است",
        ],
      },
      {
        title: "چه کسی می‌خواند",
        body: ["بهره‌بردار و مدیر تولید؛ کسی که می‌تواند زمان راه‌اندازی تجهیزات را جابه‌جا کند."],
      },
      {
        title: "چه تصمیمی از آن بیرون می‌آید",
        body: [
          "شناسایی تجهیز یا شیفتی که پیک را می‌سازد، و امکان جابه‌جایی آن. راه‌اندازی هم‌زمان چند تجهیز پرمصرف، شایع‌ترین علت جهش ناگهانی دیماند است.",
        ],
      },
    ],
    links: [
      { label: "گزارش: بهینه‌سازی قدرت قراردادی", slug: "reports/contracted-power" },
      { label: "راهکار: حذف جریمهٔ دیماند", slug: "solutions/demand-management" },
    ],
  },
  {
    id: "r-demand-excess",
    title: "گزارش کنتورهای دارای تجاوز از دیماند قراردادی",
    slug: "reports/demand-excess-meters",
    href: "/reports/demand-excess-meters",
    narrativeStage: "decision",
    icon: "gauge",
    description: "کدام کنتورها، در چه ساعتی، از قدرت قراردادی عبور کرده‌اند؟",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "کنتورها یا گروه‌هایی که در بازهٔ انتخابی از قدرت قراردادی عبور کرده‌اند",
          "ساعت وقوع تجاوز برای هر کنتور",
        ],
      },
      {
        title: "چه کسی می‌خواند",
        body: ["مدیر انرژی مجموعه‌های چندسایتی و هلدینگ‌هایی که تعداد زیادی کنتور دارند."],
      },
      {
        title: "چه تصمیمی از آن بیرون می‌آید",
        body: ["اینکه اقدام اصلاحی از کدام سایت یا کدام کنتور شروع شود."],
      },
    ],
    links: [
      { label: "قابلیت: هشدارها و مدیریت دیماند", slug: "product/capabilities/demand-management" },
      { label: "گزارش: داشبورد مدیریتی هلدینگ", slug: "reports/holding-dashboard" },
    ],
  },
  {
    id: "r-comparison",
    title: "گزارش مقایسه مصرف",
    slug: "reports/consumption-comparison",
    href: "/reports/consumption-comparison",
    narrativeStage: "data",
    icon: "compare",
    description: "مصرف شما نسبت به دورهٔ قبل چه تغییری کرده است؟ دو بازهٔ زمانی دلخواه را کنار هم ببینید.",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "مصرف بازهٔ اول و مصرف بازهٔ دوم، کنار هم",
          "اختلاف مصرف دو دوره",
          "درصد تغییرات مصرف",
        ],
      },
      {
        title: "نحوهٔ استفاده",
        body: ["کافی است دو بازهٔ زمانی با مدت‌زمان یکسان انتخاب کنید تا مقایسه انجام شود."],
      },
      {
        title: "چه تصمیمی از آن بیرون می‌آید",
        body: ["اینکه اقدام اصلاحی انجام‌شده اثر داشته است یا نه — سنجش نتیجه، نه گمانه‌زنی."],
      },
    ],
    links: [{ label: "قابلیت: پایش و تحلیل مصرف", slug: "product/capabilities/consumption-monitoring" }],
  },
  {
    id: "r-bill-cost",
    title: "گزارش بهای انرژی مصرفی قبض",
    slug: "reports/bill-energy-cost",
    href: "/reports/bill-energy-cost",
    narrativeStage: "outcome",
    icon: "rial",
    description: "مصرف و هزینهٔ انرژی در هر بازهٔ زمانی، یک‌جا و قابل‌تفکیک.",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "محاسبهٔ بهای انرژی مصرفی در بازهٔ انتخابی",
          "شناسایی مشترکین پرمصرف",
          "پیشنهاد راهکارهای بهینه‌سازی مصرف",
        ],
      },
      {
        title: "چه کسی می‌خواند",
        body: ["مدیر مالی و مدیر انرژی؛ این گزارش زبان مشترک بین بهره‌برداری و حسابداری است."],
      },
    ],
    links: [{ label: "قابلیت: مدیریت انرژی و هزینه", slug: "product/capabilities/energy-cost-management" }],
  },
  {
    id: "r-observability",
    title: "گزارش رویت‌پذیری",
    slug: "reports/observability",
    href: "/reports/observability",
    narrativeStage: "data",
    icon: "eye",
    description: "چه بخشی از دادهٔ مصرف شما واقعی است و چه بخشی تخمینی؟",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        body: [
          "مصرف واقعی و مصرف تخمینی در بازه‌های زمانی مختلف، به‌صورت نمودار و جدول.",
        ],
      },
      {
        title: "چرا این گزارش وجود دارد",
        body: [
          "دادهٔ کنتور همیشه کامل نیست؛ قطعی ارتباط و خطای خوانش باعث می‌شود بخشی از داده تخمین زده شود. هر تحلیلی که روی این داده انجام می‌شود، به‌اندازهٔ سهم دادهٔ واقعی قابل‌اتکاست.",
          "به‌جای پنهان‌کردن این موضوع، آن را اندازه می‌گیریم و نشان می‌دهیم.",
        ],
      },
      {
        title: "چه تصمیمی از آن بیرون می‌آید",
        body: ["اینکه به کدام تحلیل می‌توان اتکا کرد، و کدام کنتور نیاز به پیگیری ارتباطی دارد."],
      },
    ],
    links: [{ label: "گزارش: سلامت کنتورها", slug: "reports/meter-health" }],
  },
  {
    id: "r-meter-register",
    title: "گزارش کنتورهای هوشمند",
    slug: "reports/meter-register",
    href: "/reports/meter-register",
    narrativeStage: "data",
    icon: "pin",
    description: "مشخصات فنی، اطلاعات مشترک و وضعیت کنتورها — در قالب جدول کامل و روی نقشهٔ تعاملی.",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "مشخصات فنی هر کنتور",
          "اطلاعات مشترک",
          "وضعیت کنتورها در جدول کامل",
          "نمایش کنتورها روی نقشهٔ تعاملی",
        ],
      },
      {
        title: "چه کسی می‌خواند",
        body: ["مدیر دارایی، مدیر هلدینگ و خرده‌فروش برق؛ هر مجموعه‌ای که تعداد کنتورهایش از حافظه بیشتر است."],
      },
    ],
    links: [{ label: "گزارش: سلامت کنتورها", slug: "reports/meter-health" }],
  },
  {
    id: "r-voltage-quality",
    title: "گزارش هشدار کیفیت ولتاژ",
    slug: "reports/voltage-quality",
    href: "/reports/voltage-quality",
    narrativeStage: "intelligence",
    icon: "voltage",
    description: "کدام مشترک واقعاً به استابلایزر نیاز دارد؟ پاسخ این پرسش را از روی قبض برق نمی‌توان فهمید.",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "شناسایی افت ولتاژ و افزایش ولتاژ",
          "پایش نوسانات و عدم تعادل فازها",
          "نمایش مکانی کیفیت ولتاژ مشترکین روی نقشه",
          "وضعیت هر مشترک در ۲۴ ساعت اخیر",
        ],
      },
      {
        title: "چه کسی می‌خواند",
        body: ["مهندس برق کارخانه، و خرده‌فروش یا شرکت توزیعی که باید دربارهٔ تجهیز حفاظتی تصمیم بگیرد."],
      },
      {
        title: "چه تصمیمی از آن بیرون می‌آید",
        body: [
          "اینکه کدام زیرمجموعه‌ها در وضعیت پرخطر هستند و دقیقاً کجا اقدام اصلاحی لازم است — به‌جای نصب تجهیز برای همه.",
        ],
      },
    ],
    links: [{ label: "قابلیت: کیفیت توان", slug: "product/capabilities/power-quality" }],
  },
  {
    id: "r-meter-health",
    title: "گزارش سلامت کنتورها",
    slug: "reports/meter-health",
    href: "/reports/meter-health",
    narrativeStage: "intelligence",
    icon: "alert",
    description: "کدام کنتورهای سبد شما رفتار غیرعادی دارند؟",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "کنتورهای مشکوک به استخراج رمزارز",
          "کنتورهای خاموش یا آفلاین",
          "کنتورهای معیوب با مصرف ثابت",
          "کنتورهای با ضریب توان کمتر از حد قانونی",
          "کنتورهای دارای افزایش مصرف نسبت به سال گذشته",
        ],
      },
      {
        title: "چه کسی می‌خواند",
        body: ["خرده‌فروش برق، شرکت توزیع، و مدیر هلدینگ با تعداد زیاد کنتور."],
      },
      {
        title: "چه تصمیمی از آن بیرون می‌آید",
        body: ["فهرست اولویت‌دار برای پیگیری میدانی — کدام کنتور باید بازدید شود."],
      },
    ],
    links: [
      { label: "قابلیت: پایش سلامت کنتورها", slug: "product/capabilities/meter-health" },
      { label: "صنعت: خرده‌فروشان و توزیع برق", slug: "industries/electricity-retailers" },
    ],
  },
  {
    id: "r-holding-dashboard",
    title: "داشبورد مدیریتی هلدینگ",
    slug: "reports/holding-dashboard",
    href: "/reports/holding-dashboard",
    narrativeStage: "decision",
    icon: "holding",
    description: "چندین واحد صنعتی، کشاورزی، تجاری و نیروگاهی — همه در یک صفحه، لحظه‌به‌لحظه.",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "مصرف لحظه‌ای همهٔ واحدها",
          "مقایسهٔ عملکرد در بازه‌های دلخواه",
          "هشدار تجاوز از دیماند",
          "گزارش تلفیقی هزینهٔ انرژی کل هلدینگ",
        ],
      },
      {
        title: "انواع مصرف‌کننده‌ای که پشتیبانی می‌شوند",
        body: [
          "دیزل برق اضطراری، نیروگاه خورشیدی، نیروگاه گازی، کنتور گاز کارخانه، موتور آب کشاورزی، کارخانه و مهمانسرا — همه روی یک داشبورد.",
        ],
      },
      {
        title: "چه تصمیمی از آن بیرون می‌آید",
        body: ["تخصیص اولویت بین سایت‌ها، و مدیریت متمرکز جرایم به‌جای پیگیری جداگانهٔ هر زیرمجموعه."],
      },
    ],
    links: [
      { label: "راهکار: مدیریت انرژی چندسایتی", slug: "solutions/multi-site" },
      { label: "صنعت: هلدینگ‌ها", slug: "industries/holdings" },
    ],
  },
];

/* ════════════════════════════════════════════════════════════════
   3 · Solution pages — the business problem, not the tool
   problem / solution / benefit triples relocated from the retired
   /services page (data.ts → SERVICES).
   ════════════════════════════════════════════════════════════════ */

const SOLUTION_PAGES: CapabilityCategory[] = [
  {
    id: "s-demand",
    title: "حذف جریمهٔ دیماند",
    slug: "solutions/demand-management",
    href: "/solutions/demand-management",
    narrativeStage: "outcome",
    icon: "gauge",
    description: "قدرت قراردادی را به اندازهٔ نیاز واقعی تنظیم کنید و پیش از عبور از آن، هشدار بگیرید.",
    featureGroups: [],
    sections: [
      {
        title: "مسئله",
        body: [
          "جریمهٔ تجاوز از دیماند، یا هزینهٔ ثابت قراردادی که بیش از نیاز است. در بسیاری از کارخانه‌ها، مدیران زمانی متوجه مشکل می‌شوند که قبض با جریمهٔ سنگین صادر شده است.",
          "سه عامل معمولاً این اتفاق را می‌سازند: راه‌اندازی هم‌زمان تجهیزات پرمصرف، بی‌اطلاعی از ساعت وقوع پیک واقعی، و قدرت قراردادی نامتناسب با الگوی مصرف.",
        ],
      },
      {
        title: "روش",
        body: [
          "تحلیل دوازده‌ماههٔ دیماند برای تعیین قدرت قراردادی بهینه، و پایش لحظه‌ای بار با هشدار پیش از رسیدن به سقف قرارداد — از طریق نوتیفیکیشن و پیامک.",
        ],
      },
      {
        title: "گزارش‌هایی که این کار را انجام می‌دهند",
        items: [
          "گزارش بهینه‌سازی قدرت قراردادی",
          "گزارش بیشینه مصرف اکتیو",
          "گزارش کنتورهای دارای تجاوز از دیماند قراردادی",
        ],
      },
      {
        title: "چه چیزی تغییر می‌کند",
        body: [
          "ریسک جریمه پیش از وقوع قابل‌مشاهده می‌شود، و هزینهٔ ثابت اشتراک بر مبنای دادهٔ واقعی تنظیم می‌شود — نه بر مبنای عددی که سال‌ها پیش انتخاب شده است.",
        ],
      },
    ],
    links: [
      { label: "گزارش: بهینه‌سازی قدرت قراردادی", slug: "reports/contracted-power" },
      { label: "قابلیت: هشدارها و مدیریت دیماند", slug: "product/capabilities/demand-management" },
    ],
  },
  {
    id: "s-power-quality",
    title: "حذف جریمهٔ توان راکتیو",
    slug: "solutions/power-quality",
    href: "/solutions/power-quality",
    narrativeStage: "outcome",
    icon: "capacitor",
    description: "ضریب توان را با طراحی درست بانک خازنی اصلاح کنید — بر اساس پروفایل واقعی بار، نه میانگین قبض.",
    featureGroups: [],
    sections: [
      {
        title: "مسئله",
        body: [
          "جریمهٔ راکتیو در قبض، بدون اینکه دلیلش روشن باشد. و بانک خازنی‌ای که نصب شده اما جریمه را حذف نکرده است.",
          "با تغییر نحوهٔ محاسبهٔ ضریب زیان، وزن این قلم در قبض بیشتر از گذشته شده است.",
        ],
      },
      {
        title: "روش",
        body: [
          "تحلیل ضریب توان در ساعات مختلف، محاسبهٔ توان راکتیو جبرانی موردنیاز تا رسیدن به ضریب توان بالای ۰٫۹۱، و طراحی ظرفیت و پله‌بندی بانک بر اساس پروفایل ساعتی واقعی بار.",
          "اگر بانک خازنی از قبل نصب است، ابتدا عملکرد واقعی آن بررسی می‌شود — پیش از هر هزینه‌ای برای اصلاح.",
        ],
      },
      {
        title: "گزارش‌هایی که این کار را انجام می‌دهند",
        items: [
          "گزارش توان راکتیو جبرانی بانک خازنی",
          "نمودار ساعتی جبران‌ساز بانک خازنی",
          "گزارش هشدار کیفیت ولتاژ",
        ],
      },
      {
        title: "چه چیزی تغییر می‌کند",
        body: [
          "طراحی بانک خازنی بدون بازدید میدانی و بدون آزمون و خطا انجام می‌شود، و منشأ جریمهٔ راکتیو از یک عدد مبهم در قبض به یک مشخصهٔ فنی قابل‌اصلاح تبدیل می‌شود.",
        ],
      },
    ],
    links: [
      { label: "گزارش: توان راکتیو جبرانی بانک خازنی", slug: "reports/capacitor-bank-design" },
      { label: "قابلیت: کیفیت توان", slug: "product/capabilities/power-quality" },
    ],
  },
  {
    id: "s-procurement",
    title: "خرید برق بدون جریمهٔ انحراف",
    slug: "solutions/energy-procurement",
    href: "/solutions/energy-procurement",
    narrativeStage: "outcome",
    icon: "cart",
    description: "مقدار بهینهٔ خرید را محاسبه کنید، نه برآورد — انحراف از هر دو طرف هزینه دارد.",
    featureGroups: [],
    sections: [
      {
        title: "مسئله",
        body: [
          "تردید بین تعرفهٔ توزیع و خرید از بازار، و نداشتن تخمین دقیق از مقدار خرید ماه جاری. اگر مصرف واقعی از حجم خریداری‌شده فاصله بگیرد، مازاد یا کسری با نرخ‌های تنبیهی تسویه می‌شود.",
        ],
      },
      {
        title: "روش",
        body: [
          "پیش‌بینی مصرف بر اساس الگوی بار روزهای گذشته و سابقهٔ مصرف، و محاسبهٔ مقداری که کمترین هزینهٔ نهایی را — با احتساب جریمه‌ها — تولید می‌کند. خروجی شامل تفکیک خرید از بورس انرژی و قراردادهای دوجانبه است.",
        ],
      },
      {
        title: "گزارش‌هایی که این کار را انجام می‌دهند",
        items: [
          "گزارش خرید بهینه انرژی ماه جاری",
          "گزارش پروفایل بار",
          "گزارش مقایسه مصرف",
        ],
      },
      {
        title: "چه چیزی تغییر می‌کند",
        body: ["تصمیم خرید ماهانه بر یک عدد محاسبه‌شده تکیه می‌کند، و دقت پیش‌بینی مستقیماً به کاهش هزینهٔ تأمین تبدیل می‌شود."],
      },
    ],
    links: [
      { label: "گزارش: خرید بهینه انرژی ماه جاری", slug: "reports/optimal-purchase" },
      { label: "راهکار: الزام خرید از بازار", slug: "solutions/market-purchase" },
    ],
  },
  {
    id: "s-multi-site",
    title: "مدیریت انرژی چندسایتی",
    slug: "solutions/multi-site",
    href: "/solutions/multi-site",
    narrativeStage: "outcome",
    icon: "holding",
    description: "یک زبان مشترک برای همهٔ زیرمجموعه‌ها، به‌جای گزارش‌هایی که با هم قابل مقایسه نیستند.",
    featureGroups: [],
    sections: [
      {
        title: "مسئله",
        body: [
          "چالش اصلی مجموعه‌های چندسایتی، فقدان زبان مشترک داده است: هر سایت با کنتور، تعرفه و فرمت گزارش خودش. نتیجه، گزارش‌هایی است که قابل مقایسه نیستند و تجمیع آن‌ها هفته‌ها طول می‌کشد.",
        ],
      },
      {
        title: "روش",
        body: [
          "اتصال خودکار دادهٔ همهٔ سایت‌ها، استانداردسازی شاخص‌ها، و یک داشبورد تجمیعی که انواع مختلف مصرف‌کننده — از کارخانه و نیروگاه خورشیدی تا موتور آب کشاورزی و مهمانسرا — را کنار هم نشان می‌دهد.",
        ],
      },
      {
        title: "گزارش‌هایی که این کار را انجام می‌دهند",
        items: [
          "داشبورد مدیریتی هلدینگ",
          "گزارش کنتورهای دارای تجاوز از دیماند قراردادی",
          "گزارش کنتورهای هوشمند",
        ],
      },
      {
        title: "چه چیزی تغییر می‌کند",
        body: ["مدیریت جرایم متمرکز می‌شود و مقایسهٔ عملکرد زیرمجموعه‌ها با شاخص‌های یکسان ممکن می‌شود."],
      },
    ],
    links: [
      { label: "گزارش: داشبورد مدیریتی هلدینگ", slug: "reports/holding-dashboard" },
      { label: "صنعت: هلدینگ‌ها", slug: "industries/holdings" },
    ],
  },
  {
    id: "s-article-16",
    title: "الزام تأمین برق تجدیدپذیر (ماده ۱۶)",
    slug: "solutions/article-16",
    href: "/solutions/article-16",
    narrativeStage: "outcome",
    icon: "leaf",
    description: "سهم واقعی انرژی تجدیدپذیر در مصرف خود را بسنجید و وضعیت انطباق را قابل‌ارائه کنید.",
    featureGroups: [],
    sections: [
      {
        title: "الزام قانونی",
        body: [
          "بر اساس ماده ۱۶ قانون جهش تولید دانش‌بنیان، صنایع بالای یک مگاوات موظف‌اند بخشی از برق مورد نیاز سالانهٔ خود را از منابع تجدیدپذیر تأمین کنند — از طریق احداث نیروگاه تجدیدپذیر یا خرید برق سبز از بورس انرژی. این سهم در سال‌های اجرای قانون افزایش می‌یابد.",
          "در صورت عدم اقدام، آن سهم از برق مصرفی با تعرفهٔ برق تجدیدپذیر محاسبه و دریافت می‌شود، و مجموعه در زمان‌های کمبود برق در اولویت قطع قرار می‌گیرد.",
          "این صفحه توضیح عمومی الزام است و جایگزین مشاورهٔ حقوقی نیست. برای درصد دقیق سال جاری، به آیین‌نامهٔ اجرایی جاری مراجعه کنید.",
        ],
      },
      {
        title: "نقش بهسا دیجیتال",
        body: [
          "بهسا این الزام را به یک محاسبه تبدیل می‌کند، نه یک برآورد. بسیاری از صاحبان پنل خورشیدی عدد واقعی تولید خود را ندارند — و بدون آن، نه وضعیت انطباق مشخص است و نه تسویهٔ مازاد و کسری با شرکت خرده‌فروش قابل بررسی است.",
        ],
        items: [
          "سهم واقعی انرژی خورشیدی در مصرف مجموعه، نه ظرفیت اسمی پنل",
          "بررسی خودکار وضعیت انطباق",
          "تشخیص کسری یا مازاد تولید به تفکیک روزانه، ماهانه و سالانه",
          "پیش‌بینی میزان پیش‌خرید برق تجدیدپذیر",
        ],
      },
      {
        title: "گزارش‌هایی که این کار را انجام می‌دهند",
        items: ["گزارش ارزیابی سهم انرژی خورشیدی", "گزارش خرید بهینه انرژی ماه جاری"],
      },
    ],
    links: [
      { label: "گزارش: ارزیابی سهم انرژی خورشیدی", slug: "reports/solar-share" },
      { label: "قابلیت: انرژی‌های تجدیدپذیر", slug: "product/capabilities/renewable-energy" },
    ],
  },
  {
    id: "s-market-purchase",
    title: "الزام خرید برق از بازار (۱۵۰ کیلووات به بالا)",
    slug: "solutions/market-purchase",
    href: "/solutions/market-purchase",
    narrativeStage: "outcome",
    icon: "chart",
    description: "سهم بازار برق را دقیق برآورد کنید؛ خطا در مقدار خرید از هر دو طرف هزینه دارد.",
    featureGroups: [],
    sections: [
      {
        title: "الزام قانونی",
        body: [
          "بر اساس بند «ب» ماده ۴۳ قانون برنامهٔ پنج‌سالهٔ هفتم پیشرفت، مشترکان با قدرت قراردادی ۱۵۰ کیلووات و بالاتر، بخشی از برق مصرفی خود را باید از طریق سازوکارهای بازار تأمین کنند: بورس انرژی، خرید از خرده‌فروشان، یا قراردادهای دوجانبه.",
          "این صفحه توضیح عمومی الزام است و جایگزین مشاورهٔ حقوقی نیست. برای جزئیات و نرخ‌های جاری، به آیین‌نامهٔ اجرایی مراجعه کنید.",
        ],
      },
      {
        title: "نقش بهسا دیجیتال",
        body: [
          "بدون برنامه‌ریزی، هر دو جهت خطا هزینه دارد: کسری خرید جریمه می‌شود و خرید مازاد هزینهٔ اضافی تحمیل می‌کند. گزارش خرید بهینه، مقدار خرید را طوری محاسبه می‌کند که مجموع این دو کمینه شود.",
        ],
        items: [
          "پیش‌بینی مصرف روزهای باقی‌ماندهٔ ماه بر اساس الگوی واقعی بار",
          "مقدار بهینهٔ خرید با هدف کمترین هزینهٔ نهایی",
          "تفکیک خرید از بورس انرژی و قراردادهای دوجانبه",
          "محاسبهٔ سهم برق تجدیدپذیر موردنیاز",
        ],
      },
      {
        title: "گزارش‌هایی که این کار را انجام می‌دهند",
        items: ["گزارش خرید بهینه انرژی ماه جاری", "گزارش پروفایل بار"],
      },
    ],
    links: [
      { label: "گزارش: خرید بهینه انرژی ماه جاری", slug: "reports/optimal-purchase" },
      { label: "راهکار: خرید برق بدون جریمهٔ انحراف", slug: "solutions/energy-procurement" },
    ],
  },
];

/* ════════════════════════════════════════════════════════════════
   4 · Industry pages — load pattern, cost items, the three reports
   that matter most to that vertical.
   ════════════════════════════════════════════════════════════════ */

const INDUSTRY_PAGES: CapabilityCategory[] = [
  {
    id: "i-heavy",
    title: "صنایع پرمصرف",
    slug: "industries/heavy-industry",
    href: "/industries/heavy-industry",
    narrativeStage: "outcome",
    icon: "factory",
    description: "فولاد، سیمان، پتروشیمی، ریخته‌گری و صنایع غذایی — با قبض‌های سنگین و ریسک دائمی جریمهٔ دیماند.",
    featureGroups: [],
    sections: [
      {
        title: "الگوی مصرف این صنایع",
        body: [
          "بار پایهٔ بالا با جهش‌های ناگهانی در زمان راه‌اندازی تجهیزات سنگین. پیک معمولاً با شروع شیفت یا راه‌اندازی هم‌زمان چند دستگاه پرتوان ساخته می‌شود — و در قبض ماهانه دیده نمی‌شود.",
        ],
      },
      {
        title: "اقلام هزینه‌ای که بیشتر دیده می‌شوند",
        items: [
          "جریمهٔ تجاوز از دیماند قراردادی",
          "جریمهٔ توان راکتیو و بانک خازنی بی‌اثر",
          "مصرف در ساعات اوج‌بار با گران‌ترین تعرفه",
        ],
      },
      {
        title: "سه گزارشی که بیشترین اهمیت را دارند",
        items: [
          "گزارش بهینه‌سازی قدرت قراردادی",
          "گزارش توان راکتیو جبرانی بانک خازنی",
          "گزارش بیشینه مصرف اکتیو",
        ],
      },
    ],
    links: [
      { label: "راهکار: حذف جریمهٔ دیماند", slug: "solutions/demand-management" },
      { label: "راهکار: حذف جریمهٔ توان راکتیو", slug: "solutions/power-quality" },
    ],
  },
  {
    id: "i-holdings",
    title: "هلدینگ‌ها و گروه‌های چندسایتی",
    slug: "industries/holdings",
    href: "/industries/holdings",
    narrativeStage: "outcome",
    icon: "holding",
    description: "زیرمجموعه‌های متنوع با کنتور، تعرفه و فرمت گزارش متفاوت — و گزارش‌هایی که با هم قابل مقایسه نیستند.",
    featureGroups: [],
    sections: [
      {
        title: "وضعیت معمول",
        body: [
          "چندین واحد صنعتی، کشاورزی، تجاری و نیروگاهی، هرکدام با سامانه و گزارش خودش. تجمیع ماهانه زمان‌بر است و خروجی آن، اعدادی است که مبنای مقایسه ندارند.",
        ],
      },
      {
        title: "انواع مصرف‌کننده‌ای که روی یک داشبورد جمع می‌شوند",
        items: [
          "کارخانه و واحد صنعتی",
          "نیروگاه خورشیدی و نیروگاه گازی",
          "دیزل برق اضطراری",
          "کنتور گاز کارخانه",
          "چاه و موتور آب کشاورزی",
          "مهمانسرا و ساختمان اداری",
        ],
      },
      {
        title: "سه گزارشی که بیشترین اهمیت را دارند",
        items: [
          "داشبورد مدیریتی هلدینگ",
          "گزارش کنتورهای دارای تجاوز از دیماند قراردادی",
          "گزارش بهای انرژی مصرفی قبض",
        ],
      },
    ],
    links: [
      { label: "راهکار: مدیریت انرژی چندسایتی", slug: "solutions/multi-site" },
      { label: "گزارش: داشبورد مدیریتی هلدینگ", slug: "reports/holding-dashboard" },
    ],
  },
  {
    id: "i-consultants",
    title: "برای مشاوران و طراحان برق",
    slug: "industries/consultants",
    href: "/industries/consultants",
    narrativeStage: "optimization",
    icon: "consultant",
    description: "طراحی بانک خازنی بدون بازدید میدانی، بدون اندازه‌گیری جداگانه و بدون رفت‌وبرگشت با کارفرما.",
    featureGroups: [],
    sections: [
      {
        title: "مسئلهٔ شما",
        body: [
          "طراحی بر اساس دادهٔ ماهانهٔ قبض، یعنی طراحی بدون دیدن پیک‌های توان راکتیو. نتیجه‌اش بانک خازنی نادرست است: برگشت کار، اختلاف با کارفرما، و جریمه‌ای که حذف نشده.",
          "روش جایگزین — بازدید میدانی و محاسبهٔ دستی — هزینه و هفته‌ها زمان می‌برد، و خروجی آن یک عکس لحظه‌ای است، نه پروفایل یک سال.",
        ],
      },
      {
        title: "آنچه دریافت می‌کنید",
        items: [
          "پروفایل ساعتی توان راکتیو جبرانی تا رسیدن به ضریب توان بالای ۰٫۹۱",
          "ظرفیت کل بانک خازنی",
          "تعداد پله‌ها، ظرفیت هر پله و خازن ثابت در صورت نیاز",
          "جریان فیوز، جریان کابل و سطح مقطع مناسب",
          "پیشنهاد فیوز و کابل استاندارد موجود در بازار، برای هر پله",
        ],
      },
      {
        title: "تشخیص عیب بانک موجود",
        body: [
          "نمودار ساعتی جبران‌ساز نشان می‌دهد بانک نصب‌شده اشتباه بسته شده، رگولاتور ایراد دارد، یا پله‌ها کافی نیستند — پیش از آنکه کارفرما هزینه‌ای برای اصلاح بپردازد.",
        ],
      },
    ],
    links: [
      { label: "گزارش: توان راکتیو جبرانی بانک خازنی", slug: "reports/capacitor-bank-design" },
      { label: "گزارش: نمودار ساعتی جبران‌ساز", slug: "reports/capacitor-bank-diagnostic" },
    ],
  },
  {
    id: "i-retailers",
    title: "خرده‌فروشان و توزیع برق",
    slug: "industries/electricity-retailers",
    href: "/industries/electricity-retailers",
    narrativeStage: "intelligence",
    icon: "retail",
    description: "پایش سلامت کنتورهای سبد مشترکان و پیش‌بینی مصرف برای مدیریت خرید.",
    featureGroups: [],
    sections: [
      {
        title: "مسئلهٔ شما",
        body: [
          "سبد شما از صدها یا هزاران کنتور تشکیل شده است. کنتور خاموش، کنتور معیوب با مصرف ثابت و مصرف مشکوک، مستقیماً به انرژی بدون صورتحساب تبدیل می‌شوند — و بدون پایش خودکار، تا مدت‌ها دیده نمی‌شوند.",
        ],
      },
      {
        title: "آنچه دریافت می‌کنید",
        items: [
          "شناسایی کنتورهای مشکوک به استخراج رمزارز",
          "شناسایی کنتورهای خاموش، آفلاین یا معیوب با مصرف ثابت",
          "شناسایی کنتورهای با ضریب توان کمتر از حد قانونی",
          "نمایش کیفیت ولتاژ مشترکین روی نقشه، برای تصمیم دربارهٔ تجهیز حفاظتی",
          "پیش‌بینی مصرف مشتریان برای مدیریت سبد خرید",
        ],
      },
      {
        title: "سه گزارشی که بیشترین اهمیت را دارند",
        items: ["گزارش سلامت کنتورها", "گزارش هشدار کیفیت ولتاژ", "گزارش خرید بهینه انرژی ماه جاری"],
      },
    ],
    links: [
      { label: "قابلیت: پایش سلامت کنتورها", slug: "product/capabilities/meter-health" },
      { label: "گزارش: هشدار کیفیت ولتاژ", slug: "reports/voltage-quality" },
    ],
  },
];

/* ── Lookup ─────────────────────────────────────────────────────── */

/** every page rendered by the landing template from this file */
export const CONTENT_PAGES: CapabilityCategory[] = [
  ...REPORT_PAGES,
  ...SOLUTION_PAGES,
  ...INDUSTRY_PAGES,
];

const ALL_PAGES: CapabilityCategory[] = [...CAPABILITY_CATEGORIES, ...CONTENT_PAGES];

export const capabilityBySlug = (slug: string): CapabilityCategory | undefined =>
  ALL_PAGES.find((c) => c.slug === slug);

export const featureCount = (c: CapabilityCategory): number =>
  c.featureGroups.reduce((n, g) => n + g.items.length, 0);

/** the homepage «گزارش‌ها» band and the /reports index read this */
export const REPORTS = REPORT_PAGES.map((r) => ({
  title: r.title,
  href: r.href,
  icon: r.icon,
  question: r.description ?? "",
}));
