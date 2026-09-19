import Link from "next/link";
import { PageTitle } from "@/components/admin/ui";
import { sectionSummaries } from "@/lib/admin-data";

export const metadata = { title: "بخش‌های صفحه اصلی" };

export default async function SectionsAdmin() {
  const rows = await sectionSummaries();
  return (
    <>
      <PageTitle
        title="بخش‌های صفحه اصلی"
        lead="هر بخش صفحهٔ اصلی را جداگانه ویرایش کنید: عنوان، متن، کارت‌ها و ترتیب آن‌ها. بخشی که «پنهان» شود، روی سایت نمایش داده نمی‌شود."
      />
      <ul className="grid gap-3 md:grid-cols-2">
        {rows.map(({ def, isActive, items }) => (
          <li key={def.key}>
            <Link
              href={`/admin/sections/${def.key}`}
              className="flex h-full flex-col rounded-[12px] border border-line bg-surface p-5 transition-colors hover:border-primary/40"
            >
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-display text-[15px] font-extrabold text-ink">{def.label}</span>
                {!isActive && <span className="rounded-full bg-warnbg px-2.5 py-0.5 text-[11.5px] font-bold text-warn">پنهان</span>}
                {def.items && (
                  <span className="rounded-full bg-bg px-2.5 py-0.5 text-[11.5px] font-bold text-ink3 fa-num">
                    {items.toLocaleString("fa-IR")} مورد
                  </span>
                )}
              </span>
              <span className="mt-2 text-[13px] leading-6 text-ink2">{def.hint}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
