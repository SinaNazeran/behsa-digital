import { Icon } from "@/components/icons";
import { Reveal, PageHero } from "@/components/ui";
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
      <PageHero crumb={[{ label: "خانه", path: "/" }, { label: "گزارش‌ها" }]} title="گزارش‌های سامانه" lead={lead}>
        {categories.length > 1 && (
          <Reveal dir="l" delay={150}>
            <nav aria-label="دسته‌های گزارش" className="rounded-m border border-line bg-surface p-5 shadow-lift">
              <p className="text-[12px] font-bold text-ink3">پرش به دسته</p>
              <ul className="mt-3 space-y-1">
                {categories.map((category) => (
                  <li key={category.id}>
                    <a href={`#${category.slug}`} className="group flex items-center gap-3 rounded-s px-2.5 py-2 text-[13.5px] font-semibold text-ink2 transition-colors hover:bg-bg hover:text-orange-700">
                      {category.icon && <Icon name={category.icon} size={16} className="shrink-0 text-ink3 group-hover:text-orange-700" />}
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        )}
      </PageHero>

      <section className="py-16 md:py-20 bg-bg relative">
        <div className="absolute inset-0 grid-light" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          {reports.length === 0 ? (
            <p className="rounded-m border border-line bg-surface p-8 text-center text-[15px] text-ink2">گزارشی منتشر نشده است.</p>
          ) : (
            <ReportFinder categories={categories} reports={reports} />
          )}
        </div>
      </section>

      <PanelCta title="گزارش‌ها را روی دادهٔ مجموعهٔ خودتان ببینید." panelUrl={panelUrl} />
    </>
  );
}
