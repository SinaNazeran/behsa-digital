import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { PageTitle } from "@/components/admin/ui";
import { btnCls } from "@/components/admin/styles";
import { listCategories, listMediaOptions } from "@/lib/admin-data";
import { toJalaliInput } from "@/lib/format";
import { SITE_URL } from "@/lib/seo";
import { deleteArticle, saveArticle } from "../../../_actions/articles";

export const metadata = { title: "ویرایش مقاله" };

export default async function EditArticle({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  const { id } = await params;
  const { created } = await searchParams;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) notFound();

  const [[a], categories, media] = await Promise.all([
    db.select().from(schema.articles).where(eq(schema.articles.id, numId)).limit(1),
    listCategories(),
    listMediaOptions(),
  ]);
  if (!a) notFound();
  const [date, time] = toJalaliInput(a.publishedAt);

  return (
    <>
      <PageTitle
        title="ویرایش مقاله"
        actions={
          <div className="flex gap-2">
            {a.status === "published" && <a href={`/articles/${a.slug}`} target="_blank" rel="noopener" className={btnCls("secondary")}>مشاهده در سایت ↗</a>}
            <Link href="/admin/articles" className={btnCls("ghost")}>بازگشت به فهرست</Link>
          </div>
        }
      />
      {created && <p role="status" className="mb-4 rounded-[8px] border border-accent/30 bg-accent-soft px-4 py-2.5 text-[13.5px] font-semibold text-ok">مقاله ساخته شد.</p>}
      <ArticleEditor
        siteUrl={SITE_URL}
        categories={categories}
        media={media}
        saveAction={saveArticle}
        deleteAction={deleteArticle}
        initial={{
          id: a.id, title: a.title, slug: a.slug, excerpt: a.excerpt, body: a.body, categoryId: a.categoryId,
          authorName: a.authorName, chartStyle: a.chartStyle, coverMediaId: a.coverMediaId, status: a.status,
          featured: a.featured, publishedDate: date, publishedTime: time, seoTitle: a.seoTitle,
          seoDescription: a.seoDescription, ogMediaId: a.ogMediaId, canonicalUrl: a.canonicalUrl, noindex: a.noindex,
        }}
      />
    </>
  );
}
