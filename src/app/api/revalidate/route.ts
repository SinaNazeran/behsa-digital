import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { TAGS } from "@/lib/cms";
import { NextResponse, type NextRequest } from "next/server";

/* Wipes every public cache, so it is gated by a shared secret. An unset
   REVALIDATE_SECRET fails closed: the route then never runs. */
function authorized(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return false;
  const given = Buffer.from(req.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ ok: false }, { status: 401 });

  for (const t of Object.values(TAGS)) {
    try {
      revalidateTag(t, { expire: 0 });
    } catch {}
  }
  try {
    revalidatePath("/", "layout");
  } catch {}
  try {
    revalidatePath("/admin", "layout");
  } catch {}

  return NextResponse.json({ ok: true, revalidated: true, now: Date.now() });
}
