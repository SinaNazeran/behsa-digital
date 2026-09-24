"use client";

import { useState } from "react";
import type { ReportImage, ReportSection } from "@/db/schema";
import { REPORT_AUDIENCES, REPORT_MENU_LIMIT, REPORT_SECTION_TEMPLATE } from "@/content/reports";
import { faNum } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AdminForm, Card, ConfirmSubmit, CountedInput, Field, SubmitButton, Toggle, btnCls, inputCls, type FormAction } from "./ui";
import { MediaPicker, type MediaOption } from "./MediaPicker";
import { IconPicker } from "./IconPicker";

export type ReportFormValues = {
  id?: number;
  title: string;
  menuTitle: string;
  slug: string;
  question: string;
  lead: string;
  categoryId: number | null;
  audiences: string[];
  icon: string;
  sections: ReportSection[];
  gallery: ReportImage[];
  relatedReportIds: number[];
  relatedPages: string[];
  keywords: string[];
  status: "draft" | "published";
  sortOrder: number;
  seoTitle: string;
  seoDescription: string;
  ogMediaId: string | null;
  noindex: boolean;
};

type EditorSection = { key: number; title: string; body: string; items: string };
type EditorImage = { key: number; mediaId: string; caption: string };

const toEditor = (sections: ReportSection[]): EditorSection[] =>
  (sections.length ? sections : REPORT_SECTION_TEMPLATE.map((title): ReportSection => ({ title })))
    .map((s, i) => ({ key: i, title: s.title, body: (s.body ?? []).join("\n\n"), items: (s.items ?? []).join("\n") }));

const toSections = (sections: EditorSection[]): ReportSection[] =>
  sections.map((s) => ({
    title: s.title.trim(),
    body: s.body.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean),
    items: s.items.split("\n").map((x) => x.trim()).filter(Boolean),
  }));

const slugify = (v: string) =>
  v.toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 80);

function CheckList({ name, options, defaultValues }: {
  name: string; options: { value: string; label: string }[]; defaultValues: string[];
}) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2.5">
      {options.map((o) => (
        <label key={o.value} className="inline-flex cursor-pointer items-center gap-2 text-[13.5px] text-ink">
          <input type="checkbox" name={name} value={o.value} defaultChecked={defaultValues.includes(o.value)} className="h-4 w-4 accent-primary" />
          {o.label}
        </label>
      ))}
    </div>
  );
}

export function ReportEditor({
  initial, categories, media, otherReports, pages, saveAction, deleteAction, siteUrl,
}: {
  initial: ReportFormValues;
  categories: { id: number; name: string }[];
  media: MediaOption[];
  otherReports: { id: number; label: string; category: string }[];
  /** solution / capability / industry pages a report may link to */
  pages: { slug: string; title: string; group: string }[];
  saveAction: FormAction;
  deleteAction?: FormAction;
  siteUrl: string;
}) {
  const [sections, setSections] = useState<EditorSection[]>(() => toEditor(initial.sections));
  const [images, setImages] = useState<EditorImage[]>(() => initial.gallery.map((g, i) => ({ key: i, ...g })));
  const [nextKey, setNextKey] = useState(1000);
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [question, setQuestion] = useState(initial.question);
  const [seoTitle, setSeoTitle] = useState(initial.seoTitle);
  const [seoDesc, setSeoDesc] = useState(initial.seoDescription);

  const newKey = () => { setNextKey((k) => k + 1); return nextKey; };
  const update = (key: number, patch: Partial<EditorSection>) =>
    setSections((ss) => ss.map((s) => (s.key === key ? { ...s, ...patch } : s)));
  const move = (i: number, dir: -1 | 1) =>
    setSections((ss) => {
      const j = i + dir;
      if (j < 0 || j >= ss.length) return ss;
      const copy = [...ss];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  const pageGroups = [...new Set(pages.map((p) => p.group))];
  const serpTitle = seoTitle || title || "نام گزارش";
  const serpDesc = seoDesc || question || "سؤالی که گزارش پاسخ می‌دهد اینجا نمایش داده می‌شود.";

  return (
    <div className="space-y-6">
      <AdminForm action={saveAction} className="grid gap-6 xl:grid-cols-[1fr_340px]">
        {initial.id && <input type="hidden" name="id" value={initial.id} />}
        <input type="hidden" name="sections" value={JSON.stringify(toSections(sections))} />

        {/* ── main column ── */}
        <div className="min-w-0 space-y-6">
          <Card>
            <div className="space-y-4">
              <Field label="نام کامل گزارش" htmlFor="title" hint="همان نامی که مشتری داخل سامانه می‌بیند. تیتر صفحهٔ گزارش است.">
                <input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} className={cn(inputCls, "text-[16px] font-bold")} required />
              </Field>
              <Field label="نام کوتاه (منو و کارت‌ها)" htmlFor="menuTitle" hint="اگر خالی بماند، نام کامل استفاده می‌شود. کوتاه نگه دارید تا در منو دو خطی نشود.">
                <CountedInput id="menuTitle" name="menuTitle" defaultValue={initial.menuTitle} max={40} />
              </Field>
              <Field
                label="نامک (آدرس صفحه)"
                htmlFor="slug"
                hint={<>فقط حروف کوچک انگلیسی، عدد و خط تیره. آدرس: <span dir="ltr" className="font-mono">{siteUrl}/reports/{slug || "…"}</span>. اگر پس از انتشار تغییر کند، آدرس قبلی خودکار به آدرس جدید هدایت می‌شود.</>}
              >
                <div className="flex gap-2">
                  <input id="slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase())} dir="ltr" className={cn(inputCls, "font-mono")} placeholder="peak-demand" required />
                  <button type="button" className={btnCls("secondary")} onClick={() => setSlug(slugify(slug))}>مرتب‌سازی</button>
                </div>
              </Field>
              <Field label="سؤالی که گزارش پاسخ می‌دهد" htmlFor="question" hint="زیر تیتر صفحه، روی کارت گزارش و در نتایج گوگل نمایش داده می‌شود.">
                <CountedInput id="question" name="question" defaultValue={initial.question} max={90} onValue={setQuestion} placeholder="پیک مصرف دقیقاً چه زمانی رخ داده است؟" />
              </Field>
              <Field label="متن معرفی" htmlFor="lead" hint="پاراگراف اول صفحه، بالای بخش‌های متنی.">
                <CountedInput id="lead" name="lead" defaultValue={initial.lead} max={300} multiline />
              </Field>
            </div>
          </Card>

          <Card
            title="بخش‌های متنی"
            actions={<button type="button" onClick={() => setSections((ss) => [...ss, { key: newKey(), title: "", body: "", items: "" }])} className={btnCls("secondary")}>+ افزودن بخش</button>}
          >
            <p className="-mt-2 mb-4 text-[12.5px] leading-6 text-ink3">
              هر بخش یک تیتر، پاراگراف (با یک خط خالی از هم جدا کنید) و فهرست (هر مورد در یک خط) دارد. پاراگراف یا فهرست می‌تواند خالی بماند.
            </p>
            <ol className="space-y-4">
              {sections.map((s, i) => (
                <li key={s.key} className="rounded-[10px] border border-line bg-bg/60 p-4">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="text-[12px] font-bold text-ink3">بخش {(i + 1).toLocaleString("fa-IR")}</span>
                    <span className="mr-auto flex gap-1">
                      <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className={btnCls("ghost")} aria-label="انتقال به بالا">↑</button>
                      <button type="button" onClick={() => move(i, 1)} disabled={i === sections.length - 1} className={btnCls("ghost")} aria-label="انتقال به پایین">↓</button>
                      <button type="button" onClick={() => setSections((ss) => ss.filter((x) => x.key !== s.key))} className={btnCls("ghost") + " text-err"}>حذف بخش</button>
                    </span>
                  </div>
                  <input
                    value={s.title}
                    onChange={(e) => update(s.key, { title: e.target.value })}
                    placeholder="تیتر بخش"
                    aria-label={`تیتر بخش ${i + 1}`}
                    className={cn(inputCls, "font-bold")}
                  />
                  <textarea
                    value={s.body}
                    onChange={(e) => update(s.key, { body: e.target.value })}
                    rows={Math.min(12, Math.max(3, s.body.split("\n").length + 1))}
                    placeholder="پاراگراف‌ها (اختیاری)…"
                    aria-label={`پاراگراف‌های بخش ${i + 1}`}
                    className={cn(inputCls, "mt-2 leading-8")}
                  />
                  <textarea
                    value={s.items}
                    onChange={(e) => update(s.key, { items: e.target.value })}
                    rows={Math.min(12, Math.max(3, s.items.split("\n").length + 1))}
                    placeholder="فهرست — هر مورد در یک خط (اختیاری)"
                    aria-label={`فهرست بخش ${i + 1}`}
                    className={cn(inputCls, "mt-2 leading-8")}
                  />
                </li>
              ))}
            </ol>
          </Card>

          <Card
            title="تصاویر خروجی گزارش"
            actions={<button type="button" onClick={() => setImages((xs) => [...xs, { key: newKey(), mediaId: "", caption: "" }])} className={btnCls("secondary")}>+ افزودن تصویر</button>}
          >
            <p className="-mt-2 mb-4 text-[12.5px] leading-6 text-ink3">
              تصویر گزارش از داخل سامانه، با دادهٔ نمونه یا ناشناس‌شده. اختیاری است؛ تا تصویری اضافه نشود، این بخش روی صفحه نمایش داده نمی‌شود.
            </p>
            {images.length === 0 ? (
              <p className="rounded-[10px] border border-dashed border-line p-4 text-center text-[13px] text-ink3">هنوز تصویری اضافه نشده است.</p>
            ) : (
              <ol className="space-y-4">
                {images.map((img, i) => (
                  <li key={img.key} className="space-y-3 rounded-[10px] border border-line bg-bg/60 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-bold text-ink3">تصویر {(i + 1).toLocaleString("fa-IR")}</span>
                      <button type="button" onClick={() => setImages((xs) => xs.filter((x) => x.key !== img.key))} className={btnCls("ghost") + " text-err"}>حذف</button>
                    </div>
                    <MediaPicker name="galleryMedia" defaultValue={img.mediaId} options={media} />
                    <input name="galleryCaption" defaultValue={img.caption} placeholder="توضیح زیر تصویر (اختیاری)" aria-label={`توضیح تصویر ${i + 1}`} className={inputCls} />
                  </li>
                ))}
              </ol>
            )}
          </Card>

          <Card title="پیوندهای مرتبط">
            <div className="space-y-5">
              <Field label="گزارش‌های مرتبط" hint="اگر هیچ‌کدام انتخاب نشود، گزارش‌های هم‌دسته نمایش داده می‌شوند.">
                {otherReports.length === 0 ? (
                  <p className="text-[13px] text-ink3">گزارش دیگری وجود ندارد.</p>
                ) : (
                  <CheckList
                    name="relatedReportIds"
                    defaultValues={initial.relatedReportIds.map(String)}
                    options={otherReports.map((r) => ({ value: String(r.id), label: r.label }))}
                  />
                )}
              </Field>
              {pageGroups.map((g) => (
                <Field key={g} label={g}>
                  <CheckList
                    name="relatedPages"
                    defaultValues={initial.relatedPages}
                    options={pages.filter((p) => p.group === g).map((p) => ({ value: p.slug, label: p.title }))}
                  />
                </Field>
              ))}
            </div>
          </Card>

          <Card title="سئو و اشتراک‌گذاری">
            <div className="mb-5 rounded-[10px] border border-line bg-surface p-4" aria-label="پیش‌نمایش نتیجه گوگل">
              <p className="mb-2 text-[11.5px] font-bold text-ink3">پیش‌نمایش در نتایج گوگل</p>
              <p className="truncate text-[12.5px] text-[#4d5156]" dir="ltr">{siteUrl.replace(/^https?:\/\//, "")} › reports › {slug || "…"}</p>
              <p className="mt-1 truncate text-[18px] leading-7 text-[#1a0dab]">{serpTitle} | بهسا دیجیتال</p>
              <p className="mt-1 line-clamp-2 text-[13.5px] leading-6 text-[#4d5156]">{serpDesc}</p>
            </div>
            <div className="space-y-4">
              <Field label="عنوان سئو" htmlFor="seoTitle" hint="اگر خالی بماند، نام کامل گزارش استفاده می‌شود. حدود ۶۰ نویسه.">
                <CountedInput id="seoTitle" name="seoTitle" defaultValue={initial.seoTitle} max={60} onValue={setSeoTitle} />
              </Field>
              <Field label="توضیحات متا" htmlFor="seoDescription" hint="اگر خالی بماند، سؤال گزارش استفاده می‌شود. حدود ۱۲۰ تا ۱۶۰ نویسه.">
                <CountedInput id="seoDescription" name="seoDescription" defaultValue={initial.seoDescription} max={160} multiline onValue={setSeoDesc} />
              </Field>
              <Field label="تصویر اشتراک‌گذاری (Open Graph)" hint="اگر انتخاب نشود، اولین تصویر خروجی گزارش یا تصویر پیش‌فرض سایت استفاده می‌شود.">
                <MediaPicker name="ogMediaId" defaultValue={initial.ogMediaId} options={media} />
              </Field>
              <Toggle name="noindex" defaultChecked={initial.noindex} label="عدم نمایش در گوگل (noindex)" />
            </div>
          </Card>
        </div>

        {/* ── sidebar ── */}
        <div className="space-y-6 xl:sticky xl:top-20 xl:self-start">
          <Card title="انتشار">
            <div className="space-y-4">
              <Field label="وضعیت" htmlFor="status" hint="برای انتشار، سؤال، متن معرفی، مخاطب و حداقل یک بخش با محتوا لازم است.">
                <select id="status" name="status" defaultValue={initial.status} className={inputCls}>
                  <option value="draft">پیش‌نویس (روی سایت دیده نمی‌شود)</option>
                  <option value="published">منتشرشده</option>
                </select>
              </Field>
              <div className="flex flex-wrap gap-2 border-t border-linesoft pt-4">
                <SubmitButton className="flex-1">ذخیره</SubmitButton>
                {initial.id && (
                  <a href={`/api/preview?type=report&slug=${encodeURIComponent(initial.slug)}`} target="_blank" rel="noopener" className={btnCls("secondary")}>
                    پیش‌نمایش
                  </a>
                )}
              </div>
            </div>
          </Card>

          <Card title="دسته و مخاطب">
            <div className="space-y-4">
              <Field label="دسته" htmlFor="categoryId" hint={<>دسته‌ها را در <a href="/admin/report-categories" className="font-bold text-orange-700">دسته‌بندی گزارش‌ها</a> مدیریت کنید.</>}>
                <select id="categoryId" name="categoryId" defaultValue={initial.categoryId ?? ""} className={inputCls} required>
                  <option value="" disabled>انتخاب دسته…</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="ترتیب داخل دسته" htmlFor="sortOrder" hint={`عدد کوچک‌تر بالاتر نمایش داده می‌شود. ${faNum(REPORT_MENU_LIMIT)} گزارش منتشرشدهٔ اول هر دسته در منوی بالای سایت هم دیده می‌شوند.`}>
                <input id="sortOrder" name="sortOrder" type="number" defaultValue={initial.sortOrder} dir="ltr" className={inputCls} />
              </Field>
              <Field label="برای چه کسی است؟">
                <CheckList name="audiences" defaultValues={initial.audiences} options={REPORT_AUDIENCES.map((a) => ({ value: a.key, label: a.label }))} />
              </Field>
            </div>
          </Card>

          <Card title="کلیدواژه‌های جستجو">
            <Field label="واژه‌های دیگری که کاربر ممکن است جستجو کند" htmlFor="keywords" hint="با ویرگول یا در خط جدا بنویسید، مثل «پیک، دیماند». نام، سؤال، متن معرفی و دسته خودشان جستجو می‌شوند و لازم نیست تکرار شوند.">
              <textarea id="keywords" name="keywords" defaultValue={initial.keywords.join("، ")} rows={3} className={inputCls} />
            </Field>
          </Card>

          <Card title="آیکون">
            <IconPicker name="icon" defaultValue={initial.icon} />
          </Card>
        </div>
      </AdminForm>

      {initial.id && deleteAction && (
        <Card title="حذف گزارش" className="border-err/20">
          <AdminForm action={deleteAction} className="flex flex-wrap items-center justify-between gap-3">
            <input type="hidden" name="id" value={initial.id} />
            <p className="text-[13px] text-ink2">حذف قابل بازگشت نیست. برای پنهان‌کردن موقت، وضعیت را «پیش‌نویس» کنید.</p>
            <ConfirmSubmit label="حذف این گزارش" />
          </AdminForm>
        </Card>
      )}
    </div>
  );
}
