import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { ReportEditor } from "@/components/admin/ReportEditor";
import { PageTitle } from "@/components/admin/ui";
import { btnCls } from "@/components/admin/styles";
import { listMediaOptions, listReportCategories, listReports, relatedPageOptions } from "@/lib/admin-data";
import { SITE_URL } from "@/lib/seo";
import { deleteReport, saveReport } from "../../../_actions/reports";

export const metadata = { title: "ویرایش گزارش" };

export default async function EditReport({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  const { id } = await params;
  const { created } = await searchParams;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) notFound();

  const [[r], categories, media, reports] = await Promise.all([
    db.select().from(schema.reports).where(eq(schema.reports.id, numId)).limit(1),
    listReportCategories(),
    listMediaOptions(),
    listReports(),
  ]);
  if (!r) notFound();

  return (
    <>
      <PageTitle
        title="ویرایش گزارش"
        actions={
          <div className="flex gap-2">
            {r.status === "published" && <a href={`/reports/${r.slug}`} target="_blank" rel="noopener" className={btnCls("secondary")}>مشاهده در سایت ↗</a>}
            <Link href="/admin/reports" className={btnCls("ghost")}>بازگشت به فهرست</Link>
          </div>
        }
      />
      {created && <p role="status" className="mb-4 rounded-[8px] border border-accent/30 bg-accent-soft px-4 py-2.5 text-[13.5px] font-semibold text-ok">گزارش ساخته شد.</p>}
      <ReportEditor
        siteUrl={SITE_URL}
        categories={categories.map(({ c }) => ({ id: c.id, name: c.name }))}
        media={media}
        otherReports={reports.filter((x) => x.id !== r.id).map((x) => ({ id: x.id, label: x.menuTitle || x.title, category: x.category }))}
        pages={relatedPageOptions()}
        saveAction={saveReport}
        deleteAction={deleteReport}
        initial={{
          id: r.id, title: r.title, menuTitle: r.menuTitle, slug: r.slug, question: r.question, lead: r.lead,
          categoryId: r.categoryId, audiences: r.audiences, icon: r.icon, sections: r.sections, gallery: r.gallery,
          relatedReportIds: r.relatedReportIds, relatedPages: r.relatedPages, keywords: r.keywords, status: r.status, sortOrder: r.sortOrder,
          seoTitle: r.seoTitle, seoDescription: r.seoDescription, ogMediaId: r.ogMediaId, noindex: r.noindex,
        }}
      />
    </>
  );
}
