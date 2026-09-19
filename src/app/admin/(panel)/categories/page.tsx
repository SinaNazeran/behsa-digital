import { sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { AdminForm, Card, ConfirmSubmit, Field, PageTitle, SubmitButton } from "@/components/admin/ui";
import { inputCls } from "@/components/admin/styles";
import { deleteCategory, saveCategory } from "../../_actions/articles";

export const metadata = { title: "دسته‌بندی مقالات" };

export default async function CategoriesAdmin() {
  const rows = await db
    .select({ c: schema.categories, n: sql<number>`(select count(*)::int from ${schema.articles} where ${schema.articles.categoryId} = ${schema.categories.id})` })
    .from(schema.categories)
    .orderBy(schema.categories.sortOrder, schema.categories.id);

  return (
    <>
      <PageTitle title="دسته‌بندی مقالات" lead="دسته‌ها در فیلتر صفحه مقالات و مسیر راهنمای هر مقاله نمایش داده می‌شوند." />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {rows.map(({ c, n }) => (
            <Card key={c.id}>
              <AdminForm action={saveCategory} className="grid gap-3 md:grid-cols-[1fr_1fr_90px]">
                <input type="hidden" name="id" value={c.id} />
                <Field label="نام"><input name="name" defaultValue={c.name} className={inputCls} /></Field>
                <Field label="نامک"><input name="slug" defaultValue={c.slug} dir="ltr" className={inputCls} /></Field>
                <Field label="ترتیب"><input name="sortOrder" defaultValue={c.sortOrder} type="number" dir="ltr" className={inputCls} /></Field>
                <div className="flex items-center justify-between gap-2 md:col-span-3">
                  <span className="text-[12px] text-ink3">{n.toLocaleString("fa-IR")} مقاله</span>
                  <SubmitButton variant="secondary">ذخیره</SubmitButton>
                </div>
              </AdminForm>
              <AdminForm action={deleteCategory} className="mt-2 flex justify-end">
                <input type="hidden" name="id" value={c.id} />
                <ConfirmSubmit label="حذف دسته" />
              </AdminForm>
            </Card>
          ))}
        </div>
        <Card title="دسته جدید" className="xl:sticky xl:top-20 xl:self-start">
          <AdminForm action={saveCategory} className="space-y-4" resetOnSuccess>
            <Field label="نام" htmlFor="new-name"><input id="new-name" name="name" className={inputCls} /></Field>
            <Field label="نامک انگلیسی" htmlFor="new-slug" hint="مثل energy-management"><input id="new-slug" name="slug" dir="ltr" className={inputCls} /></Field>
            <input type="hidden" name="sortOrder" value={rows.length} />
            <SubmitButton>افزودن</SubmitButton>
          </AdminForm>
        </Card>
      </div>
    </>
  );
}
