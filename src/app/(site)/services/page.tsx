import Services from "@/views/Services";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { SERVICES } from "@/content/data";
import { buildMetadata, SITE_URL } from "@/lib/seo";

export function generateMetadata() {
  return buildMetadata({
    path: "/services",
    title: "خدمات مشاوره مدیریت انرژی",
    description: "تحلیل دیماند و قدرت قراردادی، توان راکتیو و بانک خازنی، کیفیت برق، خرید انرژی و امکان‌سنجی خورشیدی — خدمات مشاوره تخصصی بهسا دیجیتال.",
  });
}

export default function ServicesPage() {
  const servicesLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: SERVICES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": "Service", name: s.title, description: s.solution, provider: { "@id": `${SITE_URL}/#organization` } },
    })),
  };
  return (
    <>
      <JsonLd data={[breadcrumbLd(SITE_URL, [{ label: "خانه", path: "/" }, { label: "خدمات", path: "/services" }]), servicesLd]} />
      <Services />
    </>
  );
}
