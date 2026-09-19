"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import { Icon } from "@/components/icons";
import { Reveal, Btn, Badge, SectionHead, AlertCard, CountUp } from "@/components/ui";
import { AreaLine, DemandBars, PowerGauge, Donut, Spark, SERIES } from "@/components/charts";
import { Hero } from "@/components/hero/Hero";
import { ArticleCard, type ArticleCardProps } from "@/components/ArticleCard";
import { KPI_CARDS, ALERTS, DEMAND_BARS, faNum } from "@/content/data";
import { SmartLink } from "@/components/SmartLink";
import { AccentText } from "@/components/AccentText";
import type { ContentMap, SectionItemView, SectionView } from "@/lib/cms";

const MONTHLY = [62, 66, 61, 70, 74, 68, 77, 72, 80, 75, 71, 78, 83, 79, 86, 82, 76, 84, 88, 81, 78, 85, 90, 84, 80, 87, 92, 86, 89, 94];

export type HomeProps = {
  articles: ArticleCardProps[];
  testimonials: { quote: string; name: string; org: string }[];
  faqs: { q: string; a: string }[];
  /** editable page sections, keyed by the section registry */
  content: ContentMap;
  panelUrl: string;
};

const EMPTY_SECTION: SectionView = {
  key: "", eyebrow: "", title: "", description: "", ctaLabel: "", ctaHref: "",
  imageUrl: null, mobileImageUrl: null, videoUrl: "", videoEnabled: false, isActive: false, items: [],
};

/* Card counts are never assumed: every band renders whatever the CMS
   holds, and a band the editor switched off — or emptied — disappears
   instead of leaving a headline with nothing under it. */
const ordinal = (i: number) => faNum(String(i + 1).padStart(2, "0"));

export default function Home({ articles, testimonials, faqs, content, panelUrl }: HomeProps) {
  const [tab, setTab] = useState(0);
  const [faq, setFaq] = useState(0);
  const s = (key: string): SectionView => content[key] ?? EMPTY_SECTION;
  const pains = s("pains"), platform = s("platform"), solutions = s("solutions"), dashboard = s("dashboard");
  const features = s("features"), industries = s("industries"), benefits = s("benefits");
  const quotes = s("testimonials"), posts = s("articles"), faqHead = s("faq"), closing = s("cta");
  const t: SectionItemView | undefined = platform.items[Math.min(tab, platform.items.length - 1)];

  return (
    <>
      {/* ───────── 1 · HERO (Samsara-pattern, media-backed) ───────── */}
      <Hero hero={s("hero")} companies={s("companies")} />

      {/* ───────── 2 · Pain points ───────── */}
      {pains.isActive && pains.items.length > 0 && (
      <section className="relative py-20 md:py-24 bg-bg border-t border-line">
        <div className="absolute inset-0 grid-light" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <SectionHead eyebrow={pains.eyebrow} title={pains.title} lead={pains.description} />
            {pains.ctaLabel && (
              <Reveal delay={150} className="shrink-0">
                <Btn href={pains.ctaHref || "/services"} variant="secondary" icon="arrowL">{pains.ctaLabel}</Btn>
              </Reveal>
            )}
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {pains.items.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 90}>
                <article className="group relative h-full flex flex-col justify-between rounded-m border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:border-primary/40">
                  <span className="absolute top-0 inset-x-0 h-[3px] rounded-t-m bg-gradient-to-r from-transparent via-transparent to-transparent transition-colors duration-300 group-hover:via-primary" />
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-s bg-orange-50 text-orange-700 border border-orange-200/60 transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary">
                        <Icon name={p.icon ?? "alert"} size={22} />
                      </span>
                      <span className="font-display font-black text-[22px] text-neutral-300 group-hover:text-primary transition-colors fa-num">{ordinal(i)}</span>
                    </div>
                    <h3 className="mt-5 font-display font-bold text-[17px] text-ink leading-snug">{p.title}</h3>
                    {p.description && <p className="mt-3 text-[13.5px] leading-7 text-ink2">{p.description}</p>}
                  </div>
                  {p.tag && p.href && (
                    <div className="mt-6 pt-4 border-t border-linesoft">
                      <SmartLink
                        href={p.href}
                        className="inline-flex items-center gap-1.5 text-[13px] font-bold text-orange-700 hover:gap-2.5 transition-all"
                        onClick={p.href.startsWith("#") ? (e) => { e.preventDefault(); document.getElementById(p.href.slice(1))?.scrollIntoView({ behavior: "smooth" }); } : undefined}
                      >
                        {p.tag} <Icon name="arrowL" size={14} sw={2.2} />
                      </SmartLink>
                    </div>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ───────── 3 · Platform overview — tabs ───────── */}
      {platform.isActive && t && (
      <section className="relative py-20 md:py-24 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950 text-white overflow-hidden border-y border-blue-700/60">
        <div className="absolute inset-0 grid-dark opacity-35" />
        <div className="absolute -top-24 right-[5%] h-[320px] w-[460px] rounded-full bg-blue-500/15 blur-3xl glow-a pointer-events-none" />
        <div className="absolute -bottom-24 left-[5%] h-[320px] w-[460px] rounded-full bg-orange-500/10 blur-3xl glow-b pointer-events-none" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead eyebrow={platform.eyebrow} title={platform.title} lead={platform.description} dark={true} />

          <div className="mt-12 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3" role="tablist" aria-label="لایه‌های پلتفرم">
              {platform.items.map((p, i) => (
                <button
                  key={p.id} role="tab" aria-selected={tab === i} onClick={() => setTab(i)}
                  className={cn(
                    "flex items-center gap-3.5 rounded-m border p-4 text-right transition-all duration-200 cursor-pointer",
                    tab === i
                      ? "border-white/40 bg-white text-neutral-950 shadow-[0_12px_28px_rgb(0_32_70/0.45)]"
                      : "border-white/10 bg-white/[0.05] text-blue-100 hover:bg-white/[0.1] hover:border-white/20 hover:text-white backdrop-blur-sm",
                  )}
                >
                  <span className={cn(
                    "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-s transition-colors",
                    tab === i ? "bg-blue-600 text-white shadow-sm" : "bg-white/10 border border-white/15 text-blue-200",
                  )}>
                    <Icon name={p.icon ?? "monitor"} size={22} />
                  </span>
                  <span>
                    <span className="block font-display font-bold text-[15.5px]">{p.title}</span>
                    <span className={cn("block text-[11.5px] mt-0.5", tab === i ? "text-neutral-500" : "text-blue-200/80")}>
                      لایه {faNum(i + 1)} از {faNum(platform.items.length)}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8">
              <div key={tab} className="rv is-in h-full rounded-m border border-white/15 bg-blue-950/70 backdrop-blur-md p-7 md:p-9 shadow-dark flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/15 px-3.5 py-1 text-[12.5px] font-bold text-orange-300">
                      <Icon name={t.icon ?? "monitor"} size={14} />
                      {t.title}
                    </span>
                  </div>
                  {t.description && <p className="mt-4 text-[15.5px] leading-8 text-blue-100 max-w-2xl">{t.description}</p>}
                  <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                    {t.bullets.map((it, i) => (
                      <li key={it} className="rv is-in flex items-center gap-3 rounded-s border border-white/10 bg-white/[0.06] hover:bg-white/[0.1] px-4 py-3.5 text-[14px] font-semibold text-white transition-colors" style={{ transitionDelay: `${i * 60}ms` }}>
                        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                          <Icon name="check" size={14} sw={2.4} />
                        </span>
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-3">
                  <Btn
                    href={panelUrl}
                    target="_blank"
                    size="md"
                    variant="primary"
                    icon="login"
                    ariaLabel="ورود به سامانه بهسا دیجیتال (باز شدن در پنجره جدید)"
                  >
                    ورود به سامانه
                  </Btn>
                  {platform.ctaLabel && (
                    <Btn href={platform.ctaHref || "/product"} variant="dark" size="md" icon="arrowL">
                      {platform.ctaLabel}
                    </Btn>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ───────── 4 · Solutions ───────── */}
      {solutions.isActive && solutions.items.length > 0 && (
      <section id="solutions" className="py-20 md:py-24 bg-surface relative border-b border-line">
        <div className="absolute inset-0 grid-light" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead eyebrow={solutions.eyebrow} title={solutions.title} lead={solutions.description} align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.items.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 100}>
                <article className="group h-full rounded-m border border-line bg-bg p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:bg-surface hover:border-primary/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-s bg-primary-soft text-orange-700 border border-orange-200/50 transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary">
                        <Icon name={s.icon ?? "bolt"} size={23} />
                      </span>
                      {s.tag && <Badge tone="green">{s.tag}</Badge>}
                    </div>
                    <h3 className="mt-5 font-display font-bold text-[17px] text-ink leading-snug">{s.title}</h3>
                    {s.description && <p className="mt-2.5 text-[13.5px] leading-7 text-ink2">{s.description}</p>}
                  </div>
                  {s.href && (
                    <div className="mt-5 pt-4 border-t border-linesoft">
                      <SmartLink href={s.href} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-orange-700 hover:gap-2.5 transition-all">
                        بیشتر بدانید <Icon name="arrowL" size={14} sw={2.2} />
                      </SmartLink>
                    </div>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ───────── 5 · Dashboard showcase ───────── */}
      {dashboard.isActive && (
      <section className="relative py-20 md:py-24 bg-neutral-950 text-white overflow-hidden border-y border-neutral-800">
        <div className="absolute inset-0 grid-dark opacity-30" />
        <div className="absolute -top-32 right-[10%] h-[420px] w-[560px] rounded-full bg-blue-600/15 blur-3xl glow-a pointer-events-none" />
        <div className="absolute -bottom-40 left-[4%] h-[400px] w-[500px] rounded-full bg-orange-500/10 blur-3xl glow-b pointer-events-none" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <div>
            <SectionHead eyebrow={dashboard.eyebrow} title={dashboard.title} lead={dashboard.description} dark={true} />
          </div>

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {KPI_CARDS.map((k, i) => (
              <Reveal key={k.label} delay={i * 80}>
                <div className="rounded-m border border-white/10 bg-neutral-900/90 shadow-dark p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/40">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400"><Icon name={k.icon} size={20} /></span>
                    <span className={cn("inline-flex items-center gap-1 text-[11.5px] font-bold fa-num px-2 py-0.5 rounded-xs border", k.good ? "text-green-400 bg-green-500/10 border-green-500/20" : "text-red-400 bg-red-500/10 border-red-500/20")}>
                      <Icon name={k.good ? "check" : "alert"} size={12} sw={2.4} />
                      {k.delta}
                      <span className="sr-only">{k.good ? "— وضعیت مطلوب" : "— نیازمند بررسی"}</span>
                    </span>
                  </div>
                  <p className="mt-3 font-display font-black text-[25px] leading-none text-white fa-num">{k.value}</p>
                  <p className="mt-1.5 text-[11.5px] text-neutral-400">{k.label} <span className="text-neutral-500">({k.unit})</span></p>
                  <div className="mt-3"><Spark data={k.chart} color={k.good ? "#23AC6F" : "#E65F55"} /></div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <Reveal className="lg:col-span-2" delay={100}>
              <div className="h-full rounded-m border border-white/10 bg-neutral-900/90 shadow-dark p-6 backdrop-blur-sm text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-[15.5px] text-white">مصرف ۳۰ روز اخیر</h3>
                  <span className="flex items-center gap-4 text-[11.5px] text-neutral-400">
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" />مصرف (MWh)</span>
                  </span>
                </div>
                <AreaLine data={MONTHLY} height={230} color="#3788E7" yLabels={["۲۵", "۵۰", "۷۵"]} unit="۹۴ MWh" />
                <div className="mt-2 flex justify-between text-[11px] text-neutral-400">
                  <span>امروز</span><span>۳۰ روز پیش</span>
                </div>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="h-full rounded-m border border-white/10 bg-neutral-900/90 shadow-dark p-5 backdrop-blur-sm flex flex-col text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-[15.5px] text-white">هشدارها و رویدادها</h3>
                  <span className="inline-flex items-center gap-1.5 rounded-xs border border-red-500/30 bg-red-500/20 px-2.5 py-1 text-[12px] font-semibold text-red-300">
                    <Icon name="alert" size={13} sw={2} />
                    ۴ فعال
                  </span>
                </div>
                <div className="space-y-3 flex-1">
                  {ALERTS.map((a) => <AlertCard key={a.title} {...a} dark={true} />)}
                </div>
              </div>
            </Reveal>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <Reveal delay={0}>
              <div className="h-full rounded-m border border-white/10 bg-neutral-900/90 shadow-dark p-6 backdrop-blur-sm text-white">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-bold text-[15.5px] text-white">دیماند روزانه</h3>
                  <span className="text-[11.5px] text-amber-400 fa-num font-bold">۱ روز بحرانی</span>
                </div>
                <DemandBars data={DEMAND_BARS} labels={["امروز", "۱۴ روز پیش"]} />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="h-full rounded-m border border-white/10 bg-neutral-900/90 shadow-dark p-6 backdrop-blur-sm flex flex-col text-white">
                <h3 className="font-display font-bold text-[15.5px] mb-3 text-white">سبد منابع انرژی</h3>
                <div className="grid grid-cols-2 items-center gap-3 flex-1">
                  <Donut segments={[{ v: 68, c: SERIES.grid }, { v: 22, c: SERIES.solar }, { v: 10, c: SERIES.deep }]} centerTop="۶۸٪" centerBottom="شبکه سراسری" />
                  <ul className="space-y-2.5 text-[12px]">
                    <li className="flex items-center gap-2 text-neutral-300"><span className="h-2.5 w-2.5 rounded-[3px] bg-blue-500" />شبکه سراسری</li>
                    <li className="flex items-center gap-2 text-neutral-300"><span className="h-2.5 w-2.5 rounded-[3px] bg-orange-500" />نیروگاه خورشیدی</li>
                    <li className="flex items-center gap-2 text-neutral-300"><span className="h-2.5 w-2.5 rounded-[3px] bg-orange-800" />دیزل‌ژنراتور</li>
                  </ul>
                </div>
                <p className="mt-4 pt-4 border-t border-white/10 text-[12px] text-neutral-400">سهم انرژی پاک این ماه <span className="text-green-400 font-bold fa-num">+۴٫۱٪</span> رشد داشته است.</p>
              </div>
            </Reveal>
            <Reveal delay={240}>
              <div className="h-full rounded-m border border-white/10 bg-neutral-900/90 shadow-dark p-6 backdrop-blur-sm flex flex-col text-white">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-display font-bold text-[15.5px] text-white">ضریب توان لحظه‌ای</h3>
                  <span className="inline-flex items-center gap-1.5 rounded-xs border border-green-500/30 bg-green-500/20 px-2.5 py-1 text-[12px] font-semibold text-green-300">
                    <Icon name="check" size={13} sw={2} />
                    مجاز
                  </span>
                </div>
                <PowerGauge value={0.94} />
                <p className="mt-3 text-[12px] leading-6 text-neutral-400">بانک خازنی ۶ پله فعال است؛ جریمه راکتیو این ماه <span className="text-green-400 font-bold">صفر</span> خواهد بود.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      )}

      {/* ───────── 6 · Features ───────── */}
      {features.isActive && features.items.length > 0 && (
      <section className="py-20 md:py-24 bg-surface border-b border-line">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead eyebrow={features.eyebrow} title={features.title} lead={features.description} />
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {features.items.map((f, i) => (
              <Reveal key={f.id} delay={(i % 5) * 70}>
                <div className="group h-full rounded-m border border-line bg-bg p-5 transition-all duration-300 hover:bg-surface hover:border-primary/40 hover:shadow-lift hover:-translate-y-1 flex flex-col justify-between">
                  <div>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-s bg-surface border border-line text-orange-700 transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary">
                      <Icon name={f.icon ?? "bolt"} size={21} />
                    </span>
                    <h3 className="mt-4 font-display font-bold text-[14.5px] text-ink leading-6">{f.title}</h3>
                  </div>
                  {f.description && <p className="mt-2 text-[12.5px] leading-6 text-ink2">{f.description}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ───────── 7 · Industries ───────── */}
      {industries.isActive && industries.items.length > 0 && (
      <section className="py-20 md:py-24 bg-bg relative border-b border-line">
        <div className="absolute inset-0 grid-light" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead eyebrow={industries.eyebrow} title={industries.title} lead={industries.description} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.items.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 90}>
                <article className="group h-full rounded-m border border-line bg-surface p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:border-primary/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="inline-flex h-13 w-13 shrink-0 items-center justify-center rounded-s bg-blue-50 border border-blue-200/60 text-blue-700 transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary">
                        <Icon name={s.icon ?? "org"} size={25} />
                      </span>
                      <h3 className="font-display font-bold text-[17px] text-ink">{s.title}</h3>
                    </div>
                    {s.description && <p className="mt-4 text-[13.5px] leading-7 text-ink2">{s.description}</p>}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ───────── 8 · Benefits ───────── */}
      {benefits.isActive && benefits.items.length > 0 && (
      <section className="relative py-20 md:py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white overflow-hidden border-y border-blue-700/60">
        <div className="absolute inset-0 grid-dark opacity-35" />
        <div className="absolute -top-24 left-[10%] h-[340px] w-[480px] rounded-full bg-blue-500/15 blur-3xl glow-a pointer-events-none" />
        <div className="absolute -bottom-28 right-[10%] h-[340px] w-[480px] rounded-full bg-orange-500/10 blur-3xl glow-b pointer-events-none" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <SectionHead eyebrow={benefits.eyebrow} title={benefits.title} lead={benefits.description} dark={true} />
                <Reveal delay={200}>
                  <div className="mt-8 rounded-m border border-white/20 bg-blue-950/70 backdrop-blur-md p-7 shadow-dark">
                    <div className="flex items-center justify-between">
                      <span className="text-[13.5px] font-bold text-blue-100">میانگین بازگشت سرمایه</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/20 px-3 py-1 text-[12px] font-bold text-green-300">
                        <Icon name="check" size={13} sw={2} />
                        کمتر از ۶ ماه
                      </span>
                    </div>
                    <p className="mt-4 font-display font-black text-[46px] leading-none text-orange-400">
                      <CountUp to={312} suffix="٪" />
                    </p>
                    <p className="mt-2.5 text-[12.5px] text-blue-200/80">بر اساس نتایج مستقرسازی‌های ۱۴۰۳</p>
                  </div>
                </Reveal>
              </div>
            </div>
            <div className="lg:col-span-8 grid gap-4 sm:grid-cols-2">
              {benefits.items.map((b, i) => (
                <Reveal key={b.id} delay={(i % 2) * 100}>
                  <div className="group flex h-full items-start gap-4 rounded-m border border-white/12 bg-white/[0.06] p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.12] hover:border-white/25 hover:-translate-y-1">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-s bg-white/10 border border-white/15 text-green-400 transition-transform duration-300 group-hover:scale-110">
                      <Icon name={b.icon ?? "check"} size={21} />
                    </span>
                    <div>
                      <h3 className="font-display font-bold text-[16px] text-white">{b.title}</h3>
                      {b.description && <p className="mt-2 text-[13.5px] leading-7 text-blue-100">{b.description}</p>}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ───────── 9 · Testimonials ───────── */}
      {quotes.isActive && testimonials.length > 0 && (
      <section className="relative py-20 md:py-24 bg-surface text-ink overflow-hidden border-b border-line">
        <div className="absolute inset-0 grid-light" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_90%_10%,rgb(0_98_189/0.07),transparent_65%)] pointer-events-none" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <SectionHead eyebrow={quotes.eyebrow} title={quotes.title} lead={quotes.description} />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {testimonials.map((t, i) => (
              <Reveal key={`${t.name}-${i}`} delay={i * 120} dir={i % 2 ? "l" : "r"}>
                <figure className="relative h-full flex flex-col justify-between rounded-m border border-line bg-bg p-8 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:border-primary/40">
                  <svg viewBox="0 0 40 32" className="absolute top-7 left-8 w-9 h-auto text-blue-600/10 pointer-events-none" fill="currentColor" aria-hidden="true">
                    <path d="M0 32V19.2C0 8 6.4 1.3 16.6 0l1.9 5.4c-5.7 1.6-8.7 5-9.2 9.4h7.7V32H0Zm23 0V19.2C23 8 29.4 1.3 39.6 0l1.9 5.4c-5.7 1.6-8.7 5-9.2 9.4H40V32H23Z" transform="scale(-1,1) translate(-41,0)" />
                  </svg>
                  <blockquote className="text-[16px] leading-8 text-ink font-medium">«{t.quote}»</blockquote>
                  <figcaption className="mt-6 flex flex-wrap items-center gap-4 pt-5 border-t border-linesoft">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-display font-extrabold text-[17px]">
                      {t.name.charAt(0)}
                    </span>
                    <span className="flex-1 min-w-[140px]">
                      <span className="block text-[14.5px] font-bold text-ink">{t.name}</span>
                      <span className="block text-[12.5px] text-ink3 mt-0.5">{t.org}</span>
                    </span>
                    <Badge tone="green" icon="check">نتیجه تأییدشده</Badge>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ───────── 10 · Articles preview ───────── */}
      {posts.isActive && articles.length > 0 && (
      <section className="relative py-20 md:py-24 bg-bg border-b border-line">
        <div className="absolute inset-0 grid-light" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <SectionHead eyebrow={posts.eyebrow} title={posts.title} lead={posts.description} />
            {posts.ctaLabel && (
              <Reveal delay={150} className="shrink-0">
                <Btn href={posts.ctaHref || "/articles"} variant="secondary" icon="arrowL">{posts.ctaLabel}</Btn>
              </Reveal>
            )}
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {articles.slice(0, 3).map((a, i) => (
              <Reveal key={a.slug} delay={i * 100}>
                <ArticleCard {...a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ───────── 11 · FAQ ───────── */}
      {faqHead.isActive && faqs.length > 0 && (
      <section className="py-20 md:py-24 bg-surface border-b border-line">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <SectionHead eyebrow={faqHead.eyebrow} title={faqHead.title} lead={faqHead.description} />
                <Reveal delay={200}>
                  <div className="mt-8 rounded-m border border-line bg-bg p-6 shadow-card transition-colors hover:border-primary/40">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-s bg-primary-soft text-orange-700 border border-orange-200/50">
                      <Icon name="consultant" size={23} />
                    </span>
                    <p className="mt-4 font-display font-bold text-[16.5px] text-ink">پاسخ خود را پیدا نکردید؟</p>
                    <p className="mt-2.5 text-[13.5px] leading-7 text-ink2">سؤال فنی یا شرایط خاص مجموعه‌تان را بپرسید؛ کارشناسان ما کمتر از ۲۴ ساعت کاری پاسخ می‌دهند.</p>
                    <Btn href="/contact" variant="secondary" size="sm" className="mt-5" icon="arrowL">تماس با ما</Btn>
                  </div>
                </Reveal>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              {faqs.map((f, i) => (
                <Reveal key={f.q} delay={i * 70}>
                  <div className={cn(
                    "rounded-m border overflow-hidden transition-all duration-300",
                    faq === i ? "border-primary/50 bg-surface shadow-card" : "border-line bg-bg hover:border-primary/30",
                  )}>
                    <button
                      onClick={() => setFaq(faq === i ? -1 : i)}
                      aria-expanded={faq === i}
                      aria-controls={`faq-panel-${i}`}
                      className="group flex w-full items-center gap-4 px-6 py-5 text-right cursor-pointer"
                    >
                      <span className={cn(
                        "font-display font-black text-[16px] shrink-0 fa-num transition-colors",
                        faq === i ? "text-orange-700" : "text-neutral-400 group-hover:text-orange-700/60",
                      )}>
                        {ordinal(i)}
                      </span>
                      <span className={cn(
                        "flex-1 font-display font-bold text-[15.5px] md:text-[16.5px] leading-7 transition-colors",
                        faq === i ? "text-orange-700" : "text-ink group-hover:text-orange-700",
                      )}>
                        {f.q}
                      </span>
                      <span className={cn(
                        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-s border transition-all duration-300",
                        faq === i
                          ? "rotate-45 bg-primary border-primary text-on-primary"
                          : "border-line bg-surface text-ink2 group-hover:border-primary/40 group-hover:text-orange-700",
                      )}>
                        <Icon name="x" size={15} sw={2.4} />
                      </span>
                    </button>
                    <div id={`faq-panel-${i}`} className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-out",
                      faq === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}>
                      <div className="overflow-hidden">
                        <p className="px-6 pb-6 pr-[62px] text-[14px] leading-8 text-ink2">{f.a}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ───────── 12 · Final CTA ───────── */}
      {/* The closing band is blue, not a full-bleed orange: white on #fa6400
          is 3.05:1, and a page-wide orange field competes with the very button
          it is meant to frame. Orange stays on the button alone. */}
      {closing.isActive && (
      <section className="relative overflow-hidden bg-gradient-to-l from-blue-900 via-blue-800 to-blue-900 text-white border-t border-blue-700/50">
        <div className="absolute inset-0 opacity-[0.14]" style={{ backgroundImage: "linear-gradient(to left, rgb(255 255 255 / 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.5) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
        <div className="absolute -top-32 right-[18%] h-[340px] w-[480px] rounded-full bg-white/10 blur-3xl glow-a pointer-events-none" />
        <div className="absolute -bottom-32 left-[18%] h-[340px] w-[480px] rounded-full bg-orange-500/10 blur-3xl glow-b pointer-events-none" />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-8 py-20 md:py-28 text-center">
          <Reveal>
            <span className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-l bg-white/15 border border-white/25 text-white shadow-lift">
              <Icon name="bolt" size={28} />
            </span>
            {closing.title && (
              <h2 className="font-display font-black text-[28px] md:text-[40px] leading-[1.45] tracking-tight max-w-3xl mx-auto">
                <AccentText text={closing.title} accentClass="text-orange-300" />
              </h2>
            )}
            {closing.description && (
              <p className="mt-5 text-[15.5px] leading-8 text-neutral-200 max-w-xl mx-auto">
                {closing.description}
              </p>
            )}
            {closing.items.length > 0 && (
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                {closing.items.map((b, i) => {
                  const external = !b.href.startsWith("/");
                  return (
                    <Btn
                      key={b.id}
                      href={b.href || "#"}
                      target={external ? "_blank" : undefined}
                      size="lg"
                      variant={i === 0 ? "primary" : "dark"}
                      icon={i === 0 ? "login" : undefined}
                      ariaLabel={external ? `${b.title} (باز شدن در پنجره جدید)` : undefined}
                    >
                      {b.title}
                    </Btn>
                  );
                })}
              </div>
            )}
          </Reveal>
        </div>
      </section>
      )}
    </>
  );
}

/* shared article card (used in home + articles page) */
