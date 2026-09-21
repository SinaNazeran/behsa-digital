import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

const nextConfig: NextConfig = {
  /* self-contained server bundle for Docker / VPS deployments */
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: false,
  /* Pin the workspace root to this app's own directory. Without this, Next.js
     walks up looking for a lockfile and can land on the sibling Vite project's
     package-lock.json (behsa-digital/), since both projects currently live
     side by side on disk. */
  turbopack: {
    root: __dirname,
  },
  experimental: {
    /* media uploads go through Server Actions (limit enforced again in code) */
    serverActions: { bodySizeLimit: "6mb" },
  },
  async redirects() {
    return [
      { source: "/products", destination: "/product", permanent: true },
      /* /services was retired: it described the same product as /product and
         /solutions under a third set of names. Its consulting content moved
         into the solution pages (docs/content-spec.md §9). The URL has
         equity, so it redirects rather than 404s. */
      { source: "/services", destination: "/product", permanent: true },
      /* the demo page was removed at the business's request; the site has
         one CTA, the panel. Any link already in the wild lands on contact. */
      { source: "/demo", destination: "/contact", permanent: true },
      { source: "/resources/training", destination: "/articles", permanent: true },
      { source: "/resources/reports", destination: "/reports", permanent: true },
      { source: "/resources/videos", destination: "/articles", permanent: true },
      { source: "/resources/guides", destination: "/product/platform", permanent: true },
      { source: "/about/expertise", destination: "/about", permanent: true },
      { source: "/about/team", destination: "/about", permanent: true },
      { source: "/product/capabilities/multi-site", destination: "/solutions/multi-site", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/resources/articles", destination: "/articles", permanent: true },
      { source: "/about/about", destination: "/about", permanent: true },
    ];
  },
  async headers() {
    const isDev = process.env.NODE_ENV !== "production";
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: isDev
              ? "no-cache, no-store, must-revalidate"
              : "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
