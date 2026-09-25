import { notFound } from "next/navigation";
import Landing from "@/views/Landing";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { getLandingIndex, getReportCatalogue, getSettings } from "@/lib/cms";
import { buildMetadata, SITE_URL } from "@/lib/seo";

/* Data-driven landing pages for every navigation node
   (/product/…, /solutions/…, /industries/…, /resources/…, /about/…). */

type Props = { params: Promise<{ slug: string[] }> };

const resolve = async (parts: string[]) => (await getLandingIndex())[parts.map(decodeURIComponent).join("/")];

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const node = await resolve(slug);
  if (!node) return {};
  return buildMetadata({
    path: `/${node.slug}`,
    title: node.slug === node.section.slug ? node.title : `${node.title} — ${node.section.title}`,
    description: `${node.description}. ${node.title} در سامانه هوشمند مدیریت انرژی بهسا دیجیتال.`,
  });
}

export default async function LandingPage({ params }: Props) {
  const { slug } = await params;
  const node = await resolve(slug);
  if (!node) notFound();

  /* one list for both the visible breadcrumb and the JSON-LD; a section's
     own page (/product) must not repeat its title as a third crumb */
  const crumbs = [{ label: "خانه", path: "/" }, { label: node.section.title, path: `/${node.section.slug}` }];
  if (node.slug !== node.section.slug) crumbs.push({ label: node.title, path: `/${node.slug}` });

  const [index, settings, { reports }] = await Promise.all([getLandingIndex(), getSettings(), getReportCatalogue()]);
  const siblings = (index[node.section.slug]?.children ?? [])
    .filter((c) => c.href !== node.href)
    .slice(0, 4)
    .map((c) => ({ id: c.id, title: c.title, href: c.href, icon: c.icon }));
  /* report links resolve against the catalogue, so an unpublished report
     simply drops out; everything else must be live in the menu */
  const linked = (node.links ?? [])
    .map((l) => {
      const report = reports.find((r) => `reports/${r.slug}` === l.slug);
      if (report) return { slug: l.slug, title: report.label, href: report.href };
      const n = l.slug.startsWith("reports/") ? undefined : index[l.slug];
      return n && { slug: n.slug, title: n.title, href: n.href };
    })
    .filter((n) => n !== undefined);

  return (
    <>
      <JsonLd data={breadcrumbLd(SITE_URL, crumbs)} />
      <Landing node={node} crumbs={crumbs} siblings={siblings} linked={linked} panelUrl={settings.panelUrl} />
    </>
  );
}
