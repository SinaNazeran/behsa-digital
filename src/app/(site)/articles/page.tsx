import Articles from "@/views/Articles";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { getCategories, getPublishedArticles, toCardView } from "@/lib/cms";
import { buildMetadata, SITE_URL } from "@/lib/seo";

export async function generateMetadata() {
  const meta = await buildMetadata({
    path: "/articles",
    title: "مقالات مدیریت انرژی",
    description: "تحلیل‌های کاربردی تیم بهسا درباره دیماند، توان راکتیو، خرید برق و انرژی خورشیدی — به زبان مدیران انرژی.",
  });
  return {
    ...meta,
    alternates: { ...meta.alternates, types: { "application/rss+xml": [{ url: "/articles/feed.xml", title: "مقالات بهسا دیجیتال" }] } },
  };
}

export default async function ArticlesPage() {
  const [articles, categories] = await Promise.all([getPublishedArticles(), getCategories()]);
  const usedCats = categories.filter((c) => articles.some((a) => a.catSlug === c.slug)).map((c) => c.name);

  const listLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/articles#blog`,
    name: "مقالات بهسا دیجیتال",
    url: `${SITE_URL}/articles`,
    inLanguage: "fa-IR",
    blogPost: articles.slice(0, 20).map((a) => ({
      "@type": "BlogPosting",
      headline: a.title,
      url: `${SITE_URL}/articles/${a.slug}`,
      datePublished: a.publishedAt ?? undefined,
    })),
  };

  return (
    <>
      <JsonLd data={[breadcrumbLd(SITE_URL, [{ label: "خانه", path: "/" }, { label: "مقالات", path: "/articles" }]), listLd]} />
      <Articles articles={articles.map(toCardView)} categories={usedCats} />
    </>
  );
}
