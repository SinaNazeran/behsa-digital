import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { SLUG_RE } from "@/lib/format";

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug") ?? "";
  (await draftMode()).disable();
  redirect(SLUG_RE.test(slug) ? `/articles/${slug}` : "/articles");
}
