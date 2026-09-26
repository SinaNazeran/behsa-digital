import { Icon } from "@/components/icons";
import { Reveal, PageHero, HERO_PANEL, SideNav } from "@/components/ui";
import { cn } from "@/utils/cn";
import { ContentBlocks } from "@/components/capabilities/CapabilityFeatureList";
import { SmartLink } from "@/components/SmartLink";
import { PanelCta } from "@/views/Landing";
import type { ReportView } from "@/lib/cms";

/* One fixed template for every report page. Editors fill fields in
   Admin → گزارش‌ها; the order of blocks here is not editable on purpose,
   so fifty reports still read as one catalogue. */

export default function ReportDetail({ report, related, pages, panelUrl }: {
  report: ReportView;
  /** hand-picked related reports, or same-category ones when none were picked */
  related: ReportView[];
  /** solution / capability / industry pages that resolved to a live page */
  pages: { href: string; label: string }[];
  panelUrl: string;
}) {
  /* the report wears its category's colour, as on the catalogue page */
  const tone = report.category.toneClass;
  return (
    <>
      <PageHero
        crumb={[{ label: "خانه", path: "/" }, { label: "گزارش‌ها", path: "/reports" }, { label: report.label }]}
        title={report.title}
        lead={report.question}
        tone="report"
        eyebrow={{ label: "گزارش سامانه", icon: report.icon ?? "chart" }}
      >
        <Reveal dir="l" delay={150}>
          <div className={cn(HERO_PANEL, "space-y-4")}>
            <SmartLink href={`/reports#${report.category.slug}`} className="group -m-1.5 flex items-center gap-3 rounded-md p-1.5 transition-colors hover:bg-white/10">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-primary text-on-primary shadow-[0_6px_16px_rgb(250_100_0/0.35)]">
                <Icon name={report.category.icon ?? "chart"} size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11.5px] font-bold text-white/70">دستهٔ گزارش</span>
                <span className="block text-[14.5px] font-bold text-white">{report.category.name}</span>
                {report.category.question && <span className="block text-[12px] text-blue-100/85">{report.category.question}</span>}
              </span>
              <Icon name="arrowL" size={14} sw={2.2} className="shrink-0 text-white/45 transition-all group-hover:-translate-x-1 group-hover:text-white" />
            </SmartLink>
            {report.audiences.length > 0 && (
              <div className="border-t border-white/15 pt-4">
                <p className="flex items-center gap-2 text-[12px] font-bold text-white/75"><Icon name="consultant" size={14} />برای چه کسی</p>
                <ul className="mt-2.5 flex flex-wrap gap-2">
                  {report.audiences.map((a) => (
                    <li key={a} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[12.5px] font-semibold text-white">{a}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="flex items-center gap-2 border-t border-white/15 pt-3 text-[12.5px] text-white/80">
              <Icon name="clock" size={14} />
              آخرین به‌روزرسانی: <time dateTime={report.updatedAt} className="fa-num">{report.updated}</time>
            </p>
          </div>
        </Reveal>
      </PageHero>

      <section className="py-16 md:py-20 bg-bg relative">
        <div className="absolute inset-0 grid-light grid-fade" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {report.lead && (
              <Reveal>
                <p className="text-[15.5px] leading-9 text-ink2">{report.lead}</p>
              </Reveal>
            )}

            {/* output screenshots — the block exists only once an editor adds one */}
            {report.gallery.length > 0 && (
              <div className="mt-8 space-y-6">
                {report.gallery.map((g, i) => (
                  <Reveal key={g.url + i}>
                    <figure className="overflow-hidden rounded-sheet border border-line bg-surface shadow-card">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={g.url} alt={g.caption || `نمونهٔ خروجی ${report.label}`} loading={i === 0 ? "eager" : "lazy"} className="w-full" />
                      {g.caption && <figcaption className="border-t border-linesoft px-5 py-3 text-[13px] leading-7 text-ink2">{g.caption}</figcaption>}
                    </figure>
                  </Reveal>
                ))}
              </div>
            )}

            {report.sections.length > 0 && <ContentBlocks blocks={report.sections} tone={tone} className="mt-8" />}

            {pages.length > 0 && (
              <Reveal className="mt-8">
                <div className="tone-green kpi-card p-6">
                  <p className="flex items-center gap-2.5 font-display font-bold text-[15px] text-ink">
                    <Icon name="central" size={18} className="text-accent" />
                    این گزارش کجا به‌کار می‌آید؟
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {pages.map((p) => (
                      <SmartLink key={p.href} href={p.href} className="inline-flex items-center gap-2 rounded-control border border-(--tone-200) bg-surface px-4 py-2.5 text-[13px] font-bold text-ink transition-all hover:border-(--tone-300) hover:bg-(--tone-50) hover:text-(--tone-700)">
                        {p.label}
                        <Icon name="arrowL" size={13} sw={2.2} />
                      </SmartLink>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          <aside className="lg:col-span-4">
            <SideNav
              title="گزارش‌های مرتبط"
              items={related.map((r) => ({ key: r.id, href: r.href, label: r.label, icon: r.icon ?? undefined }))}
              more={{ href: "/reports", label: "همهٔ گزارش‌ها" }}
              tone={tone}
            />
          </aside>
        </div>
      </section>

      <PanelCta title={`*${report.label}* را روی دادهٔ مجموعهٔ خودتان ببینید.`} panelUrl={panelUrl} />
    </>
  );
}
