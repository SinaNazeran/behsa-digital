import type { IconName } from "@/components/icons";
import {
  BENEFITS, FEATURES, INDUSTRIES, PAIN_POINTS, PLATFORM_TABS, SOLUTIONS,
} from "@/content/data";

/* ════════════════════════════════════════════════════════════════
   Section registry — the contract between the CMS, the database and
   the frontend.

   Every editable band of the site is declared once here: which fields
   an editor sees, what the field is called in plain Persian, and the
   factory default content used to seed the database (and as a
   fallback when a section row does not exist yet).

   Adding a new editable section = one entry here + reading it in the
   view. No schema change and no new admin screen.
   ════════════════════════════════════════════════════════════════ */

export type ItemFieldName = "icon" | "tag" | "href" | "bullets" | "image" | "description";

export type ItemField = { name: ItemFieldName; label: string; hint?: string };

export type SectionDefaults = {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  videoUrl?: string;
  videoEnabled?: boolean;
  items?: {
    title: string;
    description?: string;
    icon?: IconName | "";
    tag?: string;
    href?: string;
    bullets?: string[];
  }[];
};

export type SectionDef = {
  key: string;
  /** admin menu label */
  label: string;
  /** one line explaining where this appears on the site */
  hint: string;
  group: "hero" | "home";
  header: {
    eyebrow?: string;
    title?: string;
    description?: string;
    cta?: boolean;
    media?: boolean;
    video?: boolean;
  };
  items?: {
    label: string;
    addLabel: string;
    titleLabel: string;
    fields: ItemField[];
    emptyHint?: string;
  };
  defaults: SectionDefaults;
};

const ICON_FIELD: ItemField = { name: "icon", label: "آیکون" };
const DESC_FIELD: ItemField = { name: "description", label: "توضیح کوتاه" };

export const SECTIONS: SectionDef[] = [
  {
    key: "hero",
    label: "بخش ابتدای صفحه اصلی (هیرو)",
    hint: "اولین چیزی که بازدیدکننده می‌بیند: ویدئو یا تصویر پس‌زمینه، عنوان و دکمه‌ها.",
    group: "hero",
    header: {
      eyebrow: "برچسب بالای عنوان",
      title: "عنوان اصلی",
      description: "متن زیر عنوان",
      media: true,
      video: true,
    },
    items: {
      label: "دکمه‌ها",
      addLabel: "دکمه جدید",
      titleLabel: "متن دکمه",
      fields: [{ name: "href", label: "آدرس دکمه", hint: "مثل /contact یا https://panel.behsa-digital.ir/login" }],
      emptyHint: "بدون دکمه هم نمایش داده می‌شود؛ فقط عنوان و متن دیده می‌شوند.",
    },
    defaults: {
      eyebrow: "پایش و مدیریت انرژی صنعتی",
      title: "کنترل مصرف،\nاز *کنتور* تا *قبض*.",
      description: "مصرف هر کنتور را لحظه‌ای ببینید، پیش از رسیدن به سقف دیماند هشدار بگیرید و جریمهٔ توان راکتیو را از قبض حذف کنید.",
      videoUrl: "/videos/hero.mp4?v=2",
      videoEnabled: true,
      items: [
        { title: "ورود به سامانه", href: "https://panel.behsa-digital.ir/login" },
        { title: "آشنایی با پلتفرم", href: "/product/platform" },
      ],
    },
  },
  {
    key: "companies",
    label: "مخاطبان بهسا (نوار شرکت‌ها)",
    hint: "نوار متحرک نام شرکت‌ها در پایین بخش هیرو.",
    group: "hero",
    header: { title: "عنوان نوار" },
    items: {
      label: "شرکت‌ها",
      addLabel: "شرکت جدید",
      titleLabel: "نام شرکت",
      fields: [ICON_FIELD, { name: "image", label: "لوگو (اختیاری)", hint: "اگر لوگو انتخاب شود، به‌جای آیکون نمایش داده می‌شود." }],
      emptyHint: "اگر هیچ شرکتی فعال نباشد، نوار نمایش داده نمی‌شود.",
    },
    defaults: {
      title: "مخاطبان بهسا در صنعت و انرژی",
      items: [
        { title: "بانک ملت", icon: "org" },
        { title: "عالیس", icon: "leaf" },
        { title: "فولاد مبارکه", icon: "factory" },
        { title: "پتروشیمی خلیج فارس", icon: "plant" },
        { title: "مپنا", icon: "tech" },
        { title: "ایران‌خودرو", icon: "precision" },
        { title: "پالایش نفت اصفهان", icon: "plant" },
        { title: "همراه اول", icon: "realtime" },
        { title: "ذوب‌آهن اصفهان", icon: "factory" },
        { title: "سیمان تهران", icon: "board" },
      ],
    },
  },
  {
    key: "pains",
    label: "چالش مشترک صنایع",
    hint: "کارت‌های چالش‌ها، بلافاصله بعد از هیرو.",
    group: "home",
    header: { eyebrow: "برچسب بخش", title: "عنوان بخش", description: "توضیح بخش", cta: true },
    items: {
      label: "چالش‌ها",
      addLabel: "چالش جدید",
      titleLabel: "عنوان چالش",
      fields: [ICON_FIELD, DESC_FIELD, { name: "tag", label: "متن لینک پایین کارت" }, { name: "href", label: "آدرس لینک" }],
    },
    defaults: {
      eyebrow: "چالش مشترک صنایع",
      title: "هزینه انرژی شما از کجا افزایش پیدا می‌کند؟",
      description: "چهار عامل پنهان که در قبض‌های صنعتی تکرار می‌شوند — و تا وقتی داده لحظه‌ای نداشته باشید، دیده نمی‌شوند.",
      ctaLabel: "مشاوره تخصصی",
      ctaHref: "/services",
      items: PAIN_POINTS.map((p) => ({ title: p.title, description: p.desc, icon: p.icon as IconName, tag: p.link, href: "/solutions" })),
    },
  },
  {
    key: "platform",
    label: "پلتفرم بهسا (تب‌ها)",
    hint: "چهار لایهٔ پلتفرم با فهرست قابلیت‌های هر لایه.",
    group: "home",
    header: { eyebrow: "برچسب بخش", title: "عنوان بخش", description: "توضیح بخش", cta: true },
    items: {
      label: "لایه‌ها",
      addLabel: "لایه جدید",
      titleLabel: "عنوان لایه",
      fields: [ICON_FIELD, DESC_FIELD, { name: "bullets", label: "فهرست موارد", hint: "هر مورد را در یک خط جداگانه بنویسید." }],
    },
    defaults: {
      eyebrow: "پلتفرم بهسا",
      title: "از داده خام تا تصمیم هوشمند",
      description: "چهار لایه یک‌پارچه؛ هرکدام خروجیِ لایه قبل را به تصمیم قابل‌اجرا تبدیل می‌کند.",
      ctaLabel: "جزئیات محصول",
      ctaHref: "/product",
      items: PLATFORM_TABS.map((t) => ({ title: t.title, description: t.desc, icon: t.icon as IconName, bullets: t.items })),
    },
  },
  {
    key: "solutions",
    label: "راهکارها",
    hint: "کارت‌های راهکار در میانهٔ صفحه اصلی.",
    group: "home",
    header: { eyebrow: "برچسب بخش", title: "عنوان بخش", description: "توضیح بخش" },
    items: {
      label: "راهکارها",
      addLabel: "راهکار جدید",
      titleLabel: "عنوان راهکار",
      fields: [ICON_FIELD, DESC_FIELD, { name: "tag", label: "برچسب سبز کارت" }, { name: "href", label: "آدرس لینک «بیشتر بدانید»" }],
    },
    defaults: {
      eyebrow: "راهکارها",
      title: "راهکارهای مدیریت هوشمند انرژی",
      description: "هر راهکار یک مسئله مالی مشخص را هدف می‌گیرد؛ از جریمه دیماند تا خرید گران برق.",
      items: SOLUTIONS.map((s) => ({ title: s.title, description: s.desc, icon: s.icon as IconName, tag: s.tag, href: "/solutions" })),
    },
  },
  {
    key: "dashboard",
    label: "داشبورد نمونه",
    hint: "فقط عنوان این بخش قابل ویرایش است؛ نمودارها و اعداد نمونه در کد می‌مانند.",
    group: "home",
    header: { eyebrow: "برچسب بخش", title: "عنوان بخش", description: "توضیح بخش" },
    defaults: {
      eyebrow: "داشبورد بهسا",
      title: "تمام داده‌های انرژی در یک نگاه",
      description: "نمایی واقعی از سامانه: شاخص‌های کلیدی، روندها، هشدارها و تولید خورشیدی — بدون نیاز به خروجی گرفتن از ده سامانه جدا.",
    },
  },
  {
    key: "features",
    label: "امکانات سامانه",
    hint: "شبکهٔ کارت‌های کوچک امکانات.",
    group: "home",
    header: { eyebrow: "برچسب بخش", title: "عنوان بخش", description: "توضیح بخش" },
    items: {
      label: "امکانات",
      addLabel: "امکان جدید",
      titleLabel: "عنوان امکان",
      fields: [ICON_FIELD, DESC_FIELD],
    },
    defaults: {
      eyebrow: "امکانات سامانه",
      title: "ابزارهای دقیق برای تصمیم‌گیری بهتر",
      description: "ده ابزار تحلیلی که هرکدام به یک سؤال مدیریتی پاسخ می‌دهند.",
      items: FEATURES.map((f) => ({ title: f.title, description: f.desc, icon: f.icon as IconName })),
    },
  },
  {
    key: "industries",
    label: "مخاطبان (صنایع)",
    hint: "کارت‌های «برای چه مجموعه‌هایی ساخته شده است؟».",
    group: "home",
    header: { eyebrow: "برچسب بخش", title: "عنوان بخش", description: "توضیح بخش" },
    items: {
      label: "مخاطبان",
      addLabel: "مخاطب جدید",
      titleLabel: "عنوان",
      fields: [ICON_FIELD, DESC_FIELD],
    },
    defaults: {
      eyebrow: "مخاطبان بهسا",
      title: "برای چه مجموعه‌هایی ساخته شده است؟",
      description: "هر بخش از زنجیره انرژی — از مصرف‌کننده صنعتی تا خرده‌فروش برق — ابزار اختصاصی خودش را دارد.",
      items: INDUSTRIES.map((s) => ({ title: s.title, description: s.desc, icon: s.icon as IconName })),
    },
  },
  {
    key: "benefits",
    label: "دستاوردها",
    hint: "فهرست دستاوردها به‌همراه عدد بازگشت سرمایه.",
    group: "home",
    header: { eyebrow: "برچسب بخش", title: "عنوان بخش", description: "توضیح بخش" },
    items: {
      label: "دستاوردها",
      addLabel: "دستاورد جدید",
      titleLabel: "عنوان دستاورد",
      fields: [ICON_FIELD, DESC_FIELD],
    },
    defaults: {
      eyebrow: "دستاوردها",
      title: "بهسا دیجیتال چه چیزی را برای شما بهتر می‌کند؟",
      description: "شش اثر قابل‌اندازه‌گیری که مشتریان ما در ماه‌های اول گزارش می‌کنند.",
      items: BENEFITS.map((b) => ({ title: b.title, description: b.desc, icon: b.icon as IconName })),
    },
  },
  {
    key: "testimonials",
    label: "تجربه مشتریان (عنوان)",
    hint: "عنوان بخش نظرات. خود نظرها در «نظرات مشتریان» مدیریت می‌شوند.",
    group: "home",
    header: { eyebrow: "برچسب بخش", title: "عنوان بخش", description: "توضیح بخش" },
    defaults: {
      eyebrow: "تجربه مشتریان",
      title: "آنچه مدیران انرژی می‌گویند",
      description: "نتیجه‌هایی که در جلسات بازبینی فصلی با مشتریان اندازه‌گیری و تأیید شده‌اند.",
    },
  },
  {
    key: "articles",
    label: "مقالات صفحه اصلی (عنوان)",
    hint: "عنوان بخش مقالات. خود مقالات در «مقالات» مدیریت می‌شوند.",
    group: "home",
    header: { eyebrow: "برچسب بخش", title: "عنوان بخش", description: "توضیح بخش", cta: true },
    defaults: {
      eyebrow: "مقالات",
      title: "دانش و تحلیل انرژی",
      description: "محتوای تخصصی تیم تحلیل بهسا برای مدیران انرژی و مهندسان برق.",
      ctaLabel: "مشاهده همه مقالات",
      ctaHref: "/articles",
    },
  },
  {
    key: "faq",
    label: "سوالات متداول (عنوان)",
    hint: "عنوان بخش پرسش‌ها. خود پرسش‌ها در «پرسش‌های متداول» مدیریت می‌شوند.",
    group: "home",
    header: { eyebrow: "برچسب بخش", title: "عنوان بخش", description: "توضیح بخش" },
    defaults: {
      eyebrow: "سوالات متداول",
      title: "پاسخ ابهام‌های رایج، پیش از شروع",
      description: "پنج سؤالی که تقریباً در هر جلسه معارفه پرسیده می‌شود — کوتاه و شفاف پاسخ داده‌ایم.",
    },
  },
  {
    key: "cta",
    label: "دعوت به اقدام پایانی",
    hint: "نوار آبی انتهای صفحه اصلی.",
    group: "home",
    header: { title: "عنوان", description: "متن زیر عنوان" },
    items: {
      label: "دکمه‌ها",
      addLabel: "دکمه جدید",
      titleLabel: "متن دکمه",
      fields: [{ name: "href", label: "آدرس دکمه" }],
    },
    defaults: {
      title: "مدیریت انرژی را از *داده* شروع کنید.",
      description: "در سامانه بهسا، با داده واقعیِ مجموعه خودتان، گلوگاه‌های هزینه را روی داشبورد ببینید.",
      items: [
        { title: "ورود به سامانه", href: "https://panel.behsa-digital.ir/login" },
        { title: "مطالعه مقالات", href: "/articles" },
      ],
    },
  },
];

export const SECTION_BY_KEY: Record<string, SectionDef> = Object.fromEntries(SECTIONS.map((s) => [s.key, s]));

export const SECTION_KEYS: string[] = SECTIONS.map((s) => s.key);
