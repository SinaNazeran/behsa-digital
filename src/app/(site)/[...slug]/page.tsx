import { notFound } from "next/navigation";
import Landing from "@/views/Landing";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { getLandingIndex, getSettings } from "@/lib/cms";
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

  const crumbs = [{ label: "خانه", path: "/" }, { label: node.section.title, path: `/${node.section.slug}` }];
  if (node.slug !== node.section.slug) crumbs.push({ label: node.title, path: `/${node.slug}` });

  const [index, settings] = await Promise.all([getLandingIndex(), getSettings()]);
  const siblings = (index[node.section.slug]?.children ?? [])
    .filter((c) => c.href !== node.href)
    .slice(0, 4)
    .map((c) => ({ id: c.id, title: c.title, href: c.href, icon: c.icon }));
  const linked = (node.links ?? [])
    .map((l) => index[l.slug])
    .filter((n) => Boolean(n))
    .map((n) => ({ slug: n.slug, title: n.title, href: n.href }));

  return (
    <>
      <JsonLd data={breadcrumbLd(SITE_URL, crumbs)} />
      <Landing node={node} siblings={siblings} linked={linked} panelUrl={settings.panelUrl} />
    </>
  );
}
