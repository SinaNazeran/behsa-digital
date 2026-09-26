"use client";

import { useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import { SmartLink } from "@/components/SmartLink";
import { Btn } from "@/components/ui";
import { REPORT_AUDIENCES, matchesQuery } from "@/content/reports";
import { faNum } from "@/lib/format";
import { cn } from "@/lib/utils";

/* Search + audience filter for /reports. The server renders the full,
   unfiltered catalogue (what search engines and no-JS visitors get);
   the filter only hides cards, and its state lives in the URL
   (?q=…&audience=…) so a filtered view can be shared. */

export type FinderCategory = { id: number; slug: string; name: string; question: string; icon?: IconName; toneClass: string };
export type FinderReport = {
  id: number;
  href: string;
  label: string;
  question: string;
  icon?: IconName;
  categoryId: number;
  audiences: string[];
  audienceKeys: string[];
  search: string;
};

export function ReportFinder({ categories, reports }: { categories: FinderCategory[]; reports: FinderReport[] }) {
  const [query, setQuery] = useState("");
  const [audiences, setAudiences] = useState<string[]>([]);
  /* the address is written only after it has been read, or the first
     sync would erase the ?q= a visitor arrived with */
  const [ready, setReady] = useState(false);

  /* read the filter from the address once hydrated — the menu's search box lands here with ?q= */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") ?? "");
    setAudiences((params.get("audience") ?? "").split(",").filter((k) => REPORT_AUDIENCES.some((a) => a.key === k)));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (audiences.length) params.set("audience", audiences.join(","));
    const qs = params.toString();
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`);
  }, [ready, query, audiences]);

  const active = query.trim() !== "" || audiences.length > 0;
  const visible = reports.filter(
    (r) => matchesQuery(r.search, query) && (audiences.length === 0 || r.audienceKeys.some((k) => audiences.includes(k))),
  );
  const groups = categories
    .map((category) => ({ category, reports: visible.filter((r) => r.categoryId === category.id) }))
    .filter((g) => g.reports.length > 0);
  /* offer only audiences some report is actually written for */
  const audienceOptions = REPORT_AUDIENCES.filter((a) => reports.some((r) => r.audienceKeys.includes(a.key)));

  const toggle = (key: string) =>
    setAudiences((xs) => (xs.includes(key) ? xs.filter((x) => x !== key) : [...xs, key]));
  const clear = () => { setQuery(""); setAudiences([]); };

  return (
    <div className="space-y-12">
      <div className="rounded-sheet border border-line bg-surface p-5 md:p-6 space-y-4 shadow-card">
        <label htmlFor="report-search" className="sr-only">جستجوی گزارش</label>
        <div className="relative">
          <Icon name="search" size={18} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink3" />
          <input
            id="report-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو، مثلاً «جریمهٔ راکتیو» یا «پیک مصرف»"
            className="h-12 w-full rounded-control border border-line bg-bg pr-11 pl-4 text-[14.5px] text-ink placeholder:text-ink3 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          />
        </div>
        {audienceOptions.length > 1 && (
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="فیلتر مخاطب">
            <span className="ml-1 text-[12.5px] font-bold text-ink3">برای:</span>
            {audienceOptions.map((a) => {
              const on = audiences.includes(a.key);
              return (
                <button
                  key={a.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(a.key)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    on ? "border-primary bg-primary-soft text-orange-700" : "border-line bg-bg text-ink2 hover:border-primary/40 hover:text-orange-700",
                  )}
                >
                  {a.label}
                </button>
              );
            })}
          </div>
        )}
        {/* announced to screen readers; the count is feedback on the filter, not a claim about the catalogue */}
        <div aria-live="polite" className="flex min-h-6 flex-wrap items-center gap-3 text-[13px] text-ink2">
          {active && (
            <>
              <span className="fa-num">{visible.length > 0 ? `${faNum(visible.length)} گزارش پیدا شد` : "گزارشی پیدا نشد"}</span>
              <button type="button" onClick={clear} className="font-bold text-orange-700 hover:text-primary-deep">پاک‌کردن فیلترها</button>
            </>
          )}
        </div>
      </div>

      {groups.length === 0 && (
        <div className="rounded-sheet border border-dashed border-line bg-surface p-8 text-center">
          <p className="font-display text-[17px] font-extrabold text-ink">گزارشی با این جستجو پیدا نشد</p>
          <p className="mx-auto mt-2 max-w-md text-[13.5px] leading-7 text-ink2">
            عبارت کوتاه‌تری امتحان کنید یا فیلترها را پاک کنید. اگر گزارشی را که لازم دارید پیدا نمی‌کنید،{" "}
            <SmartLink href="/contact" className="font-bold text-orange-700">با ما تماس بگیرید</SmartLink>.
          </p>
          <Btn variant="secondary" size="sm" className="mt-5" onClick={clear}>
            پاک‌کردن فیلترها
          </Btn>
        </div>
      )}

      {groups.map(({ category, reports: items }) => (
        <section key={category.id} id={category.slug} aria-labelledby={`cat-${category.slug}`} className={cn(category.toneClass, "scroll-mt-32")}>
          <h2 id={`cat-${category.slug}`} className="flex items-center gap-3 font-display font-extrabold text-[22px] md:text-[26px] text-ink">
            {category.icon && (
              <span className="kpi-icon h-10 w-10">
                <Icon name={category.icon} size={20} />
              </span>
            )}
            {category.name}
          </h2>
          {category.question && <p className="mt-2 text-[14.5px] leading-8 text-ink2">{category.question}</p>}
          <ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((r) => (
              <li key={r.id}>
                <SmartLink href={r.href} className="kpi-card card-live group flex h-full flex-col p-6">
                  {r.icon && (
                    <span className="kpi-icon h-11 w-11 group-hover:scale-110 group-hover:-rotate-6">
                      <Icon name={r.icon} size={21} />
                    </span>
                  )}
                  <h3 className="mt-5 font-display font-extrabold text-[16px] text-ink tracking-tight group-hover:text-(--tone-700) transition-colors">{r.label}</h3>
                  {r.question && <p className="mt-2 flex-1 text-[13px] leading-6.5 text-ink2">{r.question}</p>}
                  {r.audiences.length > 0 && <p className="mt-4 text-[12px] text-ink3">برای {r.audiences.join("، ")}</p>}
                </SmartLink>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
