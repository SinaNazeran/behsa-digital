import { NextResponse, type NextRequest } from "next/server";
import { publicPathExists } from "@/lib/public-paths";

/* Called by proxy.ts before a dynamic public route renders (see
   lib/public-paths.ts for why). It runs here, in the app, rather than in
   the proxy itself: the proxy gets its own cache instance, so the same
   reads there could lag behind an admin edit and 404 a page that was just
   published. Here they share the pages' cache and its tag invalidation.

   Always dynamic: the reads it makes are cached and tagged already. */
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path");
  if (!path?.startsWith("/")) return NextResponse.json({ error: "path required" }, { status: 400 });
  return NextResponse.json(
    { exists: await publicPathExists(path) },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } },
  );
}
