import { Icon } from "@/components/icons";
import { Reveal, PageHero, HERO_PANEL } from "@/components/ui";
import { cn } from "@/utils/cn";
import { PanelCta } from "@/views/Landing";
import { ReportFinder, type FinderCategory, type FinderReport } from "@/components/ReportFinder";

/* /reports — the full catalogue, grouped by the decision each category
   serves, with search and an audience filter (ReportFinder). No report
   count in the copy (docs/content-strategy.md §L4). */

export default function Reports({ lead, categories, reports, panelUrl }: {
  lead: string;
  /** only categories that have at least one published report */
  categories: FinderCategory[];
  reports: FinderReport[];
  panelUrl: string;
}) {
  return (
    <>
      <PageHero crumb={[{ label: "خانه", path: "/" }, { label: "گزارش‌ها" }]} title="گزارش‌های سامانه" lead={lead} tone="report" eyebrow={{ label: "هر گزارش، یک تصمیم", icon: "chart" }}>
        {categories.length > 1 && (
          <Reveal dir="l" delay={150}>
            <nav aria-label="دسته‌های گزارش" className={cn(HERO_PANEL, "p-2")}>
              <p className="flex items-center gap-2 px-3 pt-2 pb-1.5 text-[12px] font-bold text-white/75">
                <Icon name="board" size={14} />
                پرش به دسته — هر دسته به یک پرسش پاسخ می‌دهد
              </p>
              <ul className="grid gap-0.5">
                {categories.map((category) => (
                  <li key={category.id}>
                    <a href={`#${category.slug}`} className="group flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-white/10">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-white/10 text-orange-200 ring-1 ring-white/15 transition-colors group-hover:bg-primary group-hover:text-on-primary group-hover:ring-transparent">
                        {category.icon ? <Icon name={category.icon} size={17} /> : <Icon name="chart" size={17} />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13.5px] font-bold text-white">{category.name}</span>
                        {category.question && <span className="mt-0.5 block truncate text-[12px] text-blue-100/85">{category.question}</span>}
                      </span>
                      <Icon name="chevron" size={15} className="shrink-0 text-white/45 transition-all group-hover:translate-y-0.5 group-hover:text-white" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        )}
      </PageHero>

      <section className="py-16 md:py-20 bg-bg relative">
        <div className="absolute inset-0 grid-light grid-fade" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          {reports.length === 0 ? (
            <p className="rounded-sheet border border-line bg-surface p-8 text-center text-[15px] text-ink2 shadow-card">گزارشی منتشر نشده است.</p>
          ) : (
            <ReportFinder categories={categories} reports={reports} />
          )}
        </div>
      </section>

      <PanelCta title="گزارش‌ها را روی دادهٔ مجموعهٔ خودتان ببینید." panelUrl={panelUrl} />
    </>
  );
}
