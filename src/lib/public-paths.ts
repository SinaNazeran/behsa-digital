import "server-only";
import { getArticleBySlug, getLandingIndex, getReportAnyStatus, getReportCatalogue } from "@/lib/cms";

/* Does a public URL resolve to something — a page or a redirect?

   Asked by proxy.ts (through /api/route-check) before a dynamic route
   renders. A notFound() thrown *during* render can only reach the browser
   through Next's error recovery: an empty `__next_error__` shell that the
   client builds from scratch — no server HTML, a blank page without
   JavaScript. Knowing up front lets the proxy serve the prerendered
   /_not-found instead, which is real server HTML with a 404 status.

   Each branch mirrors its route's own lookups — same cached reads, same
   rules — so the answer can never disagree with what the page would do.
   A route that gains a new way to resolve a URL must gain it here too.
   Paths this file does not own answer `true`: the proxy then lets the
   route decide, exactly as before. */
export async function publicPathExists(pathname: string): Promise<boolean> {
  let parts: string[];
  try {
    parts = pathname.split("/").filter(Boolean).map(decodeURIComponent);
  } catch {
    return true; /* malformed escape: let the route answer it, as before */
  }
  if (parts.length === 0) return true;

  const [first, second] = parts;

  /* app/(site)/articles/[slug] — published articles only; drafts are the
     draft-mode path, which the proxy never checks */
  if (first === "articles" && parts.length === 2) return (await getArticleBySlug(second)) !== null;

  /* app/(site)/reports/[slug] — live, renamed (permanent redirect) or
     unpublished (redirect to the catalogue) all resolve */
  if (first === "reports" && parts.length === 2) {
    const { reports } = await getReportCatalogue();
    if (reports.some((r) => r.slug === second || r.previousSlugs.includes(second))) return true;
    return (await getReportAnyStatus(second)) !== null;
  }

  /* the static routes own their paths outright */
  if (parts.length === 1 && ["about", "contact", "articles", "reports"].includes(first)) return true;

  /* app/(site)/[...slug] — every menu node */
  return parts.join("/") in (await getLandingIndex());
}
