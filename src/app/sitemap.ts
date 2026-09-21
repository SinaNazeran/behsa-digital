import type { MetadataRoute } from "next";
import { getAllPageSeo, getLandingIndex, getPublishedArticles } from "@/lib/cms";
import { SITE_NOINDEX, SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (SITE_NOINDEX) return [];
  const [articles, seo, landings] = await Promise.all([getPublishedArticles(), getAllPageSeo(), getLandingIndex()]);
  const hidden = new Set(seo.filter((p) => p.noindex).map((p) => p.path));
  const lastArticle = articles[0]?.updatedAt ? new Date(articles[0].updatedAt) : undefined;

  const core: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1, lastModified: lastArticle },
    { url: `${SITE_URL}/articles`, changeFrequency: "weekly", priority: 0.8, lastModified: lastArticle },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.6 },
  ];

  /* menu targets that are real routes already listed in `core` */
  const reserved = new Set(core.map((c) => c.url));
  const landingUrls: MetadataRoute.Sitemap = Object.keys(landings)
    .map((slug) => `${SITE_URL}/${slug}`)
    .filter((url) => !reserved.has(url))
    .map((url) => ({
      url,
      changeFrequency: "monthly" as const,
      priority: url.replace(`${SITE_URL}/`, "").includes("/") ? 0.6 : 0.7,
    }));

  const posts: MetadataRoute.Sitemap = articles
    .filter((a) => !a.noindex && !a.canonicalUrl)
    .map((a) => ({
      url: `${SITE_URL}/articles/${a.slug}`,
      lastModified: new Date(a.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      ...(a.ogImageUrl ? { images: [`${SITE_URL}${a.ogImageUrl}`] } : {}),
    }));

  return [...core, ...landingUrls, ...posts].filter((e) => !hidden.has(e.url.replace(SITE_URL, "") || "/"));
}
