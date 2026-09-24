import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { SLUG_RE } from "@/lib/format";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const slug = params.get("slug") ?? "";
  const base = params.get("type") === "report" ? "/reports" : "/articles";
  (await draftMode()).disable();
  redirect(SLUG_RE.test(slug) ? `${base}/${slug}` : base);
}
