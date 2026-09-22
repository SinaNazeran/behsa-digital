import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import ArticleDetail from "@/views/ArticleDetail";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { getArticleBySlug, getArticleForPreview, getPublishedArticles, getSettings, toCardView } from "@/lib/cms";
import { getCurrentUser } from "@/lib/auth";
import { absoluteUrl, buildMetadata, DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

/** drafts are visible only in draft mode AND with a valid admin session */
async function loadArticle(slug: string) {
  const { isEnabled } = await draftMode();
  if (isEnabled && (await getCurrentUser())) return { article: await getArticleForPreview(slug), preview: true };
  return { article: await getArticleBySlug(slug), preview: false };
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { article, preview } = await loadArticle(slug);
  if (!article) return { title: "مقاله پیدا نشد", robots: { index: false } };
  return buildMetadata({
    path: `/articles/${article.slug}`,
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    type: "article",
    image: article.ogImageUrl,
    canonical: article.canonicalUrl || undefined,
    noindex: article.noindex || preview,
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    authors: [article.author],
    section: article.cat,
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const { article, preview } = await loadArticle(slug);
  if (!article) notFound();

  const [all, settings] = await Promise.all([getPublishedArticles(), getSettings()]);
  const others = all.filter((a) => a.slug !== article.slug);
  const related = [...others.filter((a) => a.catSlug === article.catSlug), ...others.filter((a) => a.catSlug !== article.catSlug)].slice(0, 3);

  const url = `${SITE_URL}/articles/${article.slug}`;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    headline: article.title,
    description: article.seoDescription || article.excerpt,
    image: [absoluteUrl(article.ogImageUrl ?? DEFAULT_OG_IMAGE)],
    datePublished: article.publishedAt ?? undefined,
    dateModified: article.updatedAt,
    inLanguage: "fa-IR",
    articleSection: article.cat,
    wordCount: article.body.flatMap((s) => s.p).join(" ").split(/\s+/).length,
    author: { "@type": article.author.startsWith("تیم") ? "Organization" : "Person", name: article.author },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <>
      {preview && (
        <div className="fixed bottom-4 left-4 z-[80] flex items-center gap-3 rounded-[10px] bg-ink px-4 py-2.5 text-[13px] font-bold text-white shadow-lift">
          پیش‌نمایش ({article.status === "draft" ? "پیش‌نویس" : "منتشرشده"})
          <a href={`/api/preview/exit?slug=${encodeURIComponent(article.slug)}`} className="underline">خروج</a>
        </div>
      )}
      <JsonLd
        data={[
          articleLd,
          breadcrumbLd(SITE_URL, [
            { label: "خانه", path: "/" },
            { label: "مقالات", path: "/articles" },
            { label: article.title, path: `/articles/${article.slug}` },
          ]),
        ]}
      />
      <ArticleDetail article={article} related={related.map(toCardView)} panelUrl={settings.panelUrl} />
    </>
  );
}
