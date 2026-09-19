import { NextResponse, type NextRequest } from "next/server";

/* Optimistic gate only (cookie presence). Real session validation happens
   in the admin layout and in every Server Action via requireUser(). */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res =
    pathname !== "/admin/login" && !req.cookies.has("behsa_session")
      ? NextResponse.redirect(new URL("/admin/login", req.url))
      : NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
