import { requireUser } from "@/lib/auth";
import { asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { PageTitle } from "@/components/admin/ui";
import { listMediaOptions } from "@/lib/admin-data";

export const metadata = { title: "کاتالوگ‌ها" };

export default async function Page() {
  await requireUser();
  const c = schema.catalogs, f = schema.media;
  const [rows, media] = await Promise.all([
    db.select({ c, file: { id: f.id, filename: f.filename, size: f.size } })
      .from(c).innerJoin(f, eq(c.fileId, f.id))
      .orderBy(asc(c.sortOrder), asc(c.id)),
    listMediaOptions(),
  ]);
  return (
    <>
      <PageTitle
        title="کاتالوگ‌ها"
        lead="در صفحهٔ «کاتالوگ محصول» (/resources/catalog) به ترتیب همین فهرست نمایش داده می‌شوند؛ اولی کاتالوگ اصلی است و در صفحات محصول هم معرفی می‌شود. تا وقتی هیچ کاتالوگی نمایش داده نشود، صفحه و همهٔ لینک‌هایش از سایت پنهان‌اند."
      />
      <CollectionManager kind="catalogs" items={rows.map((r) => ({ ...r.c, file: r.file }))} addTitle="کاتالوگ جدید" media={media} />
    </>
  );
}
