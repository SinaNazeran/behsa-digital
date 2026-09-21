import About from "@/views/About";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { buildMetadata, SITE_URL } from "@/lib/seo";

export function generateMetadata() {
  return buildMetadata({
    path: "/about",
    title: "درباره ما",
    description: "بهسا دیجیتال؛ ترکیبی از مهندسان برق قدرت و متخصصان داده. از دادهٔ کنتور هوشمند، اقلام جریمه‌پذیر قبض برق صنعتی را پیش از صدور قبض محاسبه می‌کنیم.",
  });
}

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd(SITE_URL, [{ label: "خانه", path: "/" }, { label: "درباره ما", path: "/about" }])} />
      <About />
    </>
  );
}
