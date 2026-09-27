import { eq } from "drizzle-orm";
import { db, schema } from "@/db";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/* Media bytes live in Postgres. A media id never changes content
   (replacing an image creates a new id), so responses are immutable. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID_RE.test(id)) return new Response("Not found", { status: 404 });

  const etag = `"${id}"`;
  /* a revalidation must not resurrect a deleted image, so existence is
     checked first — by id only, the bytes are not needed for a 304 */
  if (req.headers.get("if-none-match") === etag) {
    const [hit] = await db.select({ id: schema.media.id }).from(schema.media).where(eq(schema.media.id, id)).limit(1);
    return hit ? new Response(null, { status: 304, headers: { ETag: etag } }) : new Response("Not found", { status: 404 });
  }

  const [row] = await db
    .select({ data: schema.media.data, mime: schema.media.mime, filename: schema.media.filename })
    .from(schema.media)
    .where(eq(schema.media.id, id))
    .limit(1);
  if (!row) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(row.data), {
    headers: {
      "Content-Type": row.mime,
      "Content-Length": String(row.data.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: etag,
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(row.filename)}`,
    },
  });
}
