import type { Metadata, Viewport } from "next";
import { preinit, preload } from "react-dom";
import "@/styles/index.css";
import { SITE_URL } from "@/lib/seo";

/* The two Arabic subsets carry every glyph on a Persian page, so they are
   render-blocking in practice — yet the browser cannot discover them until
   it has downloaded and parsed the stylesheet that references them. Importing
   them here yields the same hashed URL the CSS resolves to, so preloading
   starts both fetches alongside the CSS instead of after it. The Latin
   subsets are deliberately not preloaded: on an RTL Persian page they are
   usually never needed, and preloading them would waste the bandwidth this
   is meant to save. */
import estedadArabic from "@/assets/fonts/estedad-arabic.woff2" with { turbopackModuleType: "asset" };
import vazirmatnArabic from "@/assets/fonts/vazirmatn-arabic.woff2" with { turbopackModuleType: "asset" };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "بهسا دیجیتال — سامانه هوشمند مدیریت انرژی",
    template: "%s | بهسا دیجیتال",
  },
  description:
    "بهسا دیجیتال — سامانه هوشمند پایش، تحلیل و بهینه‌سازی مصرف انرژی برای صنایع، سازمان‌ها و هلدینگ‌ها",
  applicationName: "بهسا دیجیتال",
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0062BD",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  /* preload() rather than a <link> in the tree: rendering the tag yourself
     gets it hoisted into <head> *and* leaves React emitting its own preload
     directive for the same file, so every font ends up with two tags.
     crossOrigin is required even same-origin — a font preload without it is
     treated as a different request than the CSS's own fetch, and the file is
     downloaded twice. */
  preload(vazirmatnArabic, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  preload(estedadArabic, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });

  /* Old Vite URLs were hash-based (/#/about); the hash never reaches the
     server, so public/legacy-hash-redirect.js forwards them in the browser.

     preinit(), not an inline <script>: React refuses to run — and warns
     about — any executable <script> it has to create itself in the
     browser, and that happens on every 404. A notFound() thrown by a page
     (the [...slug] catch-all throws it for every unknown URL) is served
     through Next's error recovery: an empty `__next_error__` shell that
     React renders from scratch with createRoot, <head> included. An async
     external script is a React resource instead — hoisted into <head>,
     deduplicated, and inserted the same way on the server and the client —
     so it runs in both cases and never warns. next/script would not help:
     its beforeInteractive strategy is itself an inline <script>. */
  preinit("/legacy-hash-redirect.js", { as: "script" });

  return (
    // suppressHydrationWarning on <html> only: some browser extensions (e.g. LanguageTool,
    // Grammarly) inject attributes like `data-lt-installed` onto <html>/<body> before React
    // hydrates. That's a false-positive mismatch on this one node, not a real bug — React
    // still fully checks and warns about mismatches everywhere else in the tree.
    // https://react.dev/reference/react-dom/client/hydrateRoot#handling-different-client-and-server-content
    //
    // data-scroll-behavior="smooth": our global CSS sets `scroll-behavior: smooth` on <html>
    // (src/styles/index.css) for in-page anchor scrolling, ported from the original site. As
    // of Next.js 16, Next no longer auto-disables smooth scrolling during client-side route
    // transitions unless this attribute opts in — without it, navigating between pages (e.g.
    // clicking a <Link>) would smooth-scroll to the top instead of jumping instantly, which
    // feels sluggish. This restores the snappy page-transition behavior while keeping smooth
    // scrolling for in-page anchors.
    // https://nextjs.org/docs/messages/missing-data-scroll-behavior
    <html lang="fa" dir="rtl" suppressHydrationWarning data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        {/* Nothing will ever add .is-in without JavaScript, so every
            scroll-revealed section below the hero would stay at opacity 0
            forever. Above the fold this is already moot — RevealOnLoad is a
            pure CSS animation — but the rest of the page should still be
            readable when the bundle is blocked or never arrives.

            It sits first inside <body>, not in <html>: only <head> and <body>
            may be children of <html>, and React does not hoist <noscript> the
            way it hoists <link> or a precedence-tagged <style>, so putting it
            there produced invalid markup and a hydration mismatch. First in
            <body> means the rule is parsed before any .rv element it governs. */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: "<style>.rv,.rv-l,.rv-r{opacity:1;transform:none}</style>",
          }}
        />
        {children}
      </body>
    </html>
  );
}
