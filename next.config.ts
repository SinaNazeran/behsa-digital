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
