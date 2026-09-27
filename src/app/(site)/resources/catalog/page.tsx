import { notFound } from "next/navigation";
import Catalog from "@/views/Catalog";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { getCatalogs, getSettings } from "@/lib/cms";
import { CATALOG_PATH } from "@/content/navigation";
import { buildMetadata, SITE_URL } from "@/lib/seo";

/* A real route, so it outranks the `/[...slug]` landing template that
   would otherwise render the «کاتالوگ محصول» menu item. With nothing
   published it is a 404 — lib/public-paths.ts answers the same. */

export function generateMetadata() {
  return buildMetadata({
    path: CATALOG_PATH,
    title: "دانلود کاتالوگ محصول",
    description: "کاتالوگ سامانه هوشمند پایش و مدیریت انرژی بهسا دیجیتال را دانلود کنید: قابلیت‌ها، گزارش‌ها و راهکارهای کاهش هزینهٔ برق صنایع در یک فایل.",
  });
}

export default async function CatalogPage() {
  const [catalogs, settings] = await Promise.all([getCatalogs(), getSettings()]);
  if (!catalogs.length) notFound();
  return (
    <>
      <JsonLd
        data={breadcrumbLd(SITE_URL, [
          { label: "خانه", path: "/" },
          { label: "منابع", path: "/resources" },
          { label: "کاتالوگ محصول", path: CATALOG_PATH },
        ])}
      />
      <Catalog catalogs={catalogs} panelUrl={settings.panelUrl} />
    </>
  );
}
