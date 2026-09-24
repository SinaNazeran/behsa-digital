/* Report catalogue constants shared by the admin editor (client) and the
   public pages (server). The reports themselves live in the database
   (`reports`, Admin → گزارش‌ها); this file only holds the fixed vocabulary
   an editor picks from. */

/** who a report is written for — the key is stored, the label is shown */
export const REPORT_AUDIENCES = [
  { key: "energy-manager", label: "مدیر انرژی" },
  { key: "finance", label: "مدیر مالی" },
  { key: "electrical-engineer", label: "مهندس برق" },
  { key: "operator", label: "بهره‌بردار" },
  { key: "holding", label: "مدیر هلدینگ" },
  { key: "retailer", label: "خرده‌فروش و توزیع برق" },
  { key: "consultant", label: "مشاور و طراح برق" },
] as const;

const AUDIENCE_LABEL: Record<string, string> = Object.fromEntries(REPORT_AUDIENCES.map((a) => [a.key, a.label]));

/** unknown keys (a removed audience) are dropped rather than shown raw */
export const audienceLabels = (keys: string[]): string[] =>
  keys.map((k) => AUDIENCE_LABEL[k]).filter(Boolean);

/** a new report starts with the three questions every report page answers */
export const REPORT_SECTION_TEMPLATE = [
  "چه چیزی نشان می‌دهد",
  "چه کسی می‌خواند",
  "چه تصمیمی از آن بیرون می‌آید",
];

/** kind of a landing page a report links to, from its slug */
export const pageKind = (slug: string): "راهکار" | "صنعت" | "قابلیت" =>
  slug.startsWith("solutions/") ? "راهکار" : slug.startsWith("industries/") ? "صنعت" : "قابلیت";

/** how many reports of each category the header menu shows — the first
    ones by «ترتیب داخل دسته»; the rest are one click away on /reports */
export const REPORT_MENU_LIMIT = 4;

/* ── Search ─────────────────────────────────────────────────────────
   Persian text arrives in several spellings of the same word: Arabic
   ي/ك from some keyboards, with or without the zero-width non-joiner
   (گزارش‌ها / گزارشها / گزارش ها), with or without ٔ, in Persian or
   Latin digits. Both sides are folded the same way, and spaces are
   dropped from the text being searched, so a query matches however
   its words were joined. */

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export const normalizeFa = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)))
    .replace(/[\u200c\u200d]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

/** the text a report is searched by, folded once on the server */
export const searchText = (parts: string[]): string => normalizeFa(parts.join(" ")).replace(/ /g, "");

/** every word of the query must appear somewhere in the folded text */
export const matchesQuery = (text: string, query: string): boolean =>
  normalizeFa(query).split(" ").filter(Boolean).every((w) => text.includes(w));
