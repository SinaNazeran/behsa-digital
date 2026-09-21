import "server-only";
import { revalidatePath, updateTag } from "next/cache";
import type { ActionState } from "@/components/admin/ui";
import { TAGS } from "@/lib/cms";
import { toLatinDigits, jalaliToGregorian } from "@/lib/format";
export { isSafeHref } from "@/lib/links";

export const str = (fd: FormData, key: string, max = 10_000) => String(fd.get(key) ?? "").trim().slice(0, max);
export const bool = (fd: FormData, key: string) => fd.get(key) === "on" || fd.get(key) === "true";
export const int = (fd: FormData, key: string) => {
  const n = Number(toLatinDigits(String(fd.get(key) ?? "")));
  return Number.isFinite(n) ? Math.trunc(n) : NaN;
};
export const uuidOrNull = (fd: FormData, key: string) => {
  const v = str(fd, key, 64);
  return /^[0-9a-f-]{36}$/i.test(v) ? v : null;
};

export const fail = (message: string, errors?: Record<string, string>): ActionState => ({ ok: false, message, errors });
export const done = (message = "ذخیره شد."): ActionState => ({ ok: true, message });

export const isUniqueViolation = (e: unknown): boolean =>
  typeof e === "object" && e !== null && ("code" in e ? (e as { code?: string }).code === "23505" : "cause" in e && isUniqueViolation((e as { cause?: unknown }).cause));

/** expire public caches immediately and refresh admin screens */
export function refresh(...tags: (keyof typeof TAGS)[]) {
  for (const t of tags) {
    try { updateTag(TAGS[t]); } catch {}
  }
  try { revalidatePath("/admin", "layout"); } catch {}
  try { revalidatePath("/", "layout"); } catch {}
}

/** "1404/08/18" or "۱۴۰۴/۰۸/۱۸" (+ optional "HH:MM") → Date in Tehran time */
export function parseJalaliInput(dateRaw: string, timeRaw = ""): Date | null {
  const m = toLatinDigits(dateRaw).trim().match(/^(\d{4})[/\-.](\d{1,2})[/\-.](\d{1,2})$/);
  if (!m) return null;
  const [jy, jm, jd] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (jm < 1 || jm > 12 || jd < 1 || jd > 31) return null;
  const [gy, gm, gd] = jalaliToGregorian(jy, jm, jd);
  const t = toLatinDigits(timeRaw).trim().match(/^(\d{1,2}):(\d{2})$/);
  const hh = t ? Math.min(23, Number(t[1])) : 9;
  const mm = t ? Math.min(59, Number(t[2])) : 0;
  /* Iran has used a fixed UTC+03:30 offset since 2022 */
  return new Date(Date.UTC(gy, gm - 1, gd, hh, mm) - 3.5 * 3600 * 1000);
}
