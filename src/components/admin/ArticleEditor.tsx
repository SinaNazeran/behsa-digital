"use client";

import { useState } from "react";
import type { ArticleSection } from "@/db/schema";
import { cn } from "@/lib/utils";
import { AdminForm, Card, ConfirmSubmit, CountedInput, Field, SubmitButton, Toggle, btnCls, inputCls, type FormAction } from "./ui";
import { MediaPicker, type MediaOption } from "./MediaPicker";

export type ArticleFormValues = {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  body: ArticleSection[];
  categoryId: number | null;
  authorName: string;
  chartStyle: "line" | "bars" | "donut" | "area";
  coverMediaId: string | null;
  status: "draft" | "published";
  featured: boolean;
  publishedDate: string;
  publishedTime: string;
  seoTitle: string;
  seoDescription: string;
  ogMediaId: string | null;
  canonicalUrl: string;
  noindex: boolean;
};

type EditorSection = { key: number; h: string; text: string };

const toEditor = (body: ArticleSection[]): EditorSection[] =>
  (body.length ? body : [{ p: [""] }]).map((s, i) => ({ key: i, h: s.h ?? "", text: s.p.join("\n\n") }));

const toBody = (sections: EditorSection[]): ArticleSection[] =>
  sections.map((s) => ({ h: s.h.trim() || undefined, p: s.text.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean) }));

/** Latin transliteration isn't reliable for Persian — suggest from English words only */
const slugify = (v: string) =>
  v.toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 80);

export function ArticleEditor({
  initial, categories, media, saveAction, deleteAction, siteUrl,
}: {
  initial: ArticleFormValues;
  categories: { id: number; name: string }[];
  media: MediaOption[];
  saveAction: FormAction;
  deleteAction?: FormAction;
  siteUrl: string;
}) {
  const [sections, setSections] = useState<EditorSection[]>(() => toEditor(initial.body));
  const [nextKey, setNextKey] = useState(1000);
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [seoTitle, setSeoTitle] = useState(initial.seoTitle);
  const [seoDesc, setSeoDesc] = useState(initial.seoDescription);
  const [excerpt, setExcerpt] = useState(initial.excerpt);

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
  const add = () => { setSections((ss) => [...ss, { key: nextKey, h: "", text: "" }]); setNextKey((k) => k + 1); };
  const remove = (key: number) => setSections((ss) => (ss.length > 1 ? ss.filter((s) => s.key !== key) : ss));

  const serpTitle = seoTitle || title || "عنوان مقاله";
  const serpDesc = seoDesc || excerpt || "توضیحات کوتاه مقاله اینجا نمایش داده می‌شود.";

  return (
    <div className="space-y-6">
      <AdminForm action={saveAction} className="grid gap-6 xl:grid-cols-[1fr_340px]">
        {initial.id && <input type="hidden" name="id" value={initial.id} />}
        <input type="hidden" name="body" value={JSON.stringify(toBody(sections))} />

        {/* ── main column ── */}
        <div className="min-w-0 space-y-6">
          <Card>
            <div className="space-y-4">
              <Field label="عنوان مقاله" htmlFor="title">
                <input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} className={cn(inputCls, "text-[16px] font-bold")} required />
              </Field>
              <Field
                label="نامک (آدرس صفحه)"
                htmlFor="slug"
                hint={<>فقط حروف کوچک انگلیسی، عدد و خط تیره. آدرس نهایی: <span dir="ltr" className="font-mono">{siteUrl}/articles/{slug || "…"}</span>. پس از انتشار تغییر ندهید؛ لینک‌های قبلی خراب می‌شوند.</>}
              >
                <div className="flex gap-2">
                  <input id="slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase())} dir="ltr" className={cn(inputCls, "font-mono")} placeholder="demand-penalty" required />
                  <button type="button" className={btnCls("secondary")} onClick={() => setSlug(slugify(slug))}>مرتب‌سازی</button>
                </div>
              </Field>
              <Field label="خلاصه (در فهرست مقالات و به‌عنوان توضیحات پیش‌فرض گوگل)" htmlFor="excerpt">
                <CountedInput id="excerpt" name="excerpt" defaultValue={initial.excerpt} max={200} multiline onValue={setExcerpt} />
              </Field>
            </div>
          </Card>

          <Card title="متن مقاله" actions={<button type="button" onClick={add} className={btnCls("secondary")}>+ افزودن بخش</button>}>
            <p className="-mt-2 mb-4 text-[12.5px] leading-6 text-ink3">
              هر بخش یک تیتر (اختیاری) و چند پاراگراف دارد. پاراگراف‌ها را با یک خط خالی از هم جدا کنید. تیترها در «فهرست مطالب» مقاله نمایش داده می‌شوند.
            </p>
            <ol className="space-y-4">
              {sections.map((s, i) => (
                <li key={s.key} className="rounded-[10px] border border-line bg-bg/60 p-4">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="text-[12px] font-bold text-ink3">بخش {(i + 1).toLocaleString("fa-IR")}</span>
                    <span className="mr-auto flex gap-1">
                      <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className={btnCls("ghost")} aria-label="انتقال به بالا">↑</button>
                      <button type="button" onClick={() => move(i, 1)} disabled={i === sections.length - 1} className={btnCls("ghost")} aria-label="انتقال به پایین">↓</button>
                      <button type="button" onClick={() => remove(s.key)} disabled={sections.length === 1} className={btnCls("ghost") + " text-err"}>حذف بخش</button>
                    </span>
                  </div>
                  <input
                    value={s.h}
                    onChange={(e) => update(s.key, { h: e.target.value })}
                    placeholder={i === 0 ? "تیتر (برای مقدمه می‌تواند خالی بماند)" : "تیتر بخش"}
                    aria-label={`تیتر بخش ${i + 1}`}
                    className={cn(inputCls, "font-bold")}
                  />
                  <textarea
                    value={s.text}
                    onChange={(e) => update(s.key, { text: e.target.value })}
                    rows={Math.min(18, Math.max(5, s.text.split("\n").length + 2))}
                    placeholder="متن پاراگراف‌ها…"
                    aria-label={`متن بخش ${i + 1}`}
                    className={cn(inputCls, "mt-2 leading-8")}
                  />
                </li>
              ))}
            </ol>
          </Card>

          <Card title="سئو و اشتراک‌گذاری">
            <div className="mb-5 rounded-[10px] border border-line bg-surface p-4" aria-label="پیش‌نمایش نتیجه گوگل">
              <p className="mb-2 text-[11.5px] font-bold text-ink3">پیش‌نمایش در نتایج گوگل</p>
              <p className="truncate text-[12.5px] text-[#4d5156]" dir="ltr">{siteUrl.replace(/^https?:\/\//, "")} › articles › {slug || "…"}</p>
              <p className="mt-1 truncate text-[18px] leading-7 text-[#1a0dab]">{serpTitle} | بهسا دیجیتال</p>
              <p className="mt-1 line-clamp-2 text-[13.5px] leading-6 text-[#4d5156]">{serpDesc}</p>
            </div>
            <div className="space-y-4">
              <Field label="عنوان سئو" htmlFor="seoTitle" hint="اگر خالی بماند، عنوان مقاله استفاده می‌شود. حدود ۶۰ نویسه.">
                <CountedInput id="seoTitle" name="seoTitle" defaultValue={initial.seoTitle} max={60} onValue={setSeoTitle} />
              </Field>
              <Field label="توضیحات متا" htmlFor="seoDescription" hint="اگر خالی بماند، خلاصه مقاله استفاده می‌شود. حدود ۱۲۰ تا ۱۶۰ نویسه.">
                <CountedInput id="seoDescription" name="seoDescription" defaultValue={initial.seoDescription} max={160} multiline onValue={setSeoDesc} />
              </Field>
              <Field label="تصویر اشتراک‌گذاری (Open Graph)" hint="در تلگرام، لینکدین و… نمایش داده می‌شود. اگر انتخاب نشود، تصویر شاخص یا تصویر پیش‌فرض سایت استفاده می‌شود. اندازه پیشنهادی ۶۳۰×۱۲۰۰.">
                <MediaPicker name="ogMediaId" defaultValue={initial.ogMediaId} options={media} />
              </Field>
              <details className="rounded-[8px] border border-line p-3">
                <summary className="cursor-pointer text-[13px] font-bold text-ink2">تنظیمات پیشرفته</summary>
                <div className="mt-4 space-y-4">
                  <Field label="آدرس Canonical" htmlFor="canonicalUrl" hint="فقط وقتی این مقاله کپی مطلبی در سایت دیگری است. در غیر این صورت خالی بگذارید.">
                    <input id="canonicalUrl" name="canonicalUrl" defaultValue={initial.canonicalUrl} dir="ltr" className={inputCls} placeholder="https://…" />
                  </Field>
                  <Toggle name="noindex" defaultChecked={initial.noindex} label="عدم نمایش در گوگل (noindex)" />
                </div>
              </details>
            </div>
          </Card>
        </div>

        {/* ── sidebar ── */}
        <div className="space-y-6 xl:sticky xl:top-20 xl:self-start">
          <Card title="انتشار">
            <div className="space-y-4">
              <Field label="وضعیت" htmlFor="status">
                <select id="status" name="status" defaultValue={initial.status} className={inputCls}>
                  <option value="draft">پیش‌نویس (روی سایت دیده نمی‌شود)</option>
                  <option value="published">منتشرشده</option>
                </select>
              </Field>
              <div className="grid grid-cols-[1fr_90px] gap-2">
                <Field label="تاریخ انتشار (شمسی)" htmlFor="publishedDate" hint="مثال: ۱۴۰۴/۰۸/۱۸ — تاریخ آینده یعنی انتشار زمان‌بندی‌شده.">
                  <input id="publishedDate" name="publishedDate" defaultValue={initial.publishedDate} dir="ltr" placeholder="1404/08/18" className={cn(inputCls, "fa-num")} />
                </Field>
                <Field label="ساعت" htmlFor="publishedTime">
                  <input id="publishedTime" name="publishedTime" defaultValue={initial.publishedTime} dir="ltr" placeholder="09:00" className={inputCls} />
                </Field>
              </div>
              <Toggle name="featured" defaultChecked={initial.featured} label="مقاله ویژه (بالای صفحه مقالات)" />
              <div className="flex flex-wrap gap-2 border-t border-linesoft pt-4">
                <SubmitButton className="flex-1">ذخیره</SubmitButton>
                {initial.id && (
                  <a href={`/api/preview?slug=${encodeURIComponent(initial.slug)}`} target="_blank" rel="noopener" className={btnCls("secondary")}>
                    پیش‌نمایش
                  </a>
                )}
              </div>
            </div>
          </Card>

          <Card title="دسته و نویسنده">
            <div className="space-y-4">
              <Field label="دسته‌بندی" htmlFor="categoryId">
                <select id="categoryId" name="categoryId" defaultValue={initial.categoryId ?? ""} className={inputCls}>
                  <option value="">بدون دسته</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="نام نویسنده" htmlFor="authorName">
                <input id="authorName" name="authorName" defaultValue={initial.authorName} className={inputCls} />
              </Field>
            </div>
          </Card>

          <Card title="تصویر شاخص">
            <MediaPicker name="coverMediaId" defaultValue={initial.coverMediaId} options={media} />
            <Field label="اگر تصویر انتخاب نشود، نمودار تزئینی:" htmlFor="chartStyle" className="mt-4">
              <select id="chartStyle" name="chartStyle" defaultValue={initial.chartStyle} className={inputCls}>
                <option value="area">نمودار سطحی</option>
                <option value="line">نمودار خطی</option>
                <option value="bars">نمودار ستونی</option>
                <option value="donut">نمودار دایره‌ای</option>
              </select>
            </Field>
          </Card>
        </div>
      </AdminForm>

      {initial.id && deleteAction && (
        <Card title="حذف مقاله" className="border-err/20">
          <AdminForm action={deleteAction} className="flex flex-wrap items-center justify-between gap-3">
            <input type="hidden" name="id" value={initial.id} />
            <p className="text-[13px] text-ink2">حذف قابل بازگشت نیست. برای پنهان‌کردن موقت، وضعیت را «پیش‌نویس» کنید.</p>
            <ConfirmSubmit label="حذف این مقاله" />
          </AdminForm>
        </Card>
      )}
    </div>
  );
}
