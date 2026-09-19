import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { SLUG_RE } from "@/lib/format";

/* Admin-only: enable draft mode and open the article. */
export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug") ?? "";
  if (!(await getCurrentUser())) return new Response("Unauthorized", { status: 401 });
  if (!SLUG_RE.test(slug)) return new Response("Invalid slug", { status: 400 });
  (await draftMode()).enable();
  redirect(`/articles/${slug}`);
}
