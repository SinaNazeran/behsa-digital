import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { AdminForm, Card, ConfirmSubmit, Field, PageTitle, SubmitButton } from "@/components/admin/ui";
import { inputCls } from "@/components/admin/styles";
import { CopyButton } from "@/components/admin/CopyButton";
import { deleteMedia, updateMediaAlt, uploadMedia } from "../../_actions/media";

export const metadata = { title: "رسانه‌ها" };

export default async function MediaAdmin() {
  const items = await db
    .select({ id: schema.media.id, filename: schema.media.filename, alt: schema.media.alt, size: schema.media.size, mime: schema.media.mime })
    .from(schema.media)
    .orderBy(desc(schema.media.createdAt));

  return (
    <>
      <PageTitle title="رسانه‌ها" lead="تصاویر مقالات و تصاویر اشتراک‌گذاری. فرمت‌های مجاز: JPG، PNG، WebP، GIF، AVIF تا ۵ مگابایت. برای سرعت بهتر، عرض تصویر را حداکثر ۱۶۰۰ پیکسل و فرمت را WebP انتخاب کنید." />
      <Card title="بارگذاری تصویر" className="mb-6">
        <AdminForm action={uploadMedia} className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end" resetOnSuccess>
          <Field label="فایل‌ها (حداکثر ۱۰ فایل)" htmlFor="files">
            <input id="files" name="files" type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className={inputCls + " py-2"} />
          </Field>
          <Field label="متن جایگزین (alt)" htmlFor="alt" hint="توصیف کوتاه محتوای تصویر؛ برای گوگل و کاربران کم‌بینا.">
            <input id="alt" name="alt" className={inputCls} />
          </Field>
          <SubmitButton pendingText="در حال بارگذاری…">بارگذاری</SubmitButton>
        </AdminForm>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((m) => (
          <Card key={m.id} className="p-3 md:p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/media/${m.id}`} alt={m.alt} loading="lazy" className="aspect-[16/10] w-full rounded-[8px] border border-line bg-bg object-contain" />
            <p className="mt-2 truncate text-[12px] text-ink3" dir="ltr">{m.filename} · {Math.round(m.size / 1024)} KB</p>
            <AdminForm action={updateMediaAlt} className="mt-2 flex gap-2">
              <input type="hidden" name="id" value={m.id} />
              <input name="alt" defaultValue={m.alt} placeholder="متن جایگزین" aria-label="متن جایگزین" className={inputCls + " py-1.5 text-[13px]"} />
              <SubmitButton variant="secondary" pendingText="…">ذخیره</SubmitButton>
            </AdminForm>
            <div className="mt-2 flex items-center justify-between">
              <CopyButton text={`/media/${m.id}`} />
              <AdminForm action={deleteMedia}>
                <input type="hidden" name="id" value={m.id} />
                <ConfirmSubmit />
              </AdminForm>
            </div>
          </Card>
        ))}
        {items.length === 0 && <p className="text-[13.5px] text-ink2">هنوز تصویری بارگذاری نشده است.</p>}
      </div>
    </>
  );
}
