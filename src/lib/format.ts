/* Persian formatting helpers — safe for both server and client. */

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export const faNum = (v: string | number): string =>
  String(v).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);

export const toLatinDigits = (v: string): string =>
  v.replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d))).replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x660));

/** "۱۸ آبان ۱۴۰۴" — Solar Hijri date in Tehran time */
export function formatJalali(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Tehran",
  }).format(d);
}

export const JALALI_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];

/** Jalali (Solar Hijri) → Gregorian. Standard arithmetic algorithm. */
export function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  jy += 1595;
  let days = -355668 + 365 * jy + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4) + jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  let gy = 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let gd = days + 1;
  const leap = (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0;
  const monthDays = [0, 31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  for (gm = 1; gm <= 12 && gd > monthDays[gm]; gm++) gd -= monthDays[gm];
  return [gy, gm, gd];
}

/** parse "۱۸ آبان ۱۴۰۴" → Date (noon Tehran, to stay on the same calendar day) */
export function parseJalaliLabel(label: string): Date | null {
  const parts = toLatinDigits(label).trim().split(/\s+/);
  if (parts.length !== 3) return null;
  const jd = Number(parts[0]);
  const jm = JALALI_MONTHS.indexOf(parts[1]) + 1;
  const jy = Number(parts[2]);
  if (!jd || !jm || !jy) return null;
  const [gy, gm, gd] = jalaliToGregorian(jy, jm, jd);
  return new Date(Date.UTC(gy, gm - 1, gd, 8, 30));
}

/** reading time in whole minutes, Persian digits: "۸ دقیقه" */
export function readingTime(texts: string[]): string {
  const words = texts.join(" ").split(/\s+/).filter(Boolean).length;
  return `${faNum(Math.max(1, Math.round(words / 200)))} دقیقه`;
}

/** "demand-penalty" style slug check */
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Date → ["1404/08/18", "09:00"] in Tehran time, Latin digits (for admin inputs) */
export function toJalaliInput(date: Date | string | null | undefined): [string, string] {
  if (!date) return ["", ""];
  const d = typeof date === "string" ? new Date(date) : date;
  const parts = new Intl.DateTimeFormat("en-u-ca-persian-nu-latn", {
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "Asia/Tehran",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return [`${get("year")}/${get("month")}/${get("day")}`, `${get("hour")}:${get("minute")}`];
}
