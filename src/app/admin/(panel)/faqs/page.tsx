import { asc } from "drizzle-orm";
import { db, schema } from "@/db";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { PageTitle } from "@/components/admin/ui";

export const metadata = { title: "پرسش‌های متداول" };

export default async function Page() {
  const items = await db.select().from(schema.faqs).orderBy(asc(schema.faqs.sortOrder), asc(schema.faqs.id));
  return (
    <>
      <PageTitle title="پرسش‌های متداول" lead="در صفحه اصلی نمایش داده می‌شوند و به‌صورت داده ساختاریافته FAQ برای گوگل هم ارسال می‌شوند." />
      <CollectionManager kind="faqs" items={items} addTitle="پرسش جدید" />
    </>
  );
}
