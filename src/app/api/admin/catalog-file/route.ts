import { db, schema } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { safeName } from "@/app/admin/_actions/helpers";

/* Catalogue file upload (Admin → کاتالوگ‌ها).

   A Route Handler, not a Server Action: raising the Server Action body
   limit to fit a catalogue would raise it for every Server Action, and
   /admin requests pass through proxy.ts, which buffers only 10MB of a
   body. /api/* is outside the proxy matcher, so this route checks the
   session itself. The session cookie is SameSite=Lax, so a cross-site
   POST never carries it.

   The bytes become a `media` row; the catalogue form then saves its id.
   A file whose form is never saved is swept by the collections action. */

const MAX_BYTES = 20 * 1024 * 1024;

const json = (body: object, status = 200) => Response.json(body, { status });

export async function POST(req: Request) {
  if (!(await getCurrentUser())) return json({ message: "نشست شما منقضی شده است؛ دوباره وارد شوید." }, 401);
  /* refuse before buffering anything; multipart framing adds a few KB */
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BYTES + 64 * 1024) return json({ message: "حجم فایل بیش از ۲۰ مگابایت است." }, 413);

  const file = (await req.formData().catch(() => null))?.get("file");
  if (!(file instanceof File) || file.size === 0) return json({ message: "فایلی انتخاب نشده است." }, 400);
  if (file.size > MAX_BYTES) return json({ message: "حجم فایل بیش از ۲۰ مگابایت است." }, 413);

  const data = Buffer.from(await file.arrayBuffer());
  /* the signature, not the name or the browser's MIME; the spec allows
     a little junk before it */
  if (!data.subarray(0, 1024).includes("%PDF-")) return json({ message: "فقط فایل PDF پذیرفته می‌شود." }, 415);

  const [row] = await db.insert(schema.media)
    .values({ filename: safeName(file.name, "catalog.pdf"), mime: "application/pdf", size: data.length, data })
    .returning({ id: schema.media.id, filename: schema.media.filename, size: schema.media.size });
  return json(row);
}
