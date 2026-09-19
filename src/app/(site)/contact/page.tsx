import Contact from "@/views/Contact";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { getSettings } from "@/lib/cms";
import { buildMetadata, SITE_URL } from "@/lib/seo";

export function generateMetadata() {
  return buildMetadata({
    path: "/contact",
    title: "تماس با ما",
    description: "راه‌های ارتباط با بهسا دیجیتال برای مشاوره، دمو و استقرار سامانه پایش و مدیریت مصرف انرژی.",
  });
}

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <>
      <JsonLd data={breadcrumbLd(SITE_URL, [{ label: "خانه", path: "/" }, { label: "تماس با ما", path: "/contact" }])} />
      <Contact settings={settings} />
    </>
  );
}
