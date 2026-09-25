import { Icon, type IconName } from "@/components/icons";
import { Reveal, Btn, PageHero, CtaBanner, HERO_PANEL } from "@/components/ui";
import type { LandingNode, NavLens } from "@/content/navigation";
import { capabilityBySlug, STAGE_META, type NarrativeStage } from "@/content/capabilities";
import { cn } from "@/utils/cn";
import { CapabilitiesOverview } from "@/components/capabilities/CapabilitiesOverview";
import { CapabilityFeatureList } from "@/components/capabilities/CapabilityFeatureList";
import { SmartLink } from "@/components/SmartLink";

/* Data-driven landing template — every nav slug resolves here.
   The `lens` field switches the messaging tone so capability /
   solution / industry pages never read alike. */

const LENS_BADGE: Record<NavLens, string> = {
  feature: "قابلیت پلتفرم",
  outcome: "راهکار کسب‌وکار",
  vertical: "کاربرد صنعتی",
  content: "منبع",
  company: "درباره بهسا",
};

/* ── Hero side card ──
   Shown only when the page has something of its own to put there — the
   same rule the report pages follow. A section's own page gets none: its
   child grid sits right under the hero and would only be repeated. */

const STAGES = (Object.keys(STAGE_META) as NarrativeStage[]).sort((a, b) => STAGE_META[a].order - STAGE_META[b].order);

/** where a capability sits on the data → business-result chain */
function StageTrack({ stage }: { stage: NarrativeStage }) {
  const at = STAGE_META[stage].order;
  return (
    <div>
      <p className="flex items-center gap-2 text-[12px] font-bold text-white/75">
        <Icon name="central" size={14} />
        جایگاه در مسیر داده تا نتیجه
      </p>
      <ol className="mt-3 grid grid-cols-5 gap-1.5">
        {STAGES.map((s) => {
          const { order, label } = STAGE_META[s];
          return (
            <li key={s} aria-current={order === at ? "step" : undefined} className="min-w-0">
              <span className={cn("block h-1.5 rounded-full", order === at ? "bg-primary shadow-[0_0_12px_rgb(250_100_0/0.7)]" : order < at ? "bg-white/45" : "bg-white/15")} />
              <span className={cn("mt-2 block text-center text-[11px] leading-4", order === at ? "font-bold text-orange-200" : "text-white/65")}>{label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

const LINK_KIND: { prefix: string; label: string; icon: IconName }[] = [
  { prefix: "reports/", label: "گزارش", icon: "chart" },
  { prefix: "product/", label: "قابلیت", icon: "tech" },
  { prefix: "solutions/", label: "راهکار", icon: "decision" },
  { prefix: "industries/", label: "صنعت", icon: "factory" },
];

function RelatedLinks({ links }: { links: { slug: string; title: string; href: string }[] }) {
  return (
    <div>
      <p className="flex items-center gap-2 text-[12px] font-bold text-white/75">
        <Icon name="compare" size={14} />
        گزارش‌ها و صفحات مرتبط
      </p>
      <ul className="mt-2 grid gap-0.5">
        {links.map((l) => {
          const kind = LINK_KIND.find((k) => l.slug.startsWith(k.prefix));
          return (
            <li key={l.slug}>
              <SmartLink href={l.href} className="group -mx-2 flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-white/10">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-white/10 text-orange-200 ring-1 ring-white/15 transition-colors group-hover:bg-primary group-hover:text-on-primary group-hover:ring-transparent">
                  <Icon name={kind?.icon ?? "arrowL"} size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  {kind && <span className="block text-[11px] font-bold text-white/60">{kind.label}</span>}
                  <span className="block truncate text-[13.5px] font-bold text-white">{l.title}</span>
                </span>
                <Icon name="arrowL" size={14} sw={2.2} className="shrink-0 text-white/45 transition-all group-hover:-translate-x-1 group-hover:text-white" />
              </SmartLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Landing({ node, crumbs, siblings, linked, panelUrl }: {
  node: LandingNode;
  /** built once by the route, shared with the BreadcrumbList JSON-LD */
  crumbs: { label: string; path?: string }[];
  /** other entries of the same menu section */
  siblings: { id: number; title: string; href: string; icon?: IconName }[];
  /** capability ⇄ solution cross-links that resolved to a live page */
  linked: { slug: string; title: string; href: string }[];
  panelUrl: string;
}) {
  const badge = LENS_BADGE[node.lens];
  const capability = capabilityBySlug(node.slug);
  const isPlatformIntro = node.slug === "product/platform";
  /* the stage only means something on capability pages — every solution
     and industry page sits at "outcome", which would say nothing */
  const stage = node.lens === "feature" && capability ? capability.narrativeStage : undefined;

  return (
    <>
      <PageHero
        crumb={crumbs}
        title={node.title}
        lead={node.description}
        eyebrow={{ label: badge, icon: node.icon }}
        tone={node.lens}
      >
        {(stage || linked.length > 0) && (
          <Reveal dir="l" delay={150}>
            <div className={cn(HERO_PANEL, "bg-black/20! divide-y divide-white/15 [&>*]:py-4 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0")}>
              {stage && <StageTrack stage={stage} />}
              {linked.length > 0 && <RelatedLinks links={linked} />}
            </div>
          </Reveal>
        )}
      </PageHero>

      <section className="py-16 md:py-20 bg-bg relative">
        <div className="absolute inset-0 grid-light" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8 grid gap-10 lg:grid-cols-12">
          {/* main column */}
          <div className="lg:col-span-8">
            {isPlatformIntro ? (
              <CapabilitiesOverview />
            ) : capability ? (
              <CapabilityFeatureList category={capability} />
            ) : node.children ? (
              <>
                <Reveal>
                  <h2 className="font-display font-extrabold text-[22px] md:text-[26px] text-ink">در این بخش</h2>
                </Reveal>
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  {node.children.map((c, i) => (
                    <Reveal key={c.id} delay={(i % 2) * 90}>
                      <SmartLink href={c.href} className="group flex h-full flex-col rounded-md border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:border-primary/35">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-sm bg-primary-soft text-orange-700 transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary">
                          {c.icon && <Icon name={c.icon} size={23} />}
                        </span>
                        <h3 className="mt-4 font-display font-bold text-[16.5px] text-ink group-hover:text-orange-700 transition-colors">{c.title}</h3>
                        {c.description && <p className="mt-2 text-[13px] leading-6.5 text-ink2 flex-1">{c.description}</p>}
                        <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-orange-700">
                          مشاهده <Icon name="arrowL" size={13} sw={2.2} className="transition-transform group-hover:-translate-x-1" />
                        </span>
                      </SmartLink>
                    </Reveal>
                  ))}
                </div>
              </>
            ) : (
              <Reveal>
                <div className="rounded-md border border-line bg-surface p-8">
                  <h2 className="font-display font-extrabold text-[20px] text-ink">{node.title}</h2>
                  <p className="mt-4 text-[15px] leading-8 text-ink2">{node.description}.</p>
                  <p className="mt-3 text-[15px] leading-8 text-ink2">
                    برای دیدن جزئیات اجرایی متناسب با مجموعهٔ خود با ما تماس بگیرید.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Btn href={panelUrl} target="_blank" icon="login" ariaLabel="ورود به سامانه بهسا دیجیتال (باز شدن در پنجره جدید)">ورود به سامانه</Btn>
                    <Btn href={node.section.href} variant="secondary">بازگشت به {node.section.title}</Btn>
                  </div>
                </div>
              </Reveal>
            )}

          </div>

          {/* sibling rail */}
          {siblings.length > 0 && (
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-32 rounded-md border border-line bg-surface p-6">
                <p className="font-display font-bold text-[15px] text-ink">سایر موارد {node.section.title}</p>
                <ul className="mt-4 space-y-1">
                  {siblings.map((s) => (
                    <li key={s.id}>
                      <SmartLink href={s.href} className="group flex items-center gap-3 rounded-sm px-3 py-2.5 text-[13.5px] font-semibold text-ink2 transition-colors hover:bg-bg hover:text-orange-700">
                        {s.icon && <Icon name={s.icon} size={16} className="text-ink3 group-hover:text-orange-700" />}
                        {s.title}
                        <Icon name="arrowL" size={12} className="mr-auto opacity-0 transition-opacity group-hover:opacity-60" />
                      </SmartLink>
                    </li>
                  ))}
                </ul>
                <SmartLink href={node.section.href} className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-orange-700 hover:gap-3 transition-all">
                  همهٔ {node.section.title} <Icon name="arrowL" size={13} sw={2.2} />
                </SmartLink>
              </div>
            </aside>
          )}
        </div>
      </section>

      <PanelCta title={`*${node.title}* را روی دادهٔ مجموعهٔ خودتان ببینید.`} panelUrl={panelUrl} />
    </>
  );
}

/** closing banner — the site has a single call to action, the panel */
export function PanelCta({ title, panelUrl }: { title: string; panelUrl: string }) {
  return (
    <CtaBanner title={title} lead="گزارش‌ها را با دادهٔ مصرف مجموعهٔ خودتان در سامانه ببینید.">
      <Btn href={panelUrl} target="_blank" size="lg" icon="login" ariaLabel="ورود به سامانه بهسا دیجیتال (باز شدن در پنجره جدید)">
        ورود به سامانه
      </Btn>
      <Btn href="/contact" size="lg" variant="dark">تماس با ما</Btn>
    </CtaBanner>
  );
}
