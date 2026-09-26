import Link from "next/link";
import { listReportCategories } from "@/lib/admin-data";
import { AdminForm, Card, ConfirmSubmit, Field, PageTitle, SubmitButton } from "@/components/admin/ui";
import { IconPicker } from "@/components/admin/IconPicker";
import { TonePicker } from "@/components/admin/TonePicker";
import { inputCls } from "@/components/admin/styles";
import { deleteReportCategory, saveReportCategory } from "../../_actions/reports";

export const metadata = { title: "دسته‌بندی گزارش‌ها" };

export default async function ReportCategoriesAdmin() {
  const rows = await listReportCategories();
  /* which other category wears each colour, so the picker can say so */
  const takenBy = (id: number) => Object.fromEntries(rows.filter(({ c }) => c.id !== id && c.tone).map(({ c }) => [c.tone, c.name]));

  return (
    <>
      <PageTitle
        title="دسته‌بندی گزارش‌ها"
        lead="دسته‌ها گزارش‌ها را بر اساس تصمیمی که مدیر باید بگیرد گروه‌بندی می‌کنند. نام و ترتیب آن‌ها در صفحهٔ گزارش‌های سایت نمایش داده می‌شود."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {rows.map(({ c, n }) => (
            <Card key={c.id}>
              <AdminForm action={saveReportCategory} className="grid gap-3 md:grid-cols-[1fr_1fr_90px]">
                <input type="hidden" name="id" value={c.id} />
                <Field label="نام" htmlFor={`name-${c.id}`}><input id={`name-${c.id}`} name="name" defaultValue={c.name} className={inputCls} /></Field>
                <Field label="نامک" htmlFor={`slug-${c.id}`}><input id={`slug-${c.id}`} name="slug" defaultValue={c.slug} dir="ltr" className={inputCls} /></Field>
                <Field label="ترتیب" htmlFor={`sort-${c.id}`}><input id={`sort-${c.id}`} name="sortOrder" defaultValue={c.sortOrder} type="number" dir="ltr" className={inputCls} /></Field>
                <Field label="سؤال مشترک گزارش‌های این دسته" htmlFor={`q-${c.id}`} className="md:col-span-3">
                  <input id={`q-${c.id}`} name="question" defaultValue={c.question} className={inputCls} placeholder="چرا قبض برق این‌قدر است؟" />
                </Field>
                <Field label="آیکون" className="md:col-span-3"><IconPicker name="icon" defaultValue={c.icon} /></Field>
                <div className="md:col-span-3"><TonePicker defaultValue={c.tone} takenBy={takenBy(c.id)} idPrefix={`tone-${c.id}`} /></div>
                <div className="flex items-center justify-between gap-2 md:col-span-3">
                  <Link href="/admin/reports" className="text-[12px] text-ink3 hover:text-orange-700">{n.toLocaleString("fa-IR")} گزارش</Link>
                  <SubmitButton variant="secondary">ذخیره</SubmitButton>
                </div>
              </AdminForm>
              <AdminForm action={deleteReportCategory} className="mt-2 flex justify-end">
                <input type="hidden" name="id" value={c.id} />
                <ConfirmSubmit label="حذف دسته" />
              </AdminForm>
            </Card>
          ))}
          {rows.length === 0 && <Card><p className="text-[13.5px] text-ink2">هنوز دسته‌ای ساخته نشده است.</p></Card>}
        </div>
        <Card title="دستهٔ جدید" className="xl:sticky xl:top-20 xl:self-start">
          <AdminForm action={saveReportCategory} className="space-y-4" resetOnSuccess>
            <Field label="نام" htmlFor="new-name"><input id="new-name" name="name" className={inputCls} /></Field>
            <Field label="نامک انگلیسی" htmlFor="new-slug" hint="مثل power-quality — در آدرس بخش دسته استفاده می‌شود."><input id="new-slug" name="slug" dir="ltr" className={inputCls} /></Field>
            <Field label="سؤال مشترک" htmlFor="new-question"><input id="new-question" name="question" className={inputCls} /></Field>
            <p className="text-[12px] leading-5 text-ink3">رنگ دستهٔ جدید خودکار از رنگ‌های آزاد انتخاب می‌شود و بعداً قابل تغییر است.</p>
            <input type="hidden" name="sortOrder" value={rows.length} />
            <SubmitButton>افزودن</SubmitButton>
          </AdminForm>
        </Card>
      </div>
    </>
  );
}
