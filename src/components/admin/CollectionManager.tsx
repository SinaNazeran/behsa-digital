import { AdminForm, Card, ConfirmSubmit, Field, SubmitButton, Toggle } from "@/components/admin/ui";
import { btnCls, inputCls } from "@/components/admin/styles";
import { deleteItem, moveItem, saveItem } from "@/app/admin/_actions/collections";

type Kind = "faqs" | "testimonials" | "clients";
type Item = { id: number; isPublished: boolean } & Record<string, unknown>;

const FIELDS: Record<Kind, { name: string; label: string; multiline?: boolean }[]> = {
  faqs: [{ name: "question", label: "پرسش" }, { name: "answer", label: "پاسخ", multiline: true }],
  testimonials: [{ name: "quote", label: "متن نظر", multiline: true }, { name: "name", label: "سمت / نام گوینده" }, { name: "org", label: "سازمان" }],
  clients: [{ name: "name", label: "نام مشتری" }],
};

function Fields({ kind, item }: { kind: Kind; item?: Item }) {
  return (
    <>
      {FIELDS[kind].map((f) => (
        <Field key={f.name} label={f.label}>
          {f.multiline ? (
            <textarea name={f.name} defaultValue={String(item?.[f.name] ?? "")} rows={4} className={inputCls + " leading-7"} />
          ) : (
            <input name={f.name} defaultValue={String(item?.[f.name] ?? "")} className={inputCls} />
          )}
        </Field>
      ))}
    </>
  );
}

/** Ordered list editor shared by FAQ, testimonials and clients. */
export function CollectionManager({ kind, items, addTitle }: { kind: Kind; items: Item[]; addTitle: string }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <ol className="space-y-3">
        {items.map((item, i) => (
          <li key={item.id}>
            <Card>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-bg px-2.5 py-0.5 text-[12px] font-bold text-ink3">{(i + 1).toLocaleString("fa-IR")}</span>
                {!item.isPublished && <span className="rounded-full bg-warnbg px-2.5 py-0.5 text-[12px] font-bold text-warn">پنهان</span>}
                <span className="mr-auto flex gap-1">
                  {(["up", "down"] as const).map((dir) => (
                    <AdminForm key={dir} action={moveItem}>
                      <input type="hidden" name="kind" value={kind} />
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="dir" value={dir} />
                      <button
                        type="submit"
                        disabled={(dir === "up" && i === 0) || (dir === "down" && i === items.length - 1)}
                        className={btnCls("ghost")}
                        aria-label={dir === "up" ? "انتقال به بالا" : "انتقال به پایین"}
                      >
                        {dir === "up" ? "↑" : "↓"}
                      </button>
                    </AdminForm>
                  ))}
                </span>
              </div>
              <AdminForm action={saveItem} className="space-y-3">
                <input type="hidden" name="kind" value={kind} />
                <input type="hidden" name="id" value={item.id} />
                <Fields kind={kind} item={item} />
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
          <Fields kind={kind} />
          <Toggle name="isPublished" defaultChecked label="نمایش در سایت" />
          <div><SubmitButton>افزودن</SubmitButton></div>
        </AdminForm>
      </Card>
    </div>
  );
}
