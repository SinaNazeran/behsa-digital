import About from "@/views/About";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { getClients } from "@/lib/cms";
import { buildMetadata, SITE_URL } from "@/lib/seo";

export function generateMetadata() {
  return buildMetadata({
    path: "/about",
    title: "درباره ما",
    description: "بهسا دیجیتال؛ ترکیبی از مهندسان برق قدرت و متخصصان داده برای پایش، تحلیل و بهینه‌سازی مصرف انرژی صنایع و هلدینگ‌ها.",
  });
}

export default async function AboutPage() {
  const clients = await getClients();
  return (
    <>
      <JsonLd data={breadcrumbLd(SITE_URL, [{ label: "خانه", path: "/" }, { label: "درباره ما", path: "/about" }])} />
      <About clients={clients} />
    </>
  );
}
