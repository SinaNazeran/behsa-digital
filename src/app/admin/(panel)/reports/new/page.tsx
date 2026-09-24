import Link from "next/link";
import { ReportEditor } from "@/components/admin/ReportEditor";
import { Card, PageTitle } from "@/components/admin/ui";
import { listMediaOptions, listReportCategories, listReports, relatedPageOptions } from "@/lib/admin-data";
import { SITE_URL } from "@/lib/seo";
import { saveReport } from "../../../_actions/reports";

export const metadata = { title: "گزارش جدید" };

export default async function NewReport() {
  const [categories, media, reports] = await Promise.all([listReportCategories(), listMediaOptions(), listReports()]);

  if (categories.length === 0) {
    return (
      <>
        <PageTitle title="گزارش جدید" />
        <Card>
          <p className="text-[13.5px] text-ink2">
            هر گزارش باید در یک دسته باشد. ابتدا از <Link href="/admin/report-categories" className="font-bold text-orange-700">دسته‌بندی گزارش‌ها</Link> یک دسته بسازید.
          </p>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageTitle title="گزارش جدید" />
      <ReportEditor
        siteUrl={SITE_URL}
        categories={categories.map(({ c }) => ({ id: c.id, name: c.name }))}
        media={media}
        otherReports={reports.map((r) => ({ id: r.id, label: r.menuTitle || r.title, category: r.category }))}
        pages={relatedPageOptions()}
        saveAction={saveReport}
        initial={{
          title: "", menuTitle: "", slug: "", question: "", lead: "", categoryId: null, audiences: [], icon: "",
          sections: [], gallery: [], relatedReportIds: [], relatedPages: [], keywords: [], status: "draft", sortOrder: 0,
          seoTitle: "", seoDescription: "", ogMediaId: null, noindex: false,
        }}
      />
    </>
  );
}
