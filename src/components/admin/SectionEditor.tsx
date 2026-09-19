import { AdminForm, Card, ConfirmSubmit, Field, SubmitButton, Toggle } from "@/components/admin/ui";
import { btnCls, inputCls } from "@/components/admin/styles";
import { IconPicker } from "@/components/admin/IconPicker";
import { MediaPicker, type MediaOption } from "@/components/admin/MediaPicker";
import { deleteSectionItem, moveSectionItem, resetSection, saveSection, saveSectionItem } from "@/app/admin/_actions/content";
import type { ItemField, SectionDef } from "@/content/sections";
import type { contentItems, contentSections } from "@/db/schema";

type SectionRow = typeof contentSections.$inferSelect;
type ItemRow = typeof contentItems.$inferSelect;

/* One editor drives every section declared in the registry: the
   heading fields the section owns, plus its ordered item list. */

function ItemFields({ def, item, media }: { def: SectionDef; item?: ItemRow; media: MediaOption[] }) {
  const fields: ItemField[] = def.items?.fields ?? [];
  return (
    <>
      <Field label={def.items?.titleLabel ?? "عنوان"}>
        <input name="title" defaultValue={item?.title ?? ""} className={inputCls} required />
      </Field>
      {fields.map((f) => {
        if (f.name === "icon") return <Field key={f.name} label={f.label} hint={f.hint}><IconPicker name="icon" defaultValue={item?.icon ?? ""} /></Field>;
        if (f.name === "image") return <Field key={f.name} label={f.label} hint={f.hint}><MediaPicker name="mediaId" defaultValue={item?.mediaId} options={media} /></Field>;
        if (f.name === "description") return (
          <Field key={f.name} label={f.label} hint={f.hint}>
            <textarea name="description" defaultValue={item?.description ?? ""} rows={3} className={inputCls + " leading-7"} />
          </Field>
        );
        if (f.name === "bullets") return (
          <Field key={f.name} label={f.label} hint={f.hint}>
            <textarea name="bullets" defaultValue={(item?.bullets ?? []).join("\n")} rows={4} className={inputCls + " leading-7"} />
          </Field>
        );
        return (
          <Field key={f.name} label={f.label} hint={f.hint}>
            <input
              name={f.name}
              defaultValue={String(item?.[f.name as "tag" | "href"] ?? "")}
              dir={f.name === "href" ? "ltr" : undefined}
              className={inputCls}
            />
          </Field>
        );
      })}
    </>
  );
}

export function SectionEditor({ def, section, items, media }: {
  def: SectionDef;
  section: SectionRow | null;
  items: ItemRow[];
  media: MediaOption[];
}) {
  const h = def.header;
  return (
    <div className="space-y-6">
      <AdminForm action={saveSection} className="space-y-6">
        <input type="hidden" name="key" value={def.key} />
        <Card
          title="متن‌های این بخش"
          actions={<Toggle name="isActive" defaultChecked={section?.isActive ?? true} label="نمایش در سایت" />}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {h.eyebrow && (
              <Field label={h.eyebrow} hint="عبارت کوتاه بالای عنوان">
                <input name="eyebrow" defaultValue={section?.eyebrow ?? ""} className={inputCls} />
              </Field>
            )}
            {h.title && (
              <Field
                label={h.title}
                className={h.eyebrow ? undefined : "md:col-span-2"}
                hint="برای برجسته‌کردن یک کلمه، آن را بین دو ستاره بگذارید: *داده*"
              >
                <textarea name="title" defaultValue={section?.title ?? ""} rows={2} className={inputCls + " leading-8"} />
              </Field>
            )}
            {h.description && (
              <Field label={h.description} className="md:col-span-2">
                <textarea name="description" defaultValue={section?.description ?? ""} rows={3} className={inputCls + " leading-7"} />
              </Field>
            )}
            {h.cta && (
              <>
                <Field label="متن دکمهٔ بخش" hint="خالی بگذارید تا دکمه نمایش داده نشود.">
                  <input name="ctaLabel" defaultValue={section?.ctaLabel ?? ""} className={inputCls} />
                </Field>
                <Field label="آدرس دکمهٔ بخش">
                  <input name="ctaHref" defaultValue={section?.ctaHref ?? ""} dir="ltr" className={inputCls} />
                </Field>
              </>
            )}
          </div>
        </Card>

        {(h.media || h.video) && (
          <Card title="تصویر و ویدئو">
            <div className="grid gap-5 md:grid-cols-2">
              {h.media && (
                <>
                  <Field label="تصویر پس‌زمینه (دسکتاپ)" hint="وقتی ویدئو پخش نشود همین تصویر دیده می‌شود.">
                    <MediaPicker name="mediaId" defaultValue={section?.mediaId} options={media} />
                  </Field>
                  <Field label="تصویر موبایل" hint="اگر خالی بماند، همان تصویر دسکتاپ استفاده می‌شود.">
                    <MediaPicker name="mobileMediaId" defaultValue={section?.mobileMediaId} options={media} />
                  </Field>
                </>
              )}
              {h.video && (
                <>
                  <Field label="آدرس ویدئو" hint="فایل mp4 در پوشهٔ public (مثل /videos/hero.mp4) یا یک آدرس کامل https://">
                    <input name="videoUrl" defaultValue={section?.videoUrl ?? ""} dir="ltr" className={inputCls} />
                  </Field>
                  <div className="flex items-end">
                    <Toggle name="videoEnabled" defaultChecked={section?.videoEnabled ?? false} label="پخش ویدئو (فقط دسکتاپ)" />
                  </div>
                </>
              )}
            </div>
          </Card>
        )}

        <SubmitButton>ذخیره متن‌ها</SubmitButton>
      </AdminForm>

      {def.items && (
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <div>
            <h2 className="mb-3 font-display text-[16px] font-extrabold text-ink">{def.items.label}</h2>
            <ol className="space-y-3">
              {items.map((item, i) => (
                <li key={item.id}>
                  <Card>
                    <div className="mb-3 flex items-center gap-2">
                      <span className="rounded-full bg-bg px-2.5 py-0.5 text-[12px] font-bold text-ink3">{(i + 1).toLocaleString("fa-IR")}</span>
                      {!item.isActive && <span className="rounded-full bg-warnbg px-2.5 py-0.5 text-[12px] font-bold text-warn">پنهان</span>}
                      <span className="mr-auto flex gap-1">
                        {(["up", "down"] as const).map((dir) => (
                          <AdminForm key={dir} action={moveSectionItem}>
                            <input type="hidden" name="key" value={def.key} />
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
                    <AdminForm action={saveSectionItem} className="space-y-3">
                      <input type="hidden" name="key" value={def.key} />
                      <input type="hidden" name="id" value={item.id} />
                      <ItemFields def={def} item={item} media={media} />
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <Toggle name="isActive" defaultChecked={item.isActive} label="نمایش در سایت" />
                        <SubmitButton variant="secondary">ذخیره</SubmitButton>
                      </div>
                    </AdminForm>
                    <AdminForm action={deleteSectionItem} className="mt-1 flex justify-end">
                      <input type="hidden" name="id" value={item.id} />
                      <ConfirmSubmit />
                    </AdminForm>
                  </Card>
                </li>
              ))}
              {items.length === 0 && (
                <li className="rounded-[12px] border border-dashed border-line p-8 text-center text-[13.5px] leading-7 text-ink2">
                  هنوز موردی ثبت نشده است.
                  {def.items.emptyHint && <span className="mt-1 block text-ink3">{def.items.emptyHint}</span>}
                </li>
              )}
            </ol>
          </div>

          <div className="space-y-4 xl:sticky xl:top-20 xl:self-start">
            <Card title={def.items.addLabel}>
              <AdminForm action={saveSectionItem} className="space-y-3" resetOnSuccess>
                <input type="hidden" name="key" value={def.key} />
                <ItemFields def={def} media={media} />
                <Toggle name="isActive" defaultChecked label="نمایش در سایت" />
                <div><SubmitButton>افزودن</SubmitButton></div>
              </AdminForm>
            </Card>
            <Card title="بازگشت به محتوای پیش‌فرض">
              <p className="mb-3 text-[13px] leading-7 text-ink2">
                همهٔ تغییرات این بخش حذف و متن‌ها و موارد اولیهٔ سایت جایگزین می‌شوند.
              </p>
              <AdminForm action={resetSection}>
                <input type="hidden" name="key" value={def.key} />
                <ConfirmSubmit label="بازگردانی پیش‌فرض" confirmLabel="بله، بازگردان" />
              </AdminForm>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
