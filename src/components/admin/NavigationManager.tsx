import { AdminForm, Card, ConfirmSubmit, Field, SubmitButton, Toggle } from "@/components/admin/ui";
import { btnCls, inputCls } from "@/components/admin/styles";
import { IconPicker } from "@/components/admin/IconPicker";
import { deleteNavItem, moveNavItem, saveNavItem, seedDefaultNav } from "@/app/admin/_actions/navigation";
import type { navItems as navItemsTable } from "@/db/schema";
import { REPORT_MENU_LIMIT } from "@/content/reports";
import { faNum } from "@/lib/format";

type NavRow = typeof navItemsTable.$inferSelect;

/* Menu editor — two levels: منوی اصلی (سرفصل) و زیرمنوها.
   Everything an editor can change here is content: label, address,
   order, visibility and whether the link opens in a new tab. */

const LENS_LABELS: { value: string; label: string }[] = [
  { value: "feature", label: "قابلیت محصول" },
  { value: "outcome", label: "راهکار کسب‌وکار" },
  { value: "vertical", label: "صنعت" },
  { value: "content", label: "منابع و محتوا" },
  { value: "company", label: "درباره شرکت" },
];

function MoveButtons({ id, parentId, index, count }: { id: number; parentId: number | null; index: number; count: number }) {
  return (
    <span className="mr-auto flex gap-1">
      {(["up", "down"] as const).map((dir) => (
        <AdminForm key={dir} action={moveNavItem}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="parentId" value={parentId ?? 0} />
          <input type="hidden" name="dir" value={dir} />
          <button
            type="submit"
            disabled={(dir === "up" && index === 0) || (dir === "down" && index === count - 1)}
            className={btnCls("ghost")}
            aria-label={dir === "up" ? "انتقال به بالا" : "انتقال به پایین"}
          >
            {dir === "up" ? "↑" : "↓"}
          </button>
        </AdminForm>
      ))}
    </span>
  );
}

function LinkFields({ item, withIcon = true }: { item?: NavRow; withIcon?: boolean }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="عنوان در منو">
        <input name="label" defaultValue={item?.label ?? ""} className={inputCls} required />
      </Field>
      <Field label="آدرس" hint="صفحهٔ داخلی مثل /solutions یا لینک خارجی کامل مثل https://…">
        <input name="href" defaultValue={item?.href ?? ""} dir="ltr" className={inputCls} required />
      </Field>
      <Field label="توضیح کوتاه (اختیاری)" className="md:col-span-2" hint="زیر عنوان، داخل منوی بازشونده دیده می‌شود.">
        <input name="description" defaultValue={item?.description ?? ""} className={inputCls} />
      </Field>
      {withIcon && (
        <Field label="آیکون">
          <IconPicker name="icon" defaultValue={item?.icon ?? ""} />
        </Field>
      )}
    </div>
  );
}

export function NavigationManager({ rows }: { rows: NavRow[] }) {
  const sections = rows.filter((r) => r.parentId === null);
  const childrenOf = (id: number) => rows.filter((r) => r.parentId === id);

  if (rows.length === 0) {
    return (
      <Card title="منو هنوز در دیتابیس ثبت نشده است">
        <p className="mb-4 text-[13.5px] leading-7 text-ink2">
          در حال حاضر منوی پیش‌فرض سایت نمایش داده می‌شود. برای اینکه بتوانید آن را ویرایش کنید،
          یک‌بار آن را در دیتابیس ثبت کنید؛ سایت دقیقاً همان چیزی می‌ماند که الان هست.
        </p>
        <AdminForm action={seedDefaultNav}>
          <SubmitButton>ثبت منوی فعلی برای ویرایش</SubmitButton>
        </AdminForm>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {sections.map((section, si) => {
        /* a catalogue section keeps its stored children (switching back
           restores them) but never shows or edits them */
        const catalogue = section.kind === "reports";
        const items = catalogue ? [] : childrenOf(section.id);
        return (
          <Card key={section.id}>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <h2 className="font-display text-[16px] font-extrabold text-ink">{section.label}</h2>
              {!catalogue && (
                <span className="rounded-full bg-bg px-2.5 py-0.5 text-[12px] font-bold text-ink3 fa-num">
                  {items.length.toLocaleString("fa-IR")} زیرمنو
                </span>
              )}
              {!section.isActive && <span className="rounded-full bg-warnbg px-2.5 py-0.5 text-[12px] font-bold text-warn">پنهان</span>}
              <MoveButtons id={section.id} parentId={null} index={si} count={sections.length} />
            </div>

            <AdminForm action={saveNavItem} className="space-y-4">
              <input type="hidden" name="id" value={section.id} />
              <input type="hidden" name="parentId" value={0} />
              <LinkFields item={section} withIcon={false} />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="نوع منوی بازشونده" hint="«بزرگ» برای فهرست‌های طولانی با ستون معرفی، «ساده» برای فهرست کوتاه، «گزارش‌ها» برای منویی که خودکار از دسته‌ها و گزارش‌های منتشرشده ساخته می‌شود.">
                  <select name="kind" defaultValue={section.kind} className={inputCls}>
                    <option value="mega">بزرگ</option>
                    <option value="dropdown">ساده</option>
                    <option value="reports">گزارش‌ها (خودکار از فهرست گزارش‌ها)</option>
                  </select>
                </Field>
                <Field label="نوع صفحات این سرفصل" hint="لحن صفحات داخلی این سرفصل را تعیین می‌کند.">
                  <select name="lens" defaultValue={section.lens} className={inputCls}>
                    {LENS_LABELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                </Field>
              </div>
              <details className="rounded-[10px] border border-line bg-bg p-4">
                <summary className="cursor-pointer text-[13.5px] font-bold text-ink">ستون معرفی منو (اختیاری)</summary>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Field label="عنوان معرفی">
                    <input name="introTitle" defaultValue={section.introTitle} className={inputCls} />
                  </Field>
                  <Field label="متن معرفی">
                    <input name="introDescription" defaultValue={section.introDescription} className={inputCls} />
                  </Field>
                  <Field label="متن دکمهٔ معرفی">
                    <input name="introCtaLabel" defaultValue={section.introCtaLabel} className={inputCls} />
                  </Field>
                  <Field label="آدرس دکمهٔ معرفی">
                    <input name="introCtaHref" defaultValue={section.introCtaHref} dir="ltr" className={inputCls} />
                  </Field>
                </div>
              </details>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-5">
                  <Toggle name="isActive" defaultChecked={section.isActive} label="نمایش در سایت" />
                  <Toggle name="openInNewTab" defaultChecked={section.openInNewTab} label="باز شدن در تب جدید" />
                </div>
                <SubmitButton variant="secondary">ذخیرهٔ سرفصل</SubmitButton>
              </div>
            </AdminForm>

            <AdminForm action={deleteNavItem} className="mt-1 flex justify-end">
              <input type="hidden" name="id" value={section.id} />
              <ConfirmSubmit label="حذف سرفصل" confirmLabel="بله، سرفصل و زیرمنوهایش حذف شود" />
            </AdminForm>

            {catalogue ? (
              <div className="mt-5 rounded-[10px] border border-line bg-bg p-4 text-[13.5px] leading-7 text-ink2">
                زیرمنوهای این سرفصل خودکار ساخته می‌شوند: هر دسته یک ستون، و در هر ستون {faNum(REPORT_MENU_LIMIT)} گزارش منتشرشدهٔ اول آن دسته.
                نام و ترتیب دسته‌ها را در <a href="/admin/report-categories" className="font-bold text-orange-700">دسته‌بندی گزارش‌ها</a> و
                گزارش‌ها و ترتیبشان را در <a href="/admin/reports" className="font-bold text-orange-700">گزارش‌ها</a> تغییر دهید.
              </div>
            ) : (
            <>
            <ol className="mt-5 space-y-3 border-t border-linesoft pt-5">
              {items.map((item, i) => (
                <li key={item.id} className="rounded-[10px] border border-line bg-bg p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full bg-surface px-2.5 py-0.5 text-[12px] font-bold text-ink3">{(i + 1).toLocaleString("fa-IR")}</span>
                    {!item.isActive && <span className="rounded-full bg-warnbg px-2.5 py-0.5 text-[12px] font-bold text-warn">پنهان</span>}
                    <MoveButtons id={item.id} parentId={section.id} index={i} count={items.length} />
                  </div>
                  <AdminForm action={saveNavItem} className="space-y-4">
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="parentId" value={section.id} />
                    <LinkFields item={item} />
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-5">
                        <Toggle name="isActive" defaultChecked={item.isActive} label="نمایش در سایت" />
                        <Toggle name="openInNewTab" defaultChecked={item.openInNewTab} label="تب جدید" />
                      </div>
                      <SubmitButton variant="secondary">ذخیره</SubmitButton>
                    </div>
                  </AdminForm>
                  <AdminForm action={deleteNavItem} className="mt-1 flex justify-end">
                    <input type="hidden" name="id" value={item.id} />
                    <ConfirmSubmit />
                  </AdminForm>
                </li>
              ))}
              {items.length === 0 && (
                <li className="rounded-[10px] border border-dashed border-line p-6 text-center text-[13.5px] text-ink2">
                  این سرفصل زیرمنو ندارد؛ در منو به‌صورت یک لینک ساده نمایش داده می‌شود.
                </li>
              )}
            </ol>

            <details className="mt-4 rounded-[10px] border border-line bg-bg p-4">
              <summary className="cursor-pointer text-[13.5px] font-bold text-ink">+ افزودن زیرمنو به «{section.label}»</summary>
              <AdminForm action={saveNavItem} className="mt-4 space-y-4" resetOnSuccess>
                <input type="hidden" name="parentId" value={section.id} />
                <LinkFields />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-5">
                    <Toggle name="isActive" defaultChecked label="نمایش در سایت" />
                    <Toggle name="openInNewTab" label="تب جدید" />
                  </div>
                  <SubmitButton>افزودن زیرمنو</SubmitButton>
                </div>
              </AdminForm>
            </details>
            </>
            )}
          </Card>
        );
      })}

      <Card title="سرفصل جدید در منوی اصلی">
        <AdminForm action={saveNavItem} className="space-y-4" resetOnSuccess>
          <input type="hidden" name="parentId" value={0} />
          <LinkFields withIcon={false} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="نوع منوی بازشونده">
              <select name="kind" defaultValue="dropdown" className={inputCls}>
                <option value="mega">بزرگ</option>
                <option value="dropdown">ساده</option>
              </select>
            </Field>
            <Field label="نوع صفحات این سرفصل">
              <select name="lens" defaultValue="content" className={inputCls}>
                {LENS_LABELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </Field>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-5">
              <Toggle name="isActive" defaultChecked label="نمایش در سایت" />
              <Toggle name="openInNewTab" label="باز شدن در تب جدید" />
            </div>
            <SubmitButton>افزودن سرفصل</SubmitButton>
          </div>
        </AdminForm>
      </Card>
    </div>
  );
}
