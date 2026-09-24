import Reports from "@/views/Reports";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { getNavigation, getReportCatalogue, getSettings } from "@/lib/cms";
import { buildMetadata, SITE_URL } from "@/lib/seo";

const FALLBACK_LEAD = "گزارش‌ها بر اساس تصمیمی که باید گرفته شود دسته‌بندی شده‌اند، نه بر اساس نوع نمودار.";

/* the lead is the menu's own intro text, so the editor writes it once */
async function lead() {
  const section = (await getNavigation()).find((s) => s.href === "/reports");
  return section?.intro?.description || section?.description || FALLBACK_LEAD;
}

export async function generateMetadata() {
  return buildMetadata({ path: "/reports", title: "گزارش‌های سامانه", description: await lead() });
}

export default async function ReportsPage() {
  const [{ categories, reports }, settings, text] = await Promise.all([getReportCatalogue(), getSettings(), lead()]);
  /* cards need a handful of fields — report bodies never reach the browser */
  const cards = reports.map((r) => ({
    id: r.id, href: r.href, label: r.label, question: r.question, icon: r.icon, categoryId: r.category.id,
    audiences: r.audiences, audienceKeys: r.audienceKeys, search: r.search,
  }));
  const used = categories.filter((c) => cards.some((r) => r.categoryId === c.id));

  return (
    <>
      <JsonLd data={breadcrumbLd(SITE_URL, [{ label: "خانه", path: "/" }, { label: "گزارش‌ها", path: "/reports" }])} />
      <Reports lead={text} categories={used} reports={cards} panelUrl={settings.panelUrl} />
    </>
  );
}
