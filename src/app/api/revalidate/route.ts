import { revalidatePath, revalidateTag } from "next/cache";
import { TAGS } from "@/lib/cms";
import { NextResponse } from "next/server";

export async function GET() {
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
