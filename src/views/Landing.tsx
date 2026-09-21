import { Icon, type IconName } from "@/components/icons";
import { Reveal, Btn, Badge, PageHero } from "@/components/ui";
import type { LandingNode, NavLens } from "@/content/navigation";
import { capabilityBySlug } from "@/content/capabilities";
import { CapabilitiesOverview } from "@/components/capabilities/CapabilitiesOverview";
import { CapabilityFeatureList } from "@/components/capabilities/CapabilityFeatureList";
import { SmartLink } from "@/components/SmartLink";

/* Data-driven landing template — every nav slug resolves here.
   The `lens` field switches the messaging tone so capability /
   solution / industry pages never read alike. */

const LENS_META: Record<NavLens, { badge: string; tone: "blue" | "green" | "teal" | "amber" | "steel"; note: string }> = {
  feature: { badge: "قابلیت پلتفرم", tone: "blue", note: "این صفحه آنچه پلتفرم انجام می‌دهد را شرح می‌دهد: ورودی داده، مکانیزم تحلیل و خروجی گزارش — نه وعدهٔ کلی." },
  outcome: { badge: "راهکار کسب‌وکار", tone: "green", note: "این صفحه مسئلهٔ کسب‌وکار، اثر مالی مورد انتظار و شاخص‌هایی که بهبود می‌یابند را شرح می‌دهد." },
  vertical: { badge: "کاربرد صنعتی", tone: "teal", note: "این صفحه الگوی مصرف، تعرفه و سناریوی استقرارِ پلتفرم در این صنعت را شرح می‌دهد." },
  content: { badge: "منبع", tone: "steel", note: "محتوای این بخش توسط تیم تحلیل بهسا دیجیتال تولید و به‌روزرسانی می‌شود." },
  company: { badge: "درباره بهسا", tone: "amber", note: "این صفحه بخشی از هویت، تیم و همکاری‌های بهسا دیجیتال را معرفی می‌کند." },
};

export default function Landing({ node, siblings, linked, panelUrl }: {
  node: LandingNode;
  /** other entries of the same menu section */
  siblings: { id: number; title: string; href: string; icon?: IconName }[];
  /** capability ⇄ solution cross-links that resolved to a live page */
  linked: { slug: string; title: string; href: string }[];
  panelUrl: string;
}) {
  const meta = LENS_META[node.lens];
  const capability = capabilityBySlug(node.slug);
  const isPlatformIntro = node.slug === "product/platform";

  return (
    <>
      <PageHero
        crumb={[{ label: "خانه", path: "/" }, { label: node.section.title, path: `/${node.section.slug}` }, { label: node.title }]}
        title={node.title}
        lead={node.description}
      >
        <Reveal dir="l" delay={150}>
          <div className="rounded-m border border-line bg-surface p-5 shadow-lift space-y-3">
            <Badge tone={meta.tone} icon={node.icon}>{meta.badge}</Badge>
            <p className="text-[13px] leading-7 text-ink2">{meta.note}</p>
            {node.children && (
              <p className="pt-3 border-t border-linesoft text-[12.5px] font-bold text-ink fa-num">
                {node.children.length.toLocaleString("fa-IR")} زیربخش در این صفحه
              </p>
            )}
          </div>
        </Reveal>
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
                      <SmartLink href={c.href} className="group flex h-full flex-col rounded-m border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:border-primary/35">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-s bg-primary-soft text-orange-700 transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary">
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
                <div className="rounded-m border border-line bg-surface p-8">
                  <h2 className="font-display font-extrabold text-[20px] text-ink">{node.title}</h2>
                  <p className="mt-4 text-[15px] leading-8 text-ink2">{node.description}.</p>
                  <p className="mt-3 text-[15px] leading-8 text-ink2">
                    {meta.note} برای دیدن جزئیات اجرایی متناسب با مجموعهٔ خود با ما تماس بگیرید.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Btn href={panelUrl} target="_blank" icon="login" ariaLabel="ورود به سامانه بهسا دیجیتال (باز شدن در پنجره جدید)">ورود به سامانه</Btn>
                    <Btn href={node.section.href} variant="secondary">بازگشت به {node.section.title}</Btn>
                  </div>
                </div>
              </Reveal>
            )}

            {/* capability ⇄ solution cross-links */}
            {linked.length > 0 && (
              <Reveal className="mt-8">
                <div className="rounded-m border border-accent/25 bg-accent-soft/40 p-6">
                  <p className="flex items-center gap-2.5 font-display font-bold text-[15px] text-ink">
                    <Icon name="central" size={18} className="text-accent" />
                    این {meta.badge.toLowerCase()} کجا به‌کار می‌آید؟
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {linked.map((l) => (
                      <SmartLink key={l.slug} href={l.href} className="inline-flex items-center gap-2 rounded-s border border-line bg-surface px-4 py-2.5 text-[13px] font-bold text-ink transition-all hover:border-accent/50 hover:text-accent">
                        {l.title}
                        <Icon name="arrowL" size={13} sw={2.2} />
                      </SmartLink>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          {/* sibling rail */}
          {siblings.length > 0 && (
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-32 rounded-m border border-line bg-surface p-6">
                <p className="font-display font-bold text-[15px] text-ink">سایر موارد {node.section.title}</p>
                <ul className="mt-4 space-y-1">
                  {siblings.map((s) => (
                    <li key={s.id}>
                      <SmartLink href={s.href} className="group flex items-center gap-3 rounded-s px-3 py-2.5 text-[13.5px] font-semibold text-ink2 transition-colors hover:bg-bg hover:text-orange-700">
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

      {/* CTA band — the site has a single call to action, the panel */}
      <section className="relative overflow-hidden bg-bg border-t border-line text-ink">
        <div className="absolute inset-0 grid-light" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8 py-14 md:py-16 text-center">
          <Reveal>
            <h2 className="font-display font-black text-[22px] md:text-[30px] leading-[1.5]">
              {node.title} را روی دادهٔ مجموعهٔ خودتان ببینید.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[14.5px] leading-8 text-ink2">
              گزارش‌ها را با دادهٔ مصرف مجموعهٔ خودتان در سامانه ببینید.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Btn href={panelUrl} target="_blank" size="lg" icon="login" ariaLabel="ورود به سامانه بهسا دیجیتال (باز شدن در پنجره جدید)">
                ورود به سامانه
              </Btn>
              <Btn href="/contact" size="lg" variant="secondary">تماس با ما</Btn>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
