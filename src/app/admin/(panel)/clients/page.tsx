import { asc } from "drizzle-orm";
import { db, schema } from "@/db";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { PageTitle } from "@/components/admin/ui";

export const metadata = { title: "مشتریان" };

export default async function Page() {
  const items = await db.select().from(schema.clients).orderBy(asc(schema.clients.sortOrder), asc(schema.clients.id));
  return (
    <>
      <PageTitle title="مشتریان" lead="نام‌ها در نوار متحرک صفحه «درباره ما» نمایش داده می‌شوند." />
      <CollectionManager kind="clients" items={items} addTitle="مشتری جدید" />
    </>
  );
}
