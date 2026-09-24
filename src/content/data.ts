/* ── Behsa Digital — homepage factory defaults ──────────────────────
   The arrays below are the FACTORY DEFAULTS of the editable homepage
   sections: src/content/sections.ts seeds the CMS from them and the
   site falls back to them when a section row is missing.
   Edit the live site in Admin → بخش‌های صفحه اصلی, not here.

   Product facts (capabilities, reports, solutions, industries) live in
   src/content/capabilities.ts — the single product taxonomy. The three
   competing taxonomies that used to live here (PRODUCTS / SOLUTIONS /
   FEATURES) were retired: they described the same product three times
   under three different sets of names (docs/content-audit.md).

   Copy is classified in docs/content-spec.md. No unverified number
   appears in this file. */

export const faNum = (v: string | number): string =>
  String(v).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

export const formatFa = (n: number): string => faNum(n.toLocaleString("en-US"));

/* ── Home · Pain points (band 3) ── */
export const PAIN_POINTS = [
  {
    icon: "gauge",
    title: "تجاوز از دیماند",
    desc: "دیماند، بیشینهٔ توان شما در پنجره‌های ۱۵ دقیقه‌ای است. عبور از قدرت قراردادی، مازاد را با نرخی چندبرابر محاسبه می‌کند — و شما آن را اولین‌بار در قبض ماه بعد می‌بینید.",
    link: "گزارش بهینه‌سازی قدرت قراردادی",
    href: "/reports/contracted-power",
  },
  {
    icon: "capacitor",
    title: "جریمهٔ توان راکتیو",
    desc: "ضریب توان پایین‌تر از حد مقرر، در هر قبض جریمه ایجاد می‌کند؛ جریمه‌ای که منشأ آن از روی قبض قابل تشخیص نیست. با تغییر محاسبهٔ ضریب زیان، وزن این قلم بیشتر هم شده است.",
    link: "گزارش توان راکتیو جبرانی",
    href: "/reports/capacitor-bank-design",
  },
  {
    icon: "cart",
    title: "کسری یا مازاد خرید برق",
    desc: "وقتی مصرف واقعی از مقدار خریداری‌شده فاصله می‌گیرد، هر دو جهتِ انحراف هزینه دارد: کسری جریمه می‌شود و مازاد روی دست می‌ماند.",
    link: "گزارش خرید بهینه انرژی",
    href: "/reports/optimal-purchase",
  },
  {
    icon: "eyeoff",
    title: "نبود دید لحظه‌ای",
    desc: "تا وقتی تنها منبع اطلاع شما قبض ماهانه است، رویدادی که جریمه را ساخته سه هفته پیش رخ داده و دیگر قابل اصلاح نیست.",
    link: "گزارش پروفایل بار",
    href: "/reports/load-profile",
  },
];

/* ── Home · Regulatory urgency (band 4) ──────────────────────────────
   [EXTERNAL SOURCE] — the statutes. No percentage is published here:
   info/ states a flat «۴٪ ۱۴۰۵» while external sources describe a
   1%→5% ramp, so the figure is withheld until confirmed
   (docs/content-spec.md, placeholder P1). */
export const REGULATIONS = [
  {
    icon: "leaf",
    title: "ماده ۱۶ قانون جهش تولید دانش‌بنیان",
    desc: "صنایع بالای یک مگاوات موظف‌اند بخشی از برق سالانهٔ خود را از منابع تجدیدپذیر تأمین کنند — با احداث نیروگاه یا خرید برق سبز از بورس انرژی. در صورت عدم اقدام، آن سهم با تعرفهٔ تجدیدپذیر محاسبه و دریافت می‌شود و مجموعه در زمان کمبود، در اولویت قطع قرار می‌گیرد.",
    items: [
      "سهم واقعی خورشید در مصرف، نه ظرفیت اسمی پنل",
      "بررسی خودکار وضعیت انطباق",
      "تشخیص کسری یا مازاد تولید، روزانه و ماهانه و سالانه",
    ],
    tag: "بررسی سهم خورشیدی شما",
    href: "/solutions/article-16",
  },
  {
    icon: "chart",
    title: "بند «ب» ماده ۴۳ قانون برنامهٔ هفتم",
    desc: "مشترکان با قدرت قراردادی ۱۵۰ کیلووات و بالاتر بخشی از برق خود را باید از بازار تأمین کنند: بورس انرژی، خرده‌فروش یا قرارداد دوجانبه. خطا در برآورد مقدار، از هر دو طرف هزینه دارد.",
    items: [
      "پیش‌بینی مصرف روزهای باقی‌ماندهٔ ماه بر اساس الگوی بار",
      "مقدار بهینهٔ خرید با هدف کمترین هزینهٔ نهایی",
      "تفکیک خرید از بورس انرژی و قراردادهای دوجانبه",
    ],
    tag: "محاسبهٔ خرید بهینه",
    href: "/solutions/market-purchase",
  },
];

/* ── Home · Why the status quo fails (band 5) ── */
export const STATUS_QUO = [
  {
    title: "مدیریت از روی قبض",
    desc: "قبض یک عدد تجمیعی ماهانه است. رویدادی که جریمه را ساخت، یک پنجرهٔ ۱۵ دقیقه‌ای بود که در آن عدد گم شده است.",
  },
  {
    title: "طراحی از روی دادهٔ میانگین",
    desc: "بانک خازنی که با بار میانگین طراحی شود، در ساعات کم‌باری اضافه‌جبران می‌کند و در پیک کم می‌آورد. بدون دیدن پیک‌های توان راکتیو، طراحی درست ممکن نیست.",
  },
  {
    title: "اتکا به بازدید و محاسبهٔ دستی",
    desc: "بازدید میدانی هزینه و هفته‌ها زمان می‌برد، و خروجی آن یک عکس لحظه‌ای است — نه پروفایل یک سال.",
  },
];

/* ── Home · How it works (band 6) ────────────────────────────────────
   A process with a dependency chain, not a taxonomy. The previous four
   «layers» (پایش/تحلیل/پیش‌بینی/بهینه‌سازی) appear nowhere in info/. */
export const PLATFORM_STEPS = [
  {
    icon: "monitor",
    title: "اتصال داده",
    desc: "اگر سایت شما کنتور هوشمند دارد، سامانه از طریق API به مرکز دادهٔ کنتورها متصل می‌شود.",
    items: [
      "پروفایل بار با تناوب ۱۵ دقیقه‌ای",
      "پارامترهای الکتریکی کنتور",
      "قبض و مشخصات قرارداد تأمین",
      "در حالت معمول، بدون نصب سخت‌افزار",
    ],
  },
  {
    icon: "analyze",
    title: "محاسبه",
    desc: "داده به شاخص‌هایی تبدیل می‌شود که مستقیماً به اقلام قبض مربوط‌اند.",
    items: [
      "بیشینهٔ دیماند در برابر قدرت قراردادی",
      "ضریب توان و توان راکتیو جبرانی",
      "بهای انرژی به تفکیک تعرفه",
      "سهم انرژی تجدیدپذیر",
    ],
  },
  {
    icon: "alert",
    title: "هشدار",
    desc: "پیش از رسیدن به آستانه، نه پس از عبور از آن.",
    items: [
      "هشدار پیش از رسیدن به قدرت قراردادی، با نوتیفیکیشن و پیامک",
      "هشدار افت ضریب توان",
      "هشدار کیفیت ولتاژ",
    ],
  },
  {
    icon: "optimize",
    title: "اقدام",
    desc: "خروجی، یک عدد اجرایی است — نه توصیهٔ کلی.",
    items: [
      "قدرت قراردادی پیشنهادی",
      "ظرفیت و پله‌بندی بانک خازنی",
      "مقدار بهینهٔ خرید برق ماه",
      "فهرست کنتورهای پرریسک",
    ],
  },
];

/* ── Home · Report catalogue, representative subset (band 7) ─────────
   Six, not fifteen: enough to establish the pattern without turning a
   narrative band into a directory. Full list lives on /reports. */
export const REPORT_CARDS = [
  { icon: "contract", title: "بهینه‌سازی قدرت قراردادی", desc: "قدرت قراردادی فعلی زیاد است یا کم؟", tag: "مدیریت هزینه", href: "/reports/contracted-power" },
  { icon: "capacitor", title: "توان راکتیو جبرانی بانک خازنی", desc: "چه ظرفیتی، در چند پله، با کدام فیوز و کابل؟", tag: "کیفیت توان", href: "/reports/capacitor-bank-design" },
  { icon: "cart", title: "خرید بهینه انرژی ماه جاری", desc: "تا پایان ماه چقدر برق بخریم که جریمه نشویم؟", tag: "تأمین انرژی", href: "/reports/optimal-purchase" },
  { icon: "sun", title: "ارزیابی سهم انرژی خورشیدی", desc: "سهم واقعی خورشید چقدر است و الزام رعایت شده؟", tag: "تجدیدپذیر", href: "/reports/solar-share" },
  { icon: "peak", title: "بیشینه مصرف اکتیو", desc: "پیک مصرف دقیقاً چه زمانی رخ داده است؟", tag: "پایش مصرف", href: "/reports/peak-demand" },
  { icon: "eye", title: "رویت‌پذیری دادهٔ کنتور", desc: "چه بخشی از داده واقعی است و چه بخشی تخمینی؟", tag: "کیفیت داده", href: "/reports/observability" },
];

/* ── Home · Product screenshots (band 8) ─────────────────────────────
   Ships with `isActive: false` until real anonymised screenshots exist
   (docs/content-spec.md, placeholder P2). The band that used to sit
   here drew invented KPI numbers under the heading «نمایی واقعی از
   سامانه» — a simulation described as a real view. */
export const DASHBOARD_SHOTS = [
  { title: "داشبورد مصرف لحظه‌ای", desc: "مصرف همهٔ کنتورها در یک صفحه، با وضعیت دیماند نسبت به قدرت قراردادی." },
  { title: "پروفایل بار ۱۵ دقیقه‌ای", desc: "منحنی توان در بازهٔ انتخابی، با امکان تفکیک تعرفه‌ای." },
  { title: "گزارش توان راکتیو جبرانی", desc: "نمودار ساعتی توان راکتیو موردنیاز و جدول پله‌بندی بانک خازنی." },
  { title: "هشدارها", desc: "فهرست هشدارهای فعال: آستانهٔ دیماند، افت ضریب توان، کیفیت ولتاژ." },
];

/* ── Home · Capacitor bank differentiator (band 9) ── */
export const CAPACITOR_OUTPUTS = [
  { title: "پروفایل ساعتی توان راکتیو جبرانی", desc: "مقدار توان راکتیو موردنیاز در هر ساعت، تا رسیدن به ضریب توان بالای ۰٫۹۱." },
  { title: "ظرفیت کل و پله‌بندی", desc: "ظرفیت کل بانک، تعداد پله‌ها، ظرفیت هر پله و خازن ثابت در صورت نیاز." },
  { title: "فیوز، کنتاکتور و کابل", desc: "جریان هر پله، جریان فیوز و سطح مقطع کابل مناسب — محاسبه‌شده، نه تخمینی." },
  { title: "پیشنهاد قطعهٔ استاندارد بازار", desc: "برای هر پله، فیوز و کابل استاندارد موجود در بازار پیشنهاد می‌شود." },
];

/* ── Home · Industries (band 10) ── */
export const INDUSTRIES = [
  { icon: "factory", title: "صنایع پرمصرف", desc: "فولاد، سیمان، پتروشیمی، ریخته‌گری و غذایی؛ با قبض‌های سنگین و ریسک دائمی جریمهٔ دیماند.", href: "/industries/heavy-industry" },
  { icon: "holding", title: "هلدینگ‌ها و گروه‌های چندسایتی", desc: "زیرمجموعه‌های متنوع با کنتور، تعرفه و فرمت گزارش متفاوت — و گزارش‌هایی که با هم قابل مقایسه نیستند.", href: "/industries/holdings" },
  { icon: "consultant", title: "مشاوران و طراحان برق", desc: "طراحی بانک خازنی و تحلیل پروفایل بار، بدون نیاز به اندازه‌گیری میدانی.", href: "/industries/consultants" },
  { icon: "retail", title: "خرده‌فروشان و توزیع برق", desc: "پایش سلامت کنتورهای سبد مشترکان و پیش‌بینی مصرف برای مدیریت خرید.", href: "/industries/electricity-retailers" },
];

/* ── Home · Outcomes (band 11) ───────────────────────────────────────
   Capability language only. The ROI panel that used to accompany this
   band («۳۱۲٪ … بر اساس نتایج مستقرسازی‌های ۱۴۰۳») was a fabricated
   statistic with a fabricated provenance line and has been removed. */
export const BENEFITS = [
  { icon: "eye", title: "دیدن هزینه پیش از وقوع", desc: "اقلام جریمه‌پذیر قبض، پیش از پایان دوره محاسبه و نمایش داده می‌شوند." },
  { icon: "shield", title: "هشدار پیش از عبور از آستانه", desc: "هشدار دیماند و ضریب توان پیش از رسیدن به حد، از طریق نوتیفیکیشن و پیامک." },
  { icon: "precision", title: "تصمیم بر اساس عدد، نه برآورد", desc: "خروجی هر گزارش یک مقدار مشخص است: قدرت قراردادی، ظرفیت خازن، مقدار خرید." },
  { icon: "speed", title: "حذف رفت‌وبرگشت طراحی", desc: "طراحی بانک خازنی بدون بازدید میدانی و بدون آزمون و خطا انجام می‌شود." },
  { icon: "central", title: "یک زبان مشترک برای همهٔ سایت‌ها", desc: "همهٔ زیرمجموعه‌ها با شاخص‌های یکسان، روی یک داشبورد." },
  { icon: "check", title: "انطباق قابل‌اثبات با الزامات", desc: "وضعیت الزام تأمین برق تجدیدپذیر، محاسبه‌شده و قابل ارائه." },
];

/* ── About ── */
export const DIFFERENTIATORS = [
  { icon: "precision", title: "تخصص", desc: "تیم ما ترکیبی از مهندسان برق قدرت و متخصصان داده است؛ زبان صنعت و زبان فناوری را هم‌زمان می‌فهمیم." },
  { icon: "data", title: "داده", desc: "هر توصیه ما به داده واقعیِ مصرف مجموعه شما متصل است؛ نه به برآوردهای عمومی و میانگین‌های صنعت." },
  { icon: "tech", title: "فناوری", desc: "پلتفرم ابری با دریافت خودکار داده کنتورهای هوشمند؛ بدون بار عملیاتی برای تیم فنی شما." },
  { icon: "analyze", title: "تحلیل", desc: "شاخص‌های مهندسی استاندارد — ضریب بار، ضریب هم‌زمانی، ریسک دیماند — به‌جای نمودارهای تزئینی." },
  { icon: "decision", title: "تصمیم‌گیری", desc: "خروجی ما گزارش نیست؛ تصمیم است. هر تحلیل به یک اقدام مشخص با اثر مالی اندازه‌گیری‌شده ختم می‌شود." },
];

export const FLOW_STEPS = ["داده", "محاسبه", "هشدار", "تصمیم", "اقدام"];
