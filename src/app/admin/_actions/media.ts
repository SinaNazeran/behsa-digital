"use server";

import { eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import type { ActionState } from "@/components/admin/ui";
import { done, fail, refresh, str, uuidOrNull } from "./helpers";

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

/** validate and store one image; the only path bytes take into the library */
async function storeImage(file: File, alt: string): Promise<{ id: string; filename: string } | { error: string }> {
  if (file.size > MAX_BYTES) return { error: "بیش از ۵ مگابایت" };
  const data = Buffer.from(await file.arrayBuffer());
  const mime = sniff(data);
  if (!mime) return { error: "فرمت مجاز: JPG، PNG، WebP، GIF، AVIF" };
  const [row] = await db.insert(schema.media).values({ filename: safeName(file.name), mime, size: data.length, alt, data })
    .returning({ id: schema.media.id, filename: schema.media.filename });
  return row;
}

export type PickerUpload = { ok: true; id: string; filename: string; alt: string } | { ok: false; message: string };

/** one image uploaded from inside a MediaPicker, so an editor never has to
    leave a half-written form for the media library */
export async function uploadPickerImage(fd: FormData): Promise<PickerUpload> {
  await requireUser();
  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "فایلی انتخاب نشده است." };
  const alt = str(fd, "alt", 255);
  const res = await storeImage(file, alt);
  if ("error" in res) return { ok: false, message: `${file.name}: ${res.error}` };
  refresh();
  return { ok: true, id: res.id, filename: res.filename, alt };
}

export async function uploadMedia(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const files = fd.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) return fail("فایلی انتخاب نشده است.");
  const alt = str(fd, "alt", 255);

  const rejected: string[] = [];
  let saved = 0;
  for (const file of files.slice(0, 10)) {
    const res = await storeImage(file, alt);
    if ("error" in res) rejected.push(`${file.name} (${res.error})`);
    else saved++;
  }
  refresh();
  if (!saved) return fail(`هیچ فایلی ذخیره نشد: ${rejected.join("، ")}`);
  return done(rejected.length ? `${saved} فایل ذخیره شد. رد شده: ${rejected.join("، ")}` : `${saved} فایل بارگذاری شد.`);
}

export async function updateMediaAlt(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = uuidOrNull(fd, "id");
  if (!id) return fail("شناسه نامعتبر است.");
  await db.update(schema.media).set({ alt: str(fd, "alt", 255) }).where(eq(schema.media.id, id));
  refresh("articles");
  return done("متن جایگزین ذخیره شد.");
}

export async function deleteMedia(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = uuidOrNull(fd, "id");
  if (!id) return fail("شناسه نامعتبر است.");
  /* report galleries are jsonb, so no FK nulls them out — refuse instead
     of leaving a broken image on a public page */
  const [used] = await db.select({ title: schema.reports.title }).from(schema.reports)
    .where(sql`${schema.reports.gallery} @> ${JSON.stringify([{ mediaId: id }])}::jsonb`).limit(1);
  if (used) return fail(`این تصویر در گالری گزارش «${used.title}» استفاده شده است؛ ابتدا آن را از گالری بردارید.`);
  await db.delete(schema.media).where(eq(schema.media.id, id));
  /* the row's media_id columns are set to NULL by the FK — every cache that
     may hold the old /media/<id> URL has to expire with it, otherwise a
     deleted image keeps being rendered until the tag times out */
  refresh("articles", "settings", "seo", "content", "reports");
  return done("تصویر حذف شد.");
}
