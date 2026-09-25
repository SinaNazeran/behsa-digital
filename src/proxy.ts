import { NextResponse, type NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  return req.nextUrl.pathname.startsWith("/admin") ? adminGate(req) : notFoundGate(req);
}

/* Optimistic gate only (cookie presence). Real session validation happens
   in the admin layout and in every Server Action via requireUser(). */
function adminGate(req: NextRequest) {
  const res =
    req.nextUrl.pathname !== "/admin/login" && !req.cookies.has("behsa_session")
      ? NextResponse.redirect(new URL("/admin/login", req.url))
      : NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

/* Unknown public URLs get the prerendered /_not-found — server HTML with a
   404 status — instead of reaching a route that would throw notFound()
   mid-render, which Next can only answer with an empty shell the browser
   has to build (lib/public-paths.ts has the details).

   The app answers the question itself (/api/route-check), so the proxy
   shares none of its modules or caches. It is asked over loopback on the
   server's own port — never the public host, which from inside a
   container may not route back. Every doubt fails open: no answer, a slow
   answer or draft mode all fall through to the route, whose own
   notFound() still guards the page, exactly as before this gate existed. */
const STATIC_PUBLIC = new Set(["/", "/about", "/contact", "/articles", "/reports"]);

async function notFoundGate(req: NextRequest) {
  const { pathname } = req.nextUrl;
  /* draft preview shows unpublished content the check cannot see */
  if (STATIC_PUBLIC.has(pathname) || req.cookies.has("__prerender_bypass")) return NextResponse.next();

  const check = new URL("/api/route-check", `http://127.0.0.1:${process.env.PORT ?? 3000}`);
  check.searchParams.set("path", pathname);
  try {
    const res = await fetch(check, { cache: "no-store", signal: AbortSignal.timeout(1500) });
    if (res.ok && (await res.json()).exists === false) {
      return NextResponse.rewrite(new URL("/_not-found", req.url), { status: 404 });
    }
  } catch {
    /* fail open */
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    /* public pages only: no API, framework assets, media or files with an
       extension (sitemap.xml, robots.txt, feed.xml, public/*) */
    "/((?!api/|_next/|media/|admin(?:/|$)|.*\\.).*)",
  ],
};
