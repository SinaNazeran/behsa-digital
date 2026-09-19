import Link from "next/link";
import { listArticles } from "@/lib/admin-data";
import { Card, PageTitle } from "@/components/admin/ui";
import { btnCls } from "@/components/admin/styles";
import { formatJalali } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata = { title: "مقالات" };

export default async function ArticlesAdmin({ searchParams }: { searchParams: Promise<{ status?: string; deleted?: string }> }) {
  const { status, deleted } = await searchParams;
  const filter = status === "draft" || status === "published" ? status : undefined;
  const rows = await listArticles(filter);
  const tabs = [
    { label: "همه", href: "/admin/articles", on: !filter },
    { label: "منتشرشده", href: "/admin/articles?status=published", on: filter === "published" },
    { label: "پیش‌نویس", href: "/admin/articles?status=draft", on: filter === "draft" },
  ];

  return (
    <>
      <PageTitle title="مقالات" actions={<Link href="/admin/articles/new" className={btnCls("primary")}>+ مقاله جدید</Link>} />
      {deleted && <p role="status" className="mb-4 rounded-[8px] border border-accent/30 bg-accent-soft px-4 py-2.5 text-[13.5px] font-semibold text-ok">مقاله حذف شد.</p>}
      <Card>
        <div className="mb-4 flex gap-2">
          {tabs.map((t) => (
            <Link key={t.label} href={t.href} className={cn("rounded-[8px] px-3 py-1.5 text-[13px] font-bold", t.on ? "bg-primary text-white" : "bg-bg text-ink2 hover:text-orange-700")}>
              {t.label}
            </Link>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-[13.5px]">
            <thead>
              <tr className="border-b border-line text-right text-[12px] text-ink3">
                <th className="py-2 font-bold">عنوان</th>
                <th className="py-2 font-bold">دسته</th>
                <th className="py-2 font-bold">وضعیت</th>
                <th className="py-2 font-bold">تاریخ انتشار</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-linesoft">
              {rows.map((a) => (
                <tr key={a.id}>
                  <td className="py-3 pl-3">
                    <Link href={`/admin/articles/${a.id}`} className="font-semibold text-ink hover:text-orange-700">{a.title}</Link>
                    <span className="mt-0.5 block text-[11.5px] text-ink3" dir="ltr">/articles/{a.slug}</span>
                  </td>
                  <td className="py-3 text-ink2">{a.category ?? "—"}</td>
                  <td className="py-3">
                    <span className={cn("rounded-full px-2 py-0.5 text-[11.5px] font-bold", a.status === "published" ? "bg-accent-soft text-ok" : "bg-warnbg text-warn")}>
                      {a.status === "published" ? "منتشرشده" : "پیش‌نویس"}
                    </span>
                    {a.featured && <span className="mr-1.5 rounded-full bg-primary-soft px-2 py-0.5 text-[11.5px] font-bold text-orange-700">ویژه</span>}
                    {a.noindex && <span className="mr-1.5 rounded-full bg-bg px-2 py-0.5 text-[11.5px] font-bold text-ink3">noindex</span>}
                  </td>
                  <td className="py-3 text-ink2">{a.publishedAt ? formatJalali(a.publishedAt) : "—"}</td>
                  <td className="py-3 text-left">
                    <Link href={`/admin/articles/${a.id}`} className={btnCls("ghost")}>ویرایش</Link>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-ink2">مقاله‌ای یافت نشد.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
