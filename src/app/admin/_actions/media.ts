"use server";

import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import type { ActionState } from "@/components/admin/ui";
import { done, fail, refresh, str } from "./helpers";

const MAX_BYTES = 5 * 1024 * 1024;

/* Detect type from magic bytes — never trust the browser's MIME.
   SVG is deliberately excluded (can carry scripts). */
function sniff(b: Buffer): string | null {
  if (b.length < 12) return null;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
  if (b.subarray(0, 6).toString("ascii") === "GIF87a" || b.subarray(0, 6).toString("ascii") === "GIF89a") return "image/gif";
  if (b.subarray(4, 12).toString("ascii") === "ftypavif") return "image/avif";
  return null;
}

const safeName = (name: string) =>
  name.normalize("NFKC").replace(/[^\p{L}\p{N}._-]+/gu, "-").replace(/-+/g, "-").slice(0, 120) || "image";

export async function uploadMedia(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const files = fd.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) return fail("فایلی انتخاب نشده است.");
  const alt = str(fd, "alt", 255);

  const rejected: string[] = [];
  let saved = 0;
  for (const file of files.slice(0, 10)) {
    if (file.size > MAX_BYTES) { rejected.push(`${file.name} (بیش از ۵ مگابایت)`); continue; }
    const data = Buffer.from(await file.arrayBuffer());
    const mime = sniff(data);
    if (!mime) { rejected.push(`${file.name} (فرمت مجاز: JPG، PNG، WebP، GIF، AVIF)`); continue; }
    await db.insert(schema.media).values({ filename: safeName(file.name), mime, size: data.length, alt, data });
    saved++;
  }
  refresh();
  if (!saved) return fail(`هیچ فایلی ذخیره نشد: ${rejected.join("، ")}`);
  return done(rejected.length ? `${saved} فایل ذخیره شد. رد شده: ${rejected.join("، ")}` : `${saved} فایل بارگذاری شد.`);
}

export async function updateMediaAlt(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = str(fd, "id", 64);
  await db.update(schema.media).set({ alt: str(fd, "alt", 255) }).where(eq(schema.media.id, id));
  refresh("articles");
  return done("متن جایگزین ذخیره شد.");
}

export async function deleteMedia(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = str(fd, "id", 64);
  await db.delete(schema.media).where(eq(schema.media.id, id));
  /* the row's media_id columns are set to NULL by the FK — every cache that
     may hold the old /media/<id> URL has to expire with it, otherwise a
     deleted image keeps being rendered until the tag times out */
  refresh("articles", "settings", "seo", "content");
  return done("تصویر حذف شد.");
}
