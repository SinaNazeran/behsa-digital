import type { IconName } from "@/components/icons";
import {
  BENEFITS, CAPACITOR_OUTPUTS, DASHBOARD_SHOTS, INDUSTRIES,
  PAIN_POINTS, PLATFORM_STEPS, REGULATIONS, REPORT_CARDS, STATUS_QUO,
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

   Band order follows the narrative in docs/content-strategy.md:
   understanding → problem → urgency → status quo → mechanism →
   capabilities → proof of mechanism → differentiation → relevance →
   outcome → objections → conversion.
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
  /** false = seeded switched off; used for bands that must not ship
      until the business supplies verified assets or proof */
  isActive?: boolean;
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
const LINK_FIELDS: ItemField[] = [
  { name: "tag", label: "متن لینک پایین کارت" },
  { name: "href", label: "آدرس لینک" },
];

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
      fields: [{ name: "href", label: "آدرس دکمه", hint: "مثل https://panel.behsa-digital.ir/login یا /contact" }],
      emptyHint: "بدون دکمه هم نمایش داده می‌شود؛ فقط عنوان و متن دیده می‌شوند.",
    },
    defaults: {
      eyebrow: "پایش و بهینه‌سازی مصرف برق صنعتی",
      title: "جریمه‌های قبض برق،\nپیش از *صدور قبض* قابل محاسبه‌اند.",
      description:
        "بهسا دیجیتال دادهٔ کنتور هوشمند شما را می‌خواند و سه قلمی را که بیشترین جریمه را می‌سازند — تجاوز از دیماند، افت ضریب توان و کسری خرید — پیش از پایان دوره محاسبه می‌کند و هشدار می‌دهد. در حالت معمول، بدون نصب هیچ سخت‌افزار جدید.",
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
    label: "نوار لوگوی مشتریان (زیر هیرو)",
    hint: "نوار متحرک لوگوها زیر بخش هیرو. خود لوگوها توسط تیم فنی در src/content/customers.ts مدیریت می‌شوند.",
    group: "hero",
    header: { title: "عنوان نوار" },
    /* No item editor: logos are SVG, which the media library refuses
       (it can carry scripts), so they ship as reviewed files in
       public/logos/ — see src/content/customers.ts. */
    defaults: {
      title: "مورد اعتماد سازمان‌های پیشرو",
    },
  },
  {
    key: "pains",
    label: "چالش مشترک صنایع",
    hint: "کارت‌های چالش‌ها، بلافاصله بعد از نوار مصرف‌کننده‌ها.",
    group: "home",
    header: { eyebrow: "برچسب بخش", title: "عنوان بخش", description: "توضیح بخش", cta: true },
    items: {
      label: "چالش‌ها",
      addLabel: "چالش جدید",
      titleLabel: "عنوان چالش",
      fields: [ICON_FIELD, DESC_FIELD, ...LINK_FIELDS],
    },
    defaults: {
      eyebrow: "چالش مشترک صنایع",
      title: "هزینهٔ برق شما از کجا اضافه می‌شود؟",
      description: "چهار قلم که در قبض‌های صنعتی تکرار می‌شوند. هر چهار مورد قابل محاسبه‌اند — اما نه از روی قبض ماهانه.",
      ctaLabel: "مشاهدهٔ راهکارها",
      ctaHref: "/solutions",
      items: PAIN_POINTS.map((p) => ({ title: p.title, description: p.desc, icon: p.icon as IconName, tag: p.link, href: p.href })),
    },
  },
  {
    key: "regulations",
    label: "الزامات قانونی",
    hint: "دو قانونی که نحوهٔ تأمین برق صنایع را تغییر داده‌اند.",
    group: "home",
    header: { eyebrow: "برچسب بخش", title: "عنوان بخش", description: "توضیح بخش" },
    items: {
      label: "قوانین",
      addLabel: "قانون جدید",
      titleLabel: "عنوان قانون",
      fields: [
        ICON_FIELD,
        { name: "description", label: "شرح الزام" },
        { name: "bullets", label: "نقش بهسا", hint: "هر مورد را در یک خط جداگانه بنویسید." },
        ...LINK_FIELDS,
      ],
      emptyHint: "در متن این بخش هیچ درصدی درج نشده است؛ پیش از افزودن عدد، آیین‌نامهٔ جاری را بررسی کنید.",
    },
    defaults: {
      eyebrow: "الزامات قانونی",
      title: "دو قانون که نحوهٔ تأمین برق صنایع را تغییر داده‌اند",
      description: "رعایت هر دو به محاسبه نیاز دارد، نه به برآورد. بهسا هر دو را از دادهٔ مصرف خود شما محاسبه می‌کند.",
      items: REGULATIONS.map((r) => ({ title: r.title, description: r.desc, icon: r.icon as IconName, bullets: r.items, tag: r.tag, href: r.href })),
    },
  },
  {
    key: "status-quo",
    label: "چرا روش فعلی کافی نیست",
    hint: "سه مورد کوتاه، بین بخش الزامات و بخش «چطور کار می‌کند».",
    group: "home",
    header: { eyebrow: "برچسب بخش", title: "عنوان بخش" },
    items: {
      label: "موارد",
      addLabel: "مورد جدید",
      titleLabel: "عنوان",
      fields: [DESC_FIELD],
    },
    defaults: {
      eyebrow: "چرا روش فعلی کافی نیست",
      title: "قبض ماهانه، میانگین است. جریمه، لحظه‌ای.",
      items: STATUS_QUO.map((s) => ({ title: s.title, description: s.desc })),
    },
  },
  {
    key: "platform",
    label: "چطور کار می‌کند (تب‌ها)",
    hint: "چهار گام از دادهٔ کنتور تا اقدام، با فهرست موارد هر گام.",
    group: "home",
    header: { eyebrow: "برچسب بخش", title: "عنوان بخش", description: "توضیح بخش", cta: true },
    items: {
      label: "گام‌ها",
      addLabel: "گام جدید",
      titleLabel: "عنوان گام",
      fields: [ICON_FIELD, DESC_FIELD, { name: "bullets", label: "فهرست موارد", hint: "هر مورد را در یک خط جداگانه بنویسید." }],
    },
    defaults: {
      eyebrow: "چطور کار می‌کند",
      title: "از دادهٔ کنتور تا عددی که می‌شود بر اساس آن تصمیم گرفت",
      description: "چهار گام. گام اول، در حالت معمول، به هیچ سخت‌افزار جدیدی نیاز ندارد.",
      ctaLabel: "جزئیات پلتفرم",
      ctaHref: "/product/platform",
      items: PLATFORM_STEPS.map((t) => ({ title: t.title, description: t.desc, icon: t.icon as IconName, bullets: t.items })),
    },
  },
  {
    key: "reports",
    label: "گزارش‌ها",
    hint: "نمونه‌ای از گزارش‌های سامانه؛ فهرست کامل در صفحهٔ گزارش‌ها است.",
    group: "home",
    header: { eyebrow: "برچسب بخش", title: "عنوان بخش", description: "توضیح بخش", cta: true },
    items: {
      label: "گزارش‌ها",
      addLabel: "گزارش جدید",
      titleLabel: "نام گزارش",
      fields: [
        ICON_FIELD,
        { name: "description", label: "سؤالی که پاسخ می‌دهد" },
        { name: "tag", label: "دستهٔ گزارش" },
        { name: "href", label: "آدرس صفحهٔ گزارش" },
      ],
      emptyHint: "شش مورد کافی است؛ فهرست کامل در /reports نمایش داده می‌شود.",
    },
    defaults: {
      eyebrow: "گزارش‌ها",
      title: "هر گزارش، پاسخ یک سؤال مدیریتی مشخص",
      description: "گزارش‌ها بر اساس تصمیمی که باید گرفته شود دسته‌بندی شده‌اند، نه بر اساس نوع نمودار.",
      ctaLabel: "همهٔ گزارش‌ها",
      ctaHref: "/reports",
      items: REPORT_CARDS.map((r) => ({ title: r.title, description: r.desc, icon: r.icon as IconName, tag: r.tag, href: r.href })),
    },
  },
  {
    key: "dashboard",
    label: "داخل سامانه (تصاویر واقعی)",
    hint: "تصاویر محیط واقعی سامانه. تا زمانی که تصویر واقعی بارگذاری نشده، این بخش را فعال نکنید.",
    group: "home",
    header: { eyebrow: "برچسب بخش", title: "عنوان بخش", description: "توضیح بخش" },
    items: {
      label: "تصاویر",
      addLabel: "تصویر جدید",
      titleLabel: "عنوان تصویر",
      fields: [DESC_FIELD, { name: "image", label: "تصویر", hint: "اسکرین‌شات واقعی سامانه، بدون نام یا شمارهٔ مشترک قابل‌خواندن." }],
      emptyHint: "بدون تصویر، این بخش نمایش داده نمی‌شود.",
    },
    defaults: {
      /* Inactive by default: the band's claim is «تصاویر از محیط واقعی
         سامانه گرفته شده‌اند», which is only true once real screenshots
         are uploaded (docs/content-spec.md, placeholder P2). */
      isActive: false,
      eyebrow: "داخل سامانه",
      title: "همان چیزی که بعد از ورود می‌بینید",
      description: "تصاویر زیر از محیط واقعی سامانه گرفته شده‌اند.",
      items: DASHBOARD_SHOTS.map((d) => ({ title: d.title, description: d.desc })),
    },
  },
  {
    key: "capacitor",
    label: "طراحی بانک خازنی",
    hint: "بخش تمایز اصلی؛ خروجی‌های گزارش توان راکتیو جبرانی.",
    group: "home",
    header: { eyebrow: "برچسب بخش", title: "عنوان بخش", description: "توضیح بخش", cta: true, media: true },
    items: {
      label: "خروجی‌ها",
      addLabel: "خروجی جدید",
      titleLabel: "عنوان خروجی",
      fields: [DESC_FIELD],
    },
    defaults: {
      eyebrow: "تفاوت اصلی",
      title: "طراحی بانک خازنی، از *سریال کنتور* — بدون بازدید میدانی",
      description:
        "طراحی بانک خازنی با دادهٔ ماهانهٔ قبض، یعنی طراحی بدون دیدن پیک‌های توان راکتیو. گزارش توان راکتیو جبرانی، همان پروفایل ساعتی را می‌سازد و از روی آن طراحی کامل را محاسبه می‌کند.",
      ctaLabel: "گزارش طراحی بانک خازنی",
      ctaHref: "/reports/capacitor-bank-design",
      items: CAPACITOR_OUTPUTS.map((c) => ({ title: c.title, description: c.desc })),
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
      fields: [ICON_FIELD, DESC_FIELD, { name: "href", label: "آدرس صفحهٔ صنعت" }],
    },
    defaults: {
      eyebrow: "مخاطبان بهسا",
      title: "برای چه مجموعه‌هایی ساخته شده است؟",
      description: "الگوی بار، تعرفه و الزامات هر بخش متفاوت است — و گزارش‌هایی که برایش اهمیت دارند هم متفاوت‌اند.",
      items: INDUSTRIES.map((s) => ({ title: s.title, description: s.desc, icon: s.icon as IconName, href: s.href })),
    },
  },
  {
    key: "benefits",
    label: "دستاوردها",
    hint: "فهرست دستاوردها. هیچ عدد تأییدنشده‌ای در این بخش درج نمی‌شود.",
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
      title: "بهسا دیجیتال چه چیزی را برای شما تغییر می‌دهد؟",
      description: "شش اثری که مستقیماً از قابلیت‌های سامانه به دست می‌آیند.",
      items: BENEFITS.map((b) => ({ title: b.title, description: b.desc, icon: b.icon as IconName })),
    },
  },
  {
    key: "proof",
    label: "نتایج مشتریان",
    hint: "تا زمانی که مورد واقعی و تأییدشده وجود ندارد، این بخش غیرفعال می‌ماند.",
    group: "home",
    header: { eyebrow: "برچسب بخش", title: "عنوان بخش", description: "توضیح بخش" },
    defaults: {
      /* Reserved slot. Activation requires a named organisation (or an
         approved anonymised description), a stated measurement method,
         a stated period, and written permission
         (docs/content-strategy.md §Trust / Proof Strategy). */
      isActive: false,
      eyebrow: "نتایج مشتریان",
      title: "",
      description: "",
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
      description: "نُه سؤالی که تقریباً در هر جلسهٔ معارفه پرسیده می‌شود.",
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
      title: "قبض بعدی را *پیش از صدور* ببینید.",
      description: "در سامانهٔ بهسا، با دادهٔ واقعی مجموعهٔ خودتان ببینید کدام اقلام قبض قابل محاسبه و قابل حذف‌اند.",
      items: [
        { title: "ورود به سامانه", href: "https://panel.behsa-digital.ir/login" },
        { title: "تماس با ما", href: "/contact" },
      ],
    },
  },
];

export const SECTION_BY_KEY: Record<string, SectionDef> = Object.fromEntries(SECTIONS.map((s) => [s.key, s]));

export const SECTION_KEYS: string[] = SECTIONS.map((s) => s.key);
