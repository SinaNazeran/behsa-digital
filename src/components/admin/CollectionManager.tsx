import { AdminForm, Card, ConfirmSubmit, Field, MoveControls, SubmitButton, Toggle } from "@/components/admin/ui";
import { inputCls } from "@/components/admin/styles";
import { deleteItem, moveItem, saveItem } from "@/app/admin/_actions/collections";
import { MediaPicker, type MediaOption } from "./MediaPicker";
import { CatalogFileField } from "./CatalogFileField";

type Kind = "faqs" | "testimonials" | "clients" | "catalogs";
type Item = { id: number; isPublished: boolean } & Record<string, unknown>;

type FieldDef = {
  name: string;
  label: string;
  hint?: string;
  /** text (default) · multiline · lines = a string[] edited one per line ·
      number · image = MediaPicker · pdf = the catalogue file */
  type?: "multiline" | "lines" | "number" | "image" | "pdf";
};

const FIELDS: Record<Kind, FieldDef[]> = {
  faqs: [{ name: "question", label: "پرسش" }, { name: "answer", label: "پاسخ", type: "multiline" }],
  testimonials: [{ name: "quote", label: "متن نظر", type: "multiline" }, { name: "name", label: "سمت / نام گوینده" }, { name: "org", label: "سازمان" }],
  clients: [{ name: "name", label: "نام مشتری" }],
  catalogs: [
    { name: "title", label: "عنوان" },
    { name: "description", label: "توضیح کوتاه", type: "multiline", hint: "یکی دو جمله: این کاتالوگ برای چه کسی است و چه چیزی را معرفی می‌کند." },
    { name: "highlights", label: "در این کاتالوگ می‌خوانید", type: "lines", hint: "هر خط یک مورد؛ حداکثر ۱۲ خط." },
    { name: "edition", label: "ویرایش (اختیاری)", hint: "مثلاً «ویرایش ۱۴۰۵»." },
    { name: "pages", label: "تعداد صفحات (اختیاری)", type: "number" },
    { name: "fileId", label: "فایل کاتالوگ", type: "pdf", hint: "فقط PDF، تا ۲۰ مگابایت. برای کاربران موبایل، زیر ۱۰ مگابایت توصیه می‌شود. جایگزینی فایل آدرس صفحه را تغییر نمی‌دهد." },
    { name: "coverMediaId", label: "تصویر جلد", type: "image", hint: "تصویر عمودی صفحهٔ اول کاتالوگ (نسبت ۳ به ۴)." },
  ],
};

function Fields({ kind, item, media }: { kind: Kind; item?: Item; media: MediaOption[] }) {
  return (
    <>
      {FIELDS[kind].map((f) => (
        <Field key={f.name} label={f.label} hint={f.hint}>
          {f.type === "image" ? (
            <MediaPicker name={f.name} defaultValue={item?.[f.name] as string | null} options={media} />
          ) : f.type === "pdf" ? (
            <CatalogFileField name={f.name} defaultValue={item?.file as { id: string; filename: string; size: number } | null} />
          ) : f.type === "lines" ? (
            <textarea name={f.name} defaultValue={((item?.[f.name] as string[] | undefined) ?? []).join("\n")} rows={5} className={inputCls + " leading-7"} />
          ) : f.type === "number" ? (
            <input name={f.name} type="number" min={1} inputMode="numeric" defaultValue={String(item?.[f.name] ?? "")} className={inputCls + " fa-num"} />
          ) : f.type === "multiline" ? (
            <textarea name={f.name} defaultValue={String(item?.[f.name] ?? "")} rows={4} className={inputCls + " leading-7"} />
          ) : (
            <input name={f.name} defaultValue={String(item?.[f.name] ?? "")} className={inputCls} />
          )}
        </Field>
      ))}
    </>
  );
}

/** Ordered list editor shared by FAQ, testimonials, clients and catalogues. */
export function CollectionManager({ kind, items, addTitle, media = [] }: {
  kind: Kind; items: Item[]; addTitle: string;
  /** the image library, for kinds with an image field */
  media?: MediaOption[];
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <ol className="space-y-3">
        {items.map((item, i) => (
          <li key={item.id}>
            <Card>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-bg px-2.5 py-0.5 text-[12px] font-bold text-ink3">{(i + 1).toLocaleString("fa-IR")}</span>
                {!item.isPublished && <span className="rounded-full bg-warnbg px-2.5 py-0.5 text-[12px] font-bold text-warn">پنهان</span>}
                <MoveControls key={i} action={moveItem} fields={{ kind, id: item.id }} index={i} count={items.length} />
              </div>
              <AdminForm action={saveItem} className="space-y-3">
                <input type="hidden" name="kind" value={kind} />
                <input type="hidden" name="id" value={item.id} />
                <Fields kind={kind} item={item} media={media} />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Toggle name="isPublished" defaultChecked={item.isPublished} label="نمایش در سایت" />
                  <SubmitButton variant="secondary">ذخیره</SubmitButton>
                </div>
              </AdminForm>
              <AdminForm action={deleteItem} className="mt-1 flex justify-end">
                <input type="hidden" name="kind" value={kind} />
                <input type="hidden" name="id" value={item.id} />
                <ConfirmSubmit />
              </AdminForm>
            </Card>
          </li>
        ))}
        {items.length === 0 && <li className="rounded-[12px] border border-dashed border-line p-8 text-center text-ink2">موردی ثبت نشده است.</li>}
      </ol>
      <Card title={addTitle} className="xl:sticky xl:top-20 xl:self-start">
        <AdminForm action={saveItem} className="space-y-3" resetOnSuccess>
          <input type="hidden" name="kind" value={kind} />
          <Fields kind={kind} media={media} />
          <Toggle name="isPublished" defaultChecked label="نمایش در سایت" />
          <div><SubmitButton>افزودن</SubmitButton></div>
        </AdminForm>
      </Card>
    </div>
  );
}
