import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { PageTitle } from "@/components/admin/ui";
import { listCategories, listMediaOptions } from "@/lib/admin-data";
import { toJalaliInput } from "@/lib/format";
import { SITE_URL } from "@/lib/seo";
import { saveArticle } from "../../../_actions/articles";

export const metadata = { title: "مقاله جدید" };

export default async function NewArticle() {
  const [categories, media] = await Promise.all([listCategories(), listMediaOptions()]);
  const [date, time] = toJalaliInput(new Date());
  return (
    <>
      <PageTitle title="مقاله جدید" />
      <ArticleEditor
        siteUrl={SITE_URL}
        categories={categories}
        media={media}
        saveAction={saveArticle}
        initial={{
          title: "", slug: "", excerpt: "", body: [], categoryId: null, authorName: "تیم تحلیل بهسا",
          chartStyle: "area", coverMediaId: null, status: "draft", featured: false,
          publishedDate: date, publishedTime: time, seoTitle: "", seoDescription: "", ogMediaId: null, canonicalUrl: "", noindex: false,
        }}
      />
    </>
  );
}
