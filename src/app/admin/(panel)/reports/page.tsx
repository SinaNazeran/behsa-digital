import Link from "next/link";
import { listReports } from "@/lib/admin-data";
import { Card, PageTitle } from "@/components/admin/ui";
import { btnCls } from "@/components/admin/styles";
import { formatJalali } from "@/lib/format";
import { cn } from "@/lib/utils";
import { REPORT_MENU_LIMIT } from "@/content/reports";

export const metadata = { title: "گزارش‌ها" };

export default async function ReportsAdmin({ searchParams }: { searchParams: Promise<{ status?: string; deleted?: string }> }) {
  const { status, deleted } = await searchParams;
  const filter = status === "draft" || status === "published" ? status : undefined;
  const all = await listReports();
  /* the same rule the header menu applies: first published reports of each category */
  const inMenu = new Set<number>();
  const perCategory = new Map<number, number>();
  for (const r of all) {
    if (r.status !== "published") continue;
    const n = (perCategory.get(r.categoryId) ?? 0) + 1;
    perCategory.set(r.categoryId, n);
    if (n <= REPORT_MENU_LIMIT) inMenu.add(r.id);
  }
  const rows = all.filter((r) => !filter || r.status === filter);
  const tabs = [
    { label: "همه", href: "/admin/reports", on: !filter },
    { label: "منتشرشده", href: "/admin/reports?status=published", on: filter === "published" },
    { label: "پیش‌نویس", href: "/admin/reports?status=draft", on: filter === "draft" },
  ];

  return (
    <>
      <PageTitle
        title="گزارش‌ها"
        lead="هر گزارش یک صفحه در /reports دارد. ترتیب این فهرست همان ترتیب صفحهٔ گزارش‌های سایت است: اول دسته، بعد ترتیب داخل دسته. گزارش‌هایی که برچسب «در منو» دارند در منوی بالای سایت هم نمایش داده می‌شوند."
        actions={
          <div className="flex gap-2">
            <Link href="/admin/report-categories" className={btnCls("secondary")}>دسته‌بندی‌ها</Link>
            <Link href="/admin/reports/new" className={btnCls("primary")}>+ گزارش جدید</Link>
          </div>
        }
      />
      {deleted && <p role="status" className="mb-4 rounded-[8px] border border-accent/30 bg-accent-soft px-4 py-2.5 text-[13.5px] font-semibold text-ok">گزارش حذف شد.</p>}
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
                <th className="py-2 font-bold">گزارش</th>
                <th className="py-2 font-bold">دسته</th>
                <th className="py-2 font-bold">وضعیت</th>
                <th className="py-2 font-bold">آخرین ویرایش</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-linesoft">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="py-3 pl-3">
                    <Link href={`/admin/reports/${r.id}`} className="font-semibold text-ink hover:text-orange-700">{r.menuTitle || r.title}</Link>
                    <span className="mt-0.5 block text-[11.5px] text-ink3" dir="ltr">/reports/{r.slug}</span>
                  </td>
                  <td className="py-3 text-ink2">{r.category}</td>
                  <td className="py-3">
                    <span className={cn("rounded-full px-2 py-0.5 text-[11.5px] font-bold", r.status === "published" ? "bg-accent-soft text-ok" : "bg-warnbg text-warn")}>
                      {r.status === "published" ? "منتشرشده" : "پیش‌نویس"}
                    </span>
                    {inMenu.has(r.id) && <span className="mr-1.5 rounded-full bg-primary-soft px-2 py-0.5 text-[11.5px] font-bold text-orange-700">در منو</span>}
                    {r.noindex && <span className="mr-1.5 rounded-full bg-bg px-2 py-0.5 text-[11.5px] font-bold text-ink3">noindex</span>}
                  </td>
                  <td className="py-3 text-ink2">{formatJalali(r.updatedAt)}</td>
                  <td className="py-3 text-left">
                    <Link href={`/admin/reports/${r.id}`} className={btnCls("ghost")}>ویرایش</Link>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-ink2">گزارشی یافت نشد.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
