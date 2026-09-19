import { asc } from "drizzle-orm";
import { db, schema } from "@/db";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { PageTitle } from "@/components/admin/ui";

export const metadata = { title: "نظرات مشتریان" };

export default async function Page() {
  const items = await db.select().from(schema.testimonials).orderBy(asc(schema.testimonials.sortOrder), asc(schema.testimonials.id));
  return (
    <>
      <PageTitle title="نظرات مشتریان" lead="در صفحه اصلی نمایش داده می‌شوند." />
      <CollectionManager kind="testimonials" items={items} addTitle="نظر جدید" />
    </>
  );
}
