import Link from "next/link";

import { AdminForm, Card, CountedInput, Field, PageTitle, SubmitButton, Toggle } from "@/components/admin/ui";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { listMediaOptions } from "@/lib/admin-data";
import { getAllPageSeo, getLandingIndex } from "@/lib/cms";
import { cn } from "@/lib/utils";
import { savePageSeo } from "../../_actions/settings";

export const metadata = { title: "سئوی صفحات" };

const CORE = [
  { path: "/", title: "صفحه اصلی" },
  { path: "/services", title: "خدمات" },
  { path: "/articles", title: "مقالات (فهرست)" },
  { path: "/about", title: "درباره ما" },
  { path: "/contact", title: "تماس با ما" },
];

export default async function SeoAdmin({ searchParams }: { searchParams: Promise<{ path?: string }> }) {
  const [{ path }, overrides, media, landings] = await Promise.all([
    searchParams, getAllPageSeo(), listMediaOptions(), getLandingIndex(),
  ]);
  const corePaths = new Set(CORE.map((c) => c.path));
  const pages = [
    ...CORE,
    ...Object.values(landings)
      .filter((n) => !corePaths.has(n.href))
      .map((n) => ({ path: n.href, title: `${n.section.title} › ${n.title}` })),
  ];
  const current = pages.find((p) => p.path === path) ?? pages[0];
  const o = overrides.find((x) => x.path === current.path);
  const has = new Set(overrides.map((x) => x.path));

  return (
    <>
      <PageTitle title="سئوی صفحات" lead="برای هر صفحه می‌توانید عنوان و توضیحاتی که گوگل نمایش می‌دهد را تغییر دهید. سئوی مقالات داخل ویرایشگر همان مقاله است." />
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <Card className="max-h-[70vh] overflow-y-auto p-2 md:p-2">
          <ul>
            {pages.map((p) => (
              <li key={p.path}>
                <Link
                  href={`/admin/seo?path=${encodeURIComponent(p.path)}`}
                  className={cn("flex items-center gap-2 rounded-[8px] px-3 py-2 text-[13px]", p.path === current.path ? "bg-primary-soft font-bold text-orange-700" : "text-ink2 hover:bg-bg")}
                >
                  <span className="min-w-0 flex-1 truncate">{p.title}</span>
                  {has.has(p.path) && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" title="تنظیمات اختصاصی دارد" />}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <Card title={current.title} actions={<a href={current.path} target="_blank" rel="noopener" className="text-[12.5px] font-bold text-orange-700" dir="ltr">{current.path} ↗</a>}>
          <AdminForm key={current.path} action={savePageSeo} className="space-y-4">
            <input type="hidden" name="path" value={current.path} />
            <Field label="عنوان در گوگل" htmlFor="title" hint="خالی = عنوان پیش‌فرض صفحه. عنوان اختصاصی بدون پسوند «| بهسا دیجیتال» نمایش داده می‌شود.">
              <CountedInput id="title" name="title" defaultValue={o?.title ?? ""} max={60} />
            </Field>
            <Field label="توضیحات متا" htmlFor="description">
              <CountedInput id="description" name="description" defaultValue={o?.description ?? ""} max={160} multiline />
            </Field>
            <Field label="تصویر اشتراک‌گذاری">
              <MediaPicker name="ogMediaId" defaultValue={o?.ogMediaId} options={media} />
            </Field>
            <Toggle name="noindex" defaultChecked={o?.noindex} label="عدم نمایش این صفحه در گوگل (noindex) و حذف از نقشه سایت" />
            <div className="border-t border-linesoft pt-4"><SubmitButton>ذخیره</SubmitButton></div>
          </AdminForm>
        </Card>
      </div>
    </>
  );
}
