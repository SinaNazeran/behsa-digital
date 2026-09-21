import Contact from "@/views/Contact";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { getSettings } from "@/lib/cms";
import { buildMetadata, SITE_URL } from "@/lib/seo";

export function generateMetadata() {
  return buildMetadata({
    path: "/contact",
    title: "تماس با ما",
    description: "راه‌های ارتباط با بهسا دیجیتال: تلفن، ایمیل، آدرس و فرم تماس — برای مشاوره و استقرار سامانهٔ پایش و مدیریت مصرف انرژی.",
  });
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const [settings, params] = await Promise.all([getSettings(), searchParams]);
  return (
    <>
      <JsonLd data={breadcrumbLd(SITE_URL, [{ label: "خانه", path: "/" }, { label: "تماس با ما", path: "/contact" }])} />
      <Contact settings={settings} subject={(params.subject ?? "").slice(0, 160)} />
    </>
  );
}
