import "server-only";
import { revalidatePath, updateTag } from "next/cache";
import type { ActionState } from "@/components/admin/ui";
import { TAGS } from "@/lib/cms";
import { toLatinDigits } from "@/lib/format";
export { parseJalaliInput } from "@/lib/format";
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

/** a stored file name: letters, digits, dot, dash — the extension survives */
export const safeName = (name: string, fallback = "image") =>
  name.normalize("NFKC").replace(/[^\p{L}\p{N}._-]+/gu, "-").replace(/-+/g, "-").slice(0, 120) || fallback;

export const fail = (message: string, errors?: Record<string, string>): ActionState => ({ ok: false, message, errors });
export const done = (message = "ذخیره شد."): ActionState => ({ ok: true, message });

export const isUniqueViolation = (e: unknown): boolean =>
  typeof e === "object" && e !== null && ("code" in e ? (e as { code?: string }).code === "23505" : "cause" in e && isUniqueViolation((e as { cause?: unknown }).cause));

/** expire public caches immediately and refresh admin screens;
    with no tags only the panel refreshes — the public site is untouched */
export function refresh(...tags: (keyof typeof TAGS)[]) {
  for (const t of tags) {
    try { updateTag(TAGS[t]); } catch {}
  }
  try { revalidatePath("/admin", "layout"); } catch {}
  if (tags.length) try { revalidatePath("/", "layout"); } catch {}
}
