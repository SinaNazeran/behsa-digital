import { getPublishedArticles, getSettings } from "@/lib/cms";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const [articles, settings] = await Promise.all([getPublishedArticles(), getSettings()]);
  const items = articles
    .slice(0, 50)
    .map(
      (a) => `    <item>
      <title>${esc(a.title)}</title>
      <link>${SITE_URL}/articles/${a.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/articles/${a.slug}</guid>
      <description>${esc(a.excerpt)}</description>
      <category>${esc(a.cat)}</category>
      ${a.publishedAt ? `<pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>` : ""}
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(`مقالات ${settings.siteName}`)}</title>
    <link>${SITE_URL}/articles</link>
    <atom:link href="${SITE_URL}/articles/feed.xml" rel="self" type="application/rss+xml" />
    <description>${esc(settings.defaultDescription)}</description>
    <language>fa-IR</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=900, s-maxage=900" },
  });
}
