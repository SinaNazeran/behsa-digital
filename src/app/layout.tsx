import type { Metadata, Viewport } from "next";
import "@/styles/index.css";
import { SITE_URL } from "@/lib/seo";

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
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
