import { Icon } from "@/components/icons";
import { Reveal, Badge, PageHero } from "@/components/ui";
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
  return (
    <>
      <PageHero
        crumb={[{ label: "خانه", path: "/" }, { label: "گزارش‌ها", path: "/reports" }, { label: report.label }]}
        title={report.title}
        lead={report.question}
      >
        <Reveal dir="l" delay={150}>
          <div className="rounded-m border border-line bg-surface p-5 shadow-lift space-y-4">
            <SmartLink href={`/reports#${report.category.slug}`} className="inline-flex">
              <Badge tone="teal" icon={report.category.icon}>{report.category.name}</Badge>
            </SmartLink>
            {report.audiences.length > 0 && (
              <div>
                <p className="text-[12px] font-bold text-ink3">برای چه کسی</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {report.audiences.map((a) => (
                    <li key={a} className="rounded-xs border border-line bg-bg px-2.5 py-1 text-[12.5px] font-semibold text-ink2">{a}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="border-t border-linesoft pt-3 text-[12.5px] text-ink3">
              آخرین به‌روزرسانی: <time dateTime={report.updatedAt} className="fa-num">{report.updated}</time>
            </p>
          </div>
        </Reveal>
      </PageHero>

      <section className="py-16 md:py-20 bg-bg relative">
        <div className="absolute inset-0 grid-light" />
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
                    <figure className="overflow-hidden rounded-m border border-line bg-surface">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={g.url} alt={g.caption || `نمونهٔ خروجی ${report.label}`} loading={i === 0 ? "eager" : "lazy"} className="w-full" />
                      {g.caption && <figcaption className="border-t border-linesoft px-5 py-3 text-[13px] leading-7 text-ink2">{g.caption}</figcaption>}
                    </figure>
                  </Reveal>
                ))}
              </div>
            )}

            {report.sections.length > 0 && <ContentBlocks blocks={report.sections} className="mt-8" />}

            {pages.length > 0 && (
              <Reveal className="mt-8">
                <div className="rounded-m border border-accent/25 bg-accent-soft/40 p-6">
                  <p className="flex items-center gap-2.5 font-display font-bold text-[15px] text-ink">
                    <Icon name="central" size={18} className="text-accent" />
                    این گزارش کجا به‌کار می‌آید؟
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {pages.map((p) => (
                      <SmartLink key={p.href} href={p.href} className="inline-flex items-center gap-2 rounded-s border border-line bg-surface px-4 py-2.5 text-[13px] font-bold text-ink transition-all hover:border-accent/50 hover:text-accent">
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
            <div className="lg:sticky lg:top-32 rounded-m border border-line bg-surface p-6">
              <p className="font-display font-bold text-[15px] text-ink">گزارش‌های مرتبط</p>
              {related.length > 0 && (
                <ul className="mt-4 space-y-1">
                  {related.map((r) => (
                    <li key={r.id}>
                      <SmartLink href={r.href} className="group flex items-center gap-3 rounded-s px-3 py-2.5 text-[13.5px] font-semibold text-ink2 transition-colors hover:bg-bg hover:text-orange-700">
                        {r.icon && <Icon name={r.icon} size={16} className="shrink-0 text-ink3 group-hover:text-orange-700" />}
                        {r.label}
                        <Icon name="arrowL" size={12} className="mr-auto shrink-0 opacity-0 transition-opacity group-hover:opacity-60" />
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              )}
              <SmartLink href="/reports" className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-orange-700 hover:gap-3 transition-all">
                همهٔ گزارش‌ها <Icon name="arrowL" size={13} sw={2.2} />
              </SmartLink>
            </div>
          </aside>
        </div>
      </section>

      <PanelCta title={`${report.label} را روی دادهٔ مجموعهٔ خودتان ببینید.`} panelUrl={panelUrl} />
    </>
  );
}
