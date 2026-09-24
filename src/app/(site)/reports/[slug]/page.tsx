import { draftMode } from "next/headers";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import ReportDetail from "@/views/ReportDetail";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { getCurrentUser } from "@/lib/auth";
import { getLandingIndex, getReportAnyStatus, getReportCatalogue, getSettings } from "@/lib/cms";
import { pageKind } from "@/content/reports";
import { buildMetadata, SITE_URL } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

/** drafts are visible only in draft mode AND with a valid admin session */
async function loadReport(slug: string) {
  const { isEnabled } = await draftMode();
  if (isEnabled && (await getCurrentUser())) return { report: await getReportAnyStatus(slug), preview: true };
  const { reports } = await getReportCatalogue();
  return { report: reports.find((r) => r.slug === slug) ?? null, preview: false };
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { report, preview } = await loadReport(slug);
  if (!report) return { title: "گزارش پیدا نشد", robots: { index: false } };
  return buildMetadata({
    path: report.href,
    title: report.seoTitle || report.title,
    description: report.seoDescription || report.question || report.lead,
    image: report.ogImageUrl,
    noindex: report.noindex || preview,
  });
}

export default async function ReportPage({ params }: Props) {
  const { slug } = await params;
  const { report, preview } = await loadReport(slug);

  if (!report) {
    /* a renamed report keeps its old address alive */
    const { reports } = await getReportCatalogue();
    const renamed = reports.find((r) => r.previousSlugs.includes(slug));
    if (renamed) permanentRedirect(renamed.href);
    /* an unpublished report sends its visitors to the catalogue, not a 404 */
    if (await getReportAnyStatus(slug)) redirect("/reports");
    notFound();
  }

  const [{ reports }, index, settings] = await Promise.all([getReportCatalogue(), getLandingIndex(), getSettings()]);
  const others = reports.filter((r) => r.id !== report.id);
  const picked = report.relatedReportIds.map((id) => others.find((r) => r.id === id)).filter((r) => r !== undefined);
  const related = picked.length ? picked : others.filter((r) => r.category.id === report.category.id).slice(0, 5);
  /* only pages that are live in the menu are linked */
  const pages = report.relatedPages
    .map((s) => index[s])
    .filter((n) => n !== undefined)
    .map((n) => ({ href: n.href, label: `${pageKind(n.slug)}: ${n.title}` }));

  return (
    <>
      {preview && (
        <div className="fixed bottom-4 left-4 z-[80] flex items-center gap-3 rounded-[10px] bg-ink px-4 py-2.5 text-[13px] font-bold text-white shadow-lift">
          پیش‌نمایش ({report.status === "draft" ? "پیش‌نویس" : "منتشرشده"})
          <a href={`/api/preview/exit?type=report&slug=${encodeURIComponent(report.slug)}`} className="underline">خروج</a>
        </div>
      )}
      <JsonLd
        data={breadcrumbLd(SITE_URL, [
          { label: "خانه", path: "/" },
          { label: "گزارش‌ها", path: "/reports" },
          { label: report.label, path: report.href },
        ])}
      />
      <ReportDetail report={report} related={related} pages={pages} panelUrl={settings.panelUrl} />
    </>
  );
}
