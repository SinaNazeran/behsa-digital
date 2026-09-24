import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { SLUG_RE } from "@/lib/format";

/* Admin-only: enable draft mode and open the article (or `?type=report`). */
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const slug = params.get("slug") ?? "";
  if (!(await getCurrentUser())) return new Response("Unauthorized", { status: 401 });
  if (!SLUG_RE.test(slug)) return new Response("Invalid slug", { status: 400 });
  (await draftMode()).enable();
  redirect(params.get("type") === "report" ? `/reports/${slug}` : `/articles/${slug}`);
}
